import * as XLSX from 'xlsx';

/**
 * Format date values safely across Firestore Timestamps, ISO strings, and Date objects.
 */
export const formatDate = (val) => {
    if (!val) return 'N/A';
    try {
        if (typeof val?.toDate === 'function') {
            const d = val.toDate();
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (val?.seconds) {
            const d = new Date(val.seconds * 1000);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return String(val);
    }
};

/**
 * Extract Month-Year for cohort analysis
 */
export const getCohortMonth = (val) => {
    if (!val) return 'Unknown';
    try {
        let d;
        if (typeof val?.toDate === 'function') {
            d = val.toDate();
        } else if (val?.seconds) {
            d = new Date(val.seconds * 1000);
        } else {
            d = new Date(val);
        }
        if (isNaN(d.getTime())) return 'Unknown';
        return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    } catch {
        return 'Unknown';
    }
};

/**
 * Parse location into Area/Neighborhood and City/Region from service address
 */
export const parseLocation = (address) => {
    if (!address || typeof address !== 'string' || !address.trim()) {
        return { area: 'Unspecified', city: 'Accra / Ghana' };
    }
    const clean = address.trim();
    if (clean.includes(',')) {
        const parts = clean.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
            return {
                area: parts[0],
                city: parts.slice(1).join(', ')
            };
        }
        return { area: parts[0], city: 'Accra' };
    }
    return { area: clean, city: 'Accra' };
};

/**
 * Categorize service by project title or description
 */
export const detectServiceCategory = (title, desc) => {
    const text = `${title || ''} ${desc || ''}`.toLowerCase();
    if (text.includes('curtain') && text.includes('blind')) return 'Curtains & Blinds';
    if (text.includes('curtain') || text.includes('drapery') || text.includes('sheer')) return 'Curtains & Drapery';
    if (text.includes('blind') || text.includes('roller') || text.includes('zebra')) return 'Blinds & Shades';
    if (text.includes('3d') || text.includes('render') || text.includes('visualization')) return '3D Rendering & Visuals';
    if (text.includes('renovat') || text.includes('remodel')) return 'Home Renovation';
    if (text.includes('smart') || text.includes('automat')) return 'Smart Home Systems';
    if (text.includes('pop') || text.includes('ceiling')) return 'POP Ceiling & Lighting';
    if (text.includes('paint')) return 'Painting & Wall Finishes';
    if (text.includes('til')) return 'Tiling & Flooring';
    if (text.includes('clean')) return 'Post-Construction Cleaning';
    if (text.includes('interior') || text.includes('decor')) return 'Interior Design & Decor';
    return 'Custom Interior Contracting';
};

const STAGE_LABELS = {
    measurement: 'Measurement & Consultation',
    estimate: 'Estimate Review',
    fabric: 'Fabric Selection',
    production: 'Tailoring / Sewing',
    installation: 'Installation',
    correction: 'Correction / Punch List',
    completed: 'Completed & Handed Over'
};

/**
 * Generate full Demographics Excel Workbook and trigger download
 * 
 * @param {Array} projects - List of customer project records
 * @param {Object} options - Export options { filterLabel, exportScope }
 */
export const downloadCustomerDemographicsExcel = (projects, options = {}) => {
    if (!projects || projects.length === 0) {
        throw new Error('No customer records available to export.');
    }

    const { filterLabel = 'All Customers', exportScope = 'all' } = options;
    const now = new Date();
    const dateFormatted = now.toISOString().split('T')[0];
    const timestampStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // 1. Process Raw Records into Standardized Demographic Customer Rows
    const customerRows = projects.map((p, index) => {
        const totalAmount = Number(p.totalAmount) || 0;
        const amountPaid = Number(p.amountPaid) || 0;
        const balance = Math.max(0, totalAmount - amountPaid);
        const { area, city } = parseLocation(p.serviceAddress);
        const serviceCategory = detectServiceCategory(p.projectTitle, p.projectDescription);
        const stageLabel = STAGE_LABELS[p.status] || p.status || 'Active';

        // Payment status demographic
        let paymentStatus = 'Awaiting Deposit';
        if (totalAmount > 0 && balance <= 0) {
            paymentStatus = 'Fully Settled';
        } else if (amountPaid > 0) {
            paymentStatus = 'Partially Paid';
        }

        // Spending Tier
        let spendingTier = 'Standard (< GHS 5k)';
        if (totalAmount >= 20000) spendingTier = 'Luxury (≥ GHS 20k)';
        else if (totalAmount >= 10000) spendingTier = 'High Value (GHS 10k - 20k)';
        else if (totalAmount >= 5000) spendingTier = 'Mid-Tier (GHS 5k - 10k)';

        // Payment completion rate
        const paymentPercent = totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 0;

        return {
            'Customer Ref ID': p.id || `CUST-${String(index + 1).padStart(4, '0')}`,
            'Customer Full Name': p.clientName || 'N/A',
            'Phone Number': p.clientPhone || 'N/A',
            'Email Address': p.clientEmail || 'N/A',
            'Primary Area / Suburb': area,
            'City / Region': city,
            'Full Service Address': p.serviceAddress || 'N/A',
            'Service Category': serviceCategory,
            'Project Title': p.projectTitle || 'N/A',
            'Project Scope / Notes': p.projectDescription || '',
            'Lifecycle Stage': stageLabel,
            'Onboarding Date': formatDate(p.createdAt),
            'Onboarding Cohort': getCohortMonth(p.createdAt),
            'Measurement Date': formatDate(p.measurementDate),
            'Installation Date': formatDate(p.installationDate),
            'Total Contract Value (GHS)': totalAmount,
            'Amount Paid (GHS)': amountPaid,
            'Outstanding Balance (GHS)': balance,
            'Payment Completion Rate': `${paymentPercent}%`,
            'Payment Status': paymentStatus,
            'Economic Tier': spendingTier,
            'Selected Fabrics / Materials': p.selectedFabrics || 'N/A',
            'Customer Satisfaction': p.satisfaction || 'Pending Feedback',
            'Feedback Remarks': p.feedbackRemarks || 'N/A'
        };
    });

    // 2. Prepare Aggregated Demographics Summary Sheet
    const totalCustomers = projects.length;
    const completedCustomers = projects.filter(p => p.status === 'completed').length;
    const activeCustomers = totalCustomers - completedCustomers;
    const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
    const totalPaid = projects.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
    const totalBalance = Math.max(0, totalRevenue - totalPaid);
    const avgContract = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;
    const overallCollectionRate = totalRevenue > 0 ? ((totalPaid / totalRevenue) * 100).toFixed(1) + '%' : '0%';

    // Location distribution
    const locationCounts = {};
    // Service category distribution
    const serviceCounts = {};
    // Lifecycle stage distribution
    const stageCounts = {};
    // Payment status distribution
    const paymentStatusCounts = {};
    // Economic tier distribution
    const tierCounts = {};

    customerRows.forEach(row => {
        // Location
        const loc = row['Primary Area / Suburb'] || 'Other';
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;

        // Service
        const srv = row['Service Category'] || 'Other';
        serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;

        // Stage
        const stg = row['Lifecycle Stage'] || 'Other';
        stageCounts[stg] = (stageCounts[stg] || 0) + 1;

        // Payment status
        const pay = row['Payment Status'] || 'Other';
        paymentStatusCounts[pay] = (paymentStatusCounts[pay] || 0) + 1;

        // Tier
        const tier = row['Economic Tier'] || 'Other';
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    // Build Sheet 2 as an array of rows
    const summaryRows = [
        ['DEMARGO INTERIOR CONTRACTORS — CUSTOMER DEMOGRAPHICS & ANALYTICS REPORT'],
        [`Generated On: ${timestampStr}`, `Scope: ${filterLabel} (${exportScope.toUpperCase()})`],
        [],
        ['1. EXECUTIVE KPI OVERVIEW'],
        ['Metric Description', 'Value', 'Unit / Currency'],
        ['Total Onboarded Customers', totalCustomers, 'Clients'],
        ['Active Customers Pipeline', activeCustomers, 'Clients'],
        ['Completed & Handed Over', completedCustomers, 'Clients'],
        ['Total Contract Value', totalRevenue, 'GHS'],
        ['Total Revenue Collected', totalPaid, 'GHS'],
        ['Total Outstanding Receivables', totalBalance, 'GHS'],
        ['Average Project Contract Value', avgContract, 'GHS / Client'],
        ['Overall Payment Collection Rate', overallCollectionRate, 'Percentage'],
        [],
        ['2. GEOGRAPHIC DEMOGRAPHICS BREAKDOWN (By Area / Suburb)'],
        ['Area / Suburb', 'Customer Count', '% Share of Total'],
        ...Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([area, count]) => [
                area,
                count,
                `${((count / totalCustomers) * 100).toFixed(1)}%`
            ]),
        [],
        ['3. SERVICE & PRODUCT DEMOGRAPHICS BREAKDOWN'],
        ['Service Category', 'Customer Count', '% Share of Total'],
        ...Object.entries(serviceCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([srv, count]) => [
                srv,
                count,
                `${((count / totalCustomers) * 100).toFixed(1)}%`
            ]),
        [],
        ['4. ONBOARDING & PIPELINE LIFECYCLE STAGES'],
        ['Lifecycle Stage', 'Customer Count', '% Share of Total'],
        ...Object.entries(stageCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([stg, count]) => [
                stg,
                count,
                `${((count / totalCustomers) * 100).toFixed(1)}%`
            ]),
        [],
        ['5. FINANCIAL DEMOGRAPHICS & PAYMENT COMPLIANCE'],
        ['Payment Status', 'Customer Count', '% Share of Total'],
        ...Object.entries(paymentStatusCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([pay, count]) => [
                pay,
                count,
                `${((count / totalCustomers) * 100).toFixed(1)}%`
            ]),
        [],
        ['6. SPENDING & ECONOMIC TIER DISTRIBUTION'],
        ['Economic / Spending Tier', 'Customer Count', '% Share of Total'],
        ...Object.entries(tierCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([tier, count]) => [
                tier,
                count,
                `${((count / totalCustomers) * 100).toFixed(1)}%`
            ])
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Customer Demographics (Detailed Table)
    const wsCustomers = XLSX.utils.json_to_sheet(customerRows);
    // Autofit column widths
    const customerColWidths = [
        { wch: 18 }, // Ref ID
        { wch: 22 }, // Full Name
        { wch: 16 }, // Phone
        { wch: 26 }, // Email
        { wch: 22 }, // Area
        { wch: 18 }, // City
        { wch: 32 }, // Full Address
        { wch: 24 }, // Service Category
        { wch: 30 }, // Project Title
        { wch: 38 }, // Project Scope
        { wch: 25 }, // Lifecycle Stage
        { wch: 16 }, // Onboarding Date
        { wch: 18 }, // Onboarding Cohort
        { wch: 18 }, // Measurement Date
        { wch: 18 }, // Installation Date
        { wch: 24 }, // Total Contract Value
        { wch: 20 }, // Amount Paid
        { wch: 24 }, // Outstanding Balance
        { wch: 22 }, // Payment Rate
        { wch: 18 }, // Payment Status
        { wch: 24 }, // Economic Tier
        { wch: 30 }, // Selected Fabrics
        { wch: 22 }, // Satisfaction
        { wch: 30 }  // Feedback Remarks
    ];
    wsCustomers['!cols'] = customerColWidths;

    // Sheet 2: Demographic Analytics Summary
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    wsSummary['!cols'] = [
        { wch: 38 },
        { wch: 20 },
        { wch: 22 }
    ];

    // Append sheets to workbook
    XLSX.utils.book_append_sheet(wb, wsCustomers, 'Customer Demographics');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Demographic Insights');

    // Generate filename
    const sanitizedFilter = filterLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `Demargo_Customer_Demographics_${sanitizedFilter}_${dateFormatted}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);

    return {
        fileName,
        totalCustomers,
        totalRevenue
    };
};
