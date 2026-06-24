import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    recordPayment,
    updateProjectPayment,
    getProjectPayments
} from '../services/projectService'
import './AdminPanel.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const STAGES = [
    { key: 'measurement', label: 'Measurement' },
    { key: 'estimate', label: 'Estimate Review' },
    { key: 'fabric', label: 'Fabric Selection' },
    { key: 'production', label: 'Tailoring/Sewing' },
    { key: 'installation', label: 'Installation' },
    { key: 'completed', label: 'Completed' }
]

const PASSCODE = 'demargo-admin-2026'

function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passcodeInput, setPasscodeInput] = useState('')
    const [authError, setAuthError] = useState(null);
    const [showPass, setShowPass] = useState(false);

    // Data states
    const [projects, setProjects] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modals & Selection
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [projectPayments, setProjectPayments] = useState([])
    const [loadingPayments, setLoadingPayments] = useState(false)

    // Delete confirmation & toast
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' })
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
    }

    // Create Project Form
    const [newProjData, setNewProjData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        projectTitle: '',
        projectDescription: '',
        serviceAddress: '',
        totalAmount: '0'
    })

    // Edit Project Details Form
    const [editProjData, setEditProjData] = useState({
        status: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        projectTitle: '',
        projectDescription: '',
        serviceAddress: '',
        totalAmount: 0,
        measurementDate: '',
        measurementNotes: '',
        estimateDetails: '',
        estimateApproved: false,
        selectedFabrics: '',
        fabricSelectionNotes: '',
        installationDate: '',
        installationNotes: ''
    })

    // Manual Payment Logger Form
    const [manualPayment, setManualPayment] = useState({
        amount: '',
        method: 'cash',
        reference: ''
    })
    const [loggingPayment, setLoggingPayment] = useState(false)

    // Check authentication on mount
    useEffect(() => {
        const isAuth = sessionStorage.getItem('demargo_admin_auth') === 'true'
        if (isAuth) {
            setIsAuthenticated(true)
            fetchData()
        } else {
            setLoading(false)
        }
    }, [])

    // Login function
    const handleLogin = (e) => {
        e.preventDefault()
        if (passcodeInput === PASSCODE) {
            sessionStorage.setItem('demargo_admin_auth', 'true')
            setIsAuthenticated(true)
            setAuthError(null)
            fetchData()
        } else {
            setAuthError('Incorrect passcode. Please try again.')
        }
    }

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem('demargo_admin_auth')
        setIsAuthenticated(false)
        setProjects([])
    }

    // Fetch projects from service
    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await getAllProjects()
            setProjects(data)
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    // Select project and load details
    const handleSelectProject = async (proj) => {
        setSelectedProject(proj)
        setEditProjData({
            status: proj.status || 'measurement',
            clientName: proj.clientName || '',
            clientEmail: proj.clientEmail || '',
            clientPhone: proj.clientPhone || '',
            projectTitle: proj.projectTitle || '',
            projectDescription: proj.projectDescription || '',
            serviceAddress: proj.serviceAddress || '',
            totalAmount: proj.totalAmount || 0,
            measurementDate: proj.measurementDate || '',
            measurementNotes: proj.measurementNotes || '',
            estimateDetails: proj.estimateDetails || '',
            estimateApproved: proj.estimateApproved || false,
            selectedFabrics: proj.selectedFabrics || '',
            fabricSelectionNotes: proj.fabricSelectionNotes || '',
            installationDate: proj.installationDate || '',
            installationNotes: proj.installationNotes || ''
        })
        
        // Reset manual payment logger
        setManualPayment({ amount: '', method: 'cash', reference: '' })

        // Fetch payments ledger for this project
        setLoadingPayments(true)
        try {
            const pmts = await getProjectPayments(proj.id)
            pmts.sort((a, b) => new Date(b.createdAt || b.paidAt) - new Date(a.createdAt || a.paidAt))
            setProjectPayments(pmts)
        } catch (err) {
            console.error('Error fetching payments:', err)
        } finally {
            setLoadingPayments(false)
        }
    }

    // Create new project
    const handleCreateProject = async (e) => {
        e.preventDefault()
        try {
            const amount = parseFloat(newProjData.totalAmount) || 0
            const projectId = await createProject({
                clientName: newProjData.clientName.trim(),
                clientEmail: newProjData.clientEmail.trim().toLowerCase(),
                clientPhone: newProjData.clientPhone.trim(),
                projectTitle: newProjData.projectTitle.trim(),
                projectDescription: newProjData.projectDescription.trim(),
                serviceAddress: newProjData.serviceAddress.trim(),
                totalAmount: amount,
                status: 'measurement'
            })
            alert('Project created successfully!')
            setShowCreateModal(false)
            setNewProjData({
                clientName: '',
                clientEmail: '',
                clientPhone: '',
                projectTitle: '',
                projectDescription: '',
                serviceAddress: '',
                totalAmount: '0'
            })
            fetchData()
        } catch (err) {
            console.error('Create error:', err)
            alert('Failed to create project. Please try again.')
        }
    }

    // Update generic project properties
    const handleUpdateProject = async (e) => {
        e.preventDefault()
        if (!selectedProject) return
        try {
            const total = Number(editProjData.totalAmount) || 0
            const updatePayload = {
                status: editProjData.status,
                clientName: editProjData.clientName.trim(),
                clientEmail: editProjData.clientEmail.trim().toLowerCase(),
                clientPhone: editProjData.clientPhone.trim(),
                projectTitle: editProjData.projectTitle.trim(),
                projectDescription: editProjData.projectDescription.trim(),
                serviceAddress: editProjData.serviceAddress.trim(),
                totalAmount: total,
                measurementDate: editProjData.measurementDate,
                measurementNotes: editProjData.measurementNotes,
                estimateDetails: editProjData.estimateDetails,
                estimateApproved: editProjData.estimateApproved,
                selectedFabrics: editProjData.selectedFabrics,
                fabricSelectionNotes: editProjData.fabricSelectionNotes,
                installationDate: editProjData.installationDate,
                installationNotes: editProjData.installationNotes
            }
            
            await updateProject(selectedProject.id, updatePayload)
            alert('Project details updated successfully!')
            
            // Reload all data & select refreshed project
            const freshList = await getAllProjects()
            setProjects(freshList)
            const freshProj = freshList.find(p => p.id === selectedProject.id)
            if (freshProj) {
                handleSelectProject(freshProj)
            }
        } catch (err) {
            console.error('Update error:', err)
            alert('Failed to save project updates.')
        }
    }

    // Log offline manual payment
    const handleLogPayment = async (e) => {
        e.preventDefault()
        if (!selectedProject) return
        const amountNum = parseFloat(manualPayment.amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            alert('Please enter a valid amount')
            return
        }

        setLoggingPayment(true)
        try {
            const reference = manualPayment.reference.trim() || `MAN_${Date.now()}`
            
            // Record payment transaction
            await recordPayment({
                projectId: selectedProject.id,
                amount: amountNum,
                reference: reference,
                status: 'success',
                paymentMethod: manualPayment.method,
                clientEmail: selectedProject.clientEmail || 'no-email@demargo.com',
                clientName: selectedProject.clientName,
                transactionId: `TXN_${Date.now()}`,
                paidAt: new Date().toISOString()
            })

            // Update balance
            await updateProjectPayment(selectedProject.id, amountNum)
            alert(`Logged manual payment of GHS ${amountNum} successfully!`)

            // Refresh project view
            const freshList = await getAllProjects()
            setProjects(freshList)
            const freshProj = freshList.find(p => p.id === selectedProject.id)
            if (freshProj) {
                handleSelectProject(freshProj)
            }
        } catch (err) {
            console.error('Payment logging error:', err)
            alert('Failed to log payment.')
        } finally {
            setLoggingPayment(false)
        }
    }

    // Delete project (non-blocking)
    const requestDeleteProject = (id, name) => {
        setDeleteConfirm({ show: true, id, name })
    }

    const confirmDeleteProject = async () => {
        const id = deleteConfirm.id
        setDeleting(true)
        try {
            await deleteProject(id)
            setDeleteConfirm({ show: false, id: null, name: '' })
            setSelectedProject(null)
            showToast('Project deleted successfully.', 'success')
            fetchData()
        } catch (err) {
            console.error('Delete error:', err)
            showToast('Failed to delete project.', 'error')
            setDeleteConfirm({ show: false, id: null, name: '' })
        } finally {
            setDeleting(false)
        }
    }

    // Dashboard calculations
    const activeProjects = projects.filter(p => p.status !== 'completed')
    const totalCollected = projects.reduce((acc, p) => acc + (p.amountPaid || 0), 0)
    const inSewingCount = projects.filter(p => p.status === 'production').length
    const awaitingEstimate = projects.filter(p => p.status === 'estimate').length

    // Filter projects
    const filteredProjects = projects.filter(p => {
        const matchesQuery = p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.clientPhone.includes(searchQuery) ||
                             p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter
        return matchesQuery && matchesStatus
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm font-mono">
                [ LOADING SYSTEM DATA... ]
            </div>
        )
    }

    // 1. LOGIN SCREEN
    if (!isAuthenticated) {
        return (
                <main className="admin-panel min-h-screen text-black flex items-center justify-center px-4">
                <Helmet>
                    <title>Admin Gateway • Demargo</title>
                </Helmet>
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-demargo-orange" />
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-wider text-demargo-blue uppercase">Demargo Admin</h1>
                        <p className="text-xs text-slate-500 mt-1">Please enter passcode to access project database.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                value={passcodeInput}
                                onChange={(e) => setPasscodeInput(e.target.value)}
                                placeholder="Security Passcode"
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-demargo-orange"
                            />
                            <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400"
                    >
                      {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                        </div>
                        {authError && (
                            <p className="text-xs text-red-500 font-semibold">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-demargo-orange text-white font-bold hover:opacity-90 transition-opacity uppercase tracking-widest text-xs"
                        >
                            Authorize Access
                        </button>
                    </form>
                </div>
            </main>
        )
    }

    // 2. MAIN ADMIN DASHBOARD
    return (
            <main className="admin-panel min-h-screen text-black py-12 px-4 md:px-8">
            <Helmet>
                <title>Admin Dashboard • Demargo Interior</title>
            </Helmet>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-6">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Demargo Admin Panel</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Logged in as Administrator • Secure Cloud DB Mode</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-slate-850 hover:bg-slate-900 transition text-xs font-bold text-slate-400 hover:text-white"
                    >
                        [ LOGOUT SYSTEM ]
                    </button>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-slate-850 p-4">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Database Entries</span>
                        <span className="text-2xl font-black text-white block mt-1">{projects.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-4">
                        <span className="text-[10px] text-slate-500 uppercase block">Active Projects</span>
                        <span className="text-2xl font-black text-demargo-blue block mt-1">{activeProjects.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-4">
                        <span className="text-[10px] text-slate-500 uppercase block">Awaiting Estimate Review</span>
                        <span className="text-2xl font-black text-yellow-500 block mt-1">{awaitingEstimate}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-4">
                        <span className="text-[10px] text-slate-500 uppercase block">In Sewing (Tailoring)</span>
                        <span className="text-2xl font-black text-demargo-orange block mt-1">{inSewingCount}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-4 col-span-2 md:col-span-1">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Payments Logged</span>
                        <span className="text-xl font-black text-green-500 block mt-1">GHS {totalCollected.toLocaleString('en-GH')}</span>
                    </div>
                </div>

                {/* Primary Workspace: Projects List and Project Details */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Projects Table (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="font-extrabold text-white text-md uppercase tracking-wider">Project Records Directory</h2>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-demargo-orange hover:opacity-90 text-white font-bold text-xs transition uppercase"
                            >
                                + Create Project Entry
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Search by name, phone, title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="sm:col-span-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-demargo-orange"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-demargo-orange"
                            >
                                <option value="all">All Stages</option>
                                {STAGES.map(s => (
                                    <option key={s.key} value={s.key}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Projects Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-2">Client Details</th>
                                        <th className="py-3 px-2">Project</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2 text-right">Payments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-850">
                                    {filteredProjects.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-slate-500 italic">No records found matching filters.</td>
                                        </tr>
                                    ) : (
                                        filteredProjects.map(p => (
                                            <tr
                                                key={p.id}
                                                onClick={() => handleSelectProject(p)}
                                                className={`cursor-pointer hover:bg-slate-850 transition ${selectedProject?.id === p.id ? 'bg-slate-850/60 border-l-2 border-l-demargo-orange' : ''}`}
                                            >
                                                <td className="py-3 px-2">
                                                    <div className="font-bold text-white">{p.clientName}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{p.clientPhone}</div>
                                                </td>
                                                <td className="py-3 px-2 max-w-[180px] truncate">
                                                    <div className="font-semibold text-slate-200">{p.projectTitle}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{p.serviceAddress}</div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                                                        p.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                        p.status === 'production' ? 'bg-orange-500/10 border-orange-500/20 text-demargo-orange' :
                                                        p.status === 'estimate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                        'bg-slate-800 border-slate-700 text-slate-400'
                                                    }`}>
                                                        {STAGES.find(s => s.key === p.status)?.label || p.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    <div className="font-bold text-slate-200">GHS {p.amountPaid.toLocaleString('en-GH')}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">Bal: GHS {p.balance.toLocaleString('en-GH')}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Manage Details Panel (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-6 space-y-6">
                        {!selectedProject ? (
                            <div className="h-96 flex flex-col justify-center items-center text-center p-6 border border-dashed border-slate-800 text-slate-500">
                                <span className="text-2xl block mb-2">📋</span>
                                <h3 className="font-bold text-white uppercase text-xs tracking-wider">No Project Selected</h3>
                                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">Click a row in the project records directory to manage stages, set measurements, fabrics and log manual payments.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase">Selected Project</span>
                                        <h3 className="text-base font-bold text-white mt-0.5">{selectedProject.clientName}</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{selectedProject.projectTitle}</p>
                                    </div>
                                    <button
                                        onClick={() => requestDeleteProject(selectedProject.id, selectedProject.clientName)}
                                        className="px-2.5 py-1.5 bg-red-950/40 text-red-500 border border-red-900/50 hover:bg-red-900/40 hover:text-white transition text-[10px] font-bold uppercase"
                                    >
                                        Delete Record
                                    </button>
                                </div>

                                {/* Form for Updates */}
                                <form onSubmit={handleUpdateProject} className="space-y-4 text-xs">
                                    {/* Status Selector */}
                                    <div>
                                        <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">Current Lifecycle Stage</label>
                                        <select
                                            value={editProjData.status}
                                            onChange={(e) => setEditProjData(p => ({ ...p, status: e.target.value }))}
                                            className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none focus:border-demargo-orange"
                                        >
                                            {STAGES.map(s => (
                                                <option key={s.key} value={s.key}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Client Details Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1 uppercase">Client Name</label>
                                            <input
                                                type="text"
                                                value={editProjData.clientName}
                                                onChange={(e) => setEditProjData(p => ({ ...p, clientName: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1 uppercase">Client Phone</label>
                                            <input
                                                type="text"
                                                value={editProjData.clientPhone}
                                                onChange={(e) => setEditProjData(p => ({ ...p, clientPhone: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1 uppercase">Client Email</label>
                                            <input
                                                type="email"
                                                value={editProjData.clientEmail}
                                                onChange={(e) => setEditProjData(p => ({ ...p, clientEmail: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1 uppercase">Total Estimate (GHS)</label>
                                            <input
                                                type="number"
                                                value={editProjData.totalAmount}
                                                onChange={(e) => setEditProjData(p => ({ ...p, totalAmount: parseFloat(e.target.value) || 0 }))}
                                                className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-slate-500 font-bold mb-1 uppercase">Site Address</label>
                                        <input
                                            type="text"
                                            value={editProjData.serviceAddress}
                                            onChange={(e) => setEditProjData(p => ({ ...p, serviceAddress: e.target.value }))}
                                            className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                        />
                                    </div>

                                    {/* 1. Measurement Settings */}
                                    <div className="border-t border-slate-850 pt-4 space-y-3">
                                        <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">1. Measurements Information</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Measurement Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editProjData.measurementDate}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, measurementDate: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Measurement Details</label>
                                                <textarea
                                                    rows="2"
                                                    value={editProjData.measurementNotes}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, measurementNotes: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                    placeholder="Windows dimensions..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Estimate Information */}
                                    <div className="border-t border-slate-850 pt-4 space-y-3">
                                        <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">2. Estimate Approval Settings</span>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="estApprovedCheck"
                                                    checked={editProjData.estimateApproved}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, estimateApproved: e.target.checked }))}
                                                    className="w-4 h-4 bg-slate-950 border border-slate-850 accent-demargo-orange focus:outline-none"
                                                />
                                                <label htmlFor="estApprovedCheck" className="text-slate-300 font-bold uppercase text-[10px]">Estimate Approved by Client</label>
                                            </div>
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Itemized Pricing details</label>
                                                <textarea
                                                    rows="2"
                                                    value={editProjData.estimateDetails}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, estimateDetails: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none font-mono"
                                                    placeholder="E.g. Living room: GHS 5,000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Fabric selection */}
                                    <div className="border-t border-slate-850 pt-4 space-y-3">
                                        <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">3. Fabric Selections</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Selected Fabric Codes</label>
                                                <input
                                                    type="text"
                                                    value={editProjData.selectedFabrics}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, selectedFabrics: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                    placeholder="E.g Velvet blue (Code: BL-03)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Fabric choice notes</label>
                                                <textarea
                                                    rows="2"
                                                    value={editProjData.fabricSelectionNotes}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, fabricSelectionNotes: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                    placeholder="Details on textures, linings..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Installation scheduling */}
                                    <div className="border-t border-slate-850 pt-4 space-y-3">
                                        <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">4. Installation Information</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Installation Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editProjData.installationDate}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, installationDate: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-500 font-semibold mb-1">Installation Notes</label>
                                                <textarea
                                                    rows="2"
                                                    value={editProjData.installationNotes}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, installationNotes: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                    placeholder="Track fittings details, special heights..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-demargo-blue hover:opacity-90 text-white font-bold transition uppercase tracking-wider text-xs"
                                    >
                                        Save All Changes
                                    </button>
                                </form>

                                {/* Ledger / Logging offline manual payments */}
                                {selectedProject.balance > 0 && (
                                    <div className="border-t border-slate-850 pt-6 space-y-4">
                                        <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">5. Log Manual/Offline Payment</span>
                                        <form onSubmit={handleLogPayment} className="space-y-3 text-xs">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="col-span-2">
                                                    <label className="block text-slate-500 mb-1">Payment Amount (GHS)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="0.00"
                                                        value={manualPayment.amount}
                                                        onChange={(e) => setManualPayment(p => ({ ...p, amount: e.target.value }))}
                                                        className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-slate-500 mb-1">Method</label>
                                                    <select
                                                        value={manualPayment.method}
                                                        onChange={(e) => setManualPayment(p => ({ ...p, method: e.target.value }))}
                                                        className="w-full bg-slate-950 border border-slate-850 text-white px-2 py-2 focus:outline-none"
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="bank_transfer">Bank Trans</option>
                                                        <option value="mobile_money">MoMo</option>
                                                        <option value="cheque">Cheque</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-slate-500 mb-1">Receipt Reference (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Receipt number or notes..."
                                                    value={manualPayment.reference}
                                                    onChange={(e) => setManualPayment(p => ({ ...p, reference: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loggingPayment}
                                                className="w-full py-2 bg-emerald-700 hover:bg-emerald-650 text-white font-bold transition uppercase tracking-wider text-[10px]"
                                            >
                                                {loggingPayment ? 'Logging...' : 'Log Offline Payment'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Payments List for Selected Project */}
                                <div className="border-t border-slate-850 pt-6">
                                    <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block mb-3">Project Ledger</span>
                                    {loadingPayments ? (
                                        <p className="text-[10px] text-slate-500 italic">Syncing payment ledgers...</p>
                                    ) : projectPayments.length === 0 ? (
                                        <p className="text-[10px] text-slate-500 italic">No payments logged under this project.</p>
                                    ) : (
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                            {projectPayments.map(p => (
                                                <div key={p.id} className="p-2.5 bg-slate-950 border border-slate-850 text-[10px] flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-slate-200">GHS {p.amount.toLocaleString('en-GH')}</div>
                                                        <div className="text-[9px] text-slate-500 mt-0.5">Ref: {p.reference?.substring(0, 15)}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="px-1 text-[8px] font-bold bg-slate-900 border border-slate-850 uppercase text-slate-400 capitalize">{p.paymentMethod?.replace('_', ' ')}</span>
                                                        <div className="text-[9px] text-slate-500 mt-0.5">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : ''}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE PROJECT MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-none max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-demargo-orange" />
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                            <h3 className="font-black text-white uppercase text-sm tracking-wider">Create New Client Project</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-white transition font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-500 font-bold mb-1 uppercase">Client Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Kofi Mensah"
                                        value={newProjData.clientName}
                                        onChange={(e) => setNewProjData(p => ({ ...p, clientName: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 font-bold mb-1 uppercase">Client Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0241234567"
                                        value={newProjData.clientPhone}
                                        onChange={(e) => setNewProjData(p => ({ ...p, clientPhone: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-500 font-bold mb-1 uppercase">Client Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="kofi@example.com"
                                        value={newProjData.clientEmail}
                                        onChange={(e) => setNewProjData(p => ({ ...p, clientEmail: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 font-bold mb-1 uppercase">Total Estimate Amount (GHS)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newProjData.totalAmount}
                                        onChange={(e) => setNewProjData(p => ({ ...p, totalAmount: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 font-bold mb-1 uppercase">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Living Room Drapes & Wooden Blinds"
                                    value={newProjData.projectTitle}
                                    onChange={(e) => setNewProjData(p => ({ ...p, projectTitle: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-500 font-bold mb-1 uppercase">Project Description</label>
                                <textarea
                                    rows="2"
                                    placeholder="Provide project details or special requests..."
                                    value={newProjData.projectDescription}
                                    onChange={(e) => setNewProjData(p => ({ ...p, projectDescription: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-500 font-bold mb-1 uppercase">Service Site Address</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Cantonments, Accra Ghana"
                                    value={newProjData.serviceAddress}
                                    onChange={(e) => setNewProjData(p => ({ ...p, serviceAddress: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-demargo-orange text-white font-bold hover:opacity-90 transition-opacity uppercase tracking-wider text-xs"
                            >
                                Create Project Record
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteConfirm({ show: false, id: null, name: '' })}>
                    <div className="bg-slate-900 border border-slate-700 p-6 max-w-sm w-full mx-4 rounded-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-950/50 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-sm">Delete Project</h3>
                            <p className="text-slate-400 text-xs mt-2">Are you sure you want to permanently delete <span className="text-white font-semibold">{deleteConfirm.name}</span>? This action is irreversible.</p>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                                disabled={deleting}
                                className="flex-1 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition text-xs font-bold uppercase rounded disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteProject}
                                disabled={deleting}
                                className="flex-1 py-2.5 bg-red-600 text-white hover:bg-red-700 transition text-xs font-bold uppercase rounded disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-fade-in ${
                    toast.type === 'success' ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-700' : 'bg-red-900/90 text-red-300 border border-red-700'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {toast.message}
                </div>
            )}
        </main>
    )
}

export default AdminPanel
