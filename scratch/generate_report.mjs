import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
    apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
    authDomain: "demargo-erms.firebaseapp.com",
    databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com",
    projectId: "demargo-erms",
    storageBucket: "demargo-erms.firebasestorage.app",
    messagingSenderId: "132903868292",
    appId: "1:132903868292:web:480df39d05d885517cefd1",
    measurementId: "G-39Y9DSKP29"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
    await signInAnonymously(auth);
    const snap = await getDocs(collection(db, 'projects'));
    
    const noInstall = [];
    snap.docs.forEach(doc => {
        const d = doc.data();
        const instDate = d.installationDate ? String(d.installationDate).trim() : '';
        if (!instDate) {
            noInstall.push({
                id: doc.id,
                clientName: d.clientName || 'N/A',
                clientPhone: d.clientPhone || 'N/A',
                projectTitle: d.projectTitle || 'N/A',
                status: d.status || 'N/A',
                measurementDate: d.measurementDate || '-',
                createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString().split('T')[0] : String(d.createdAt).split('T')[0]) : '-'
            });
        }
    });

    // Grouping
    const groups = {
        'installation': [],
        'production': [],
        'fabric': [],
        'estimate': [],
        'measurement': [],
        'completed': []
    };

    noInstall.forEach(p => {
        if (groups[p.status]) {
            groups[p.status].push(p);
        } else {
            groups[p.status] = groups[p.status] || [];
            groups[p.status].push(p);
        }
    });

    // Sort each group by createdAt descending
    Object.keys(groups).forEach(k => {
        groups[k].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    });

    let md = `# Recorded Projects Without Installation Dates Assigned\n\n`;
    md += `**Total Records Without Installation Date:** ${noInstall.length} (out of ${snap.docs.length} total database records)\n\n`;
    md += `### Status Summary\n`;
    md += `| Current Stage | Project Count | Priority |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Installation Stage** | ${groups.installation.length} | 🔴 **High** (At installation stage without a scheduled date) |\n`;
    md += `| **Production (Tailoring)** | ${groups.production.length} | 🟠 **Medium-High** (Curtains in sewing/fabrication) |\n`;
    md += `| **Fabric Selection** | ${groups.fabric.length} | 🟡 **Medium** |\n`;
    md += `| **Estimate Stage** | ${groups.estimate.length} | ⚪ Normal |\n`;
    md += `| **Measurement Stage** | ${groups.measurement.length} | ⚪ Normal (Pending measurement/estimate first) |\n`;
    md += `| **Completed** | ${groups.completed.length} | 🟢 Past Completed |\n\n`;

    const statusTitles = {
        'installation': '1. Installation Stage Projects (Urgent - No Date Assigned)',
        'production': '2. Production & Tailoring Stage Projects',
        'fabric': '3. Fabric Selection Stage Projects',
        'estimate': '4. Estimate Review Stage Projects',
        'measurement': '5. Measurement Stage Projects',
        'completed': '6. Completed Stage Projects'
    };

    for (const [st, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        md += `## ${statusTitles[st] || st.toUpperCase()} (${items.length})\n\n`;
        md += `| # | Client Name | Phone Number | Project Title | Measurement Date | Created Date |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
        items.forEach((p, i) => {
            md += `| ${i + 1} | **${p.clientName}** | \`${p.clientPhone}\` | ${p.projectTitle} | ${p.measurementDate} | ${p.createdAt} |\n`;
        });
        md += `\n---\n\n`;
    }

    const artifactPath = path.resolve('C:/Users/DEON/.gemini/antigravity/brain/cc40e1c9-78ae-4443-a99f-7c8e12db4ec3/projects_without_installation_dates.md');
    fs.writeFileSync(artifactPath, md, 'utf-8');
    console.log('Artifact written to:', artifactPath);
    console.log('URGENT_INSTALLATION:', JSON.stringify(groups.installation));
    console.log('PRODUCTION:', JSON.stringify(groups.production));
    process.exit(0);
}

run();
