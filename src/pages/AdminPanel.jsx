import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    addProjectMessage,
    updateProjectMessages,
    deleteProject,
    recordPayment,
    updateProjectPayment,
    getProjectPayments,
    uploadFile,
    approvePayment
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

const viewDocument = (url) => {
    if (!url) return;
    if (url.startsWith('data:')) {
        try {
            const [metadata, base64Data] = url.split(',');
            const mimeType = metadata.split(';')[0].split(':')[1] || 'application/octet-stream';
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (e) {
            console.error('Failed to parse base64 document:', e);
            window.open(url, '_blank');
        }
    } else {
        window.open(url, '_blank');
    }
};


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
    const [creatingProject, setCreatingProject] = useState(false)
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
        estimatePdfUrls: [],
        estimateApproved: false,
        selectedFabrics: '',
        installationDate: '',
        measurementPdfUrls: []
    })

    const [uploadingPdf, setUploadingPdf] = useState(false)
    const [uploadingEstimatePdf, setUploadingEstimatePdf] = useState(false)

    const [replyInput, setReplyInput] = useState('')
    const [sendingReply, setSendingReply] = useState(false)
    const messagesListRef = useRef(null)
    const selectedProjectRef = useRef(null)

    // Manual Payment Logger Form
    const [manualPayment, setManualPayment] = useState({
        amount: '',
        method: 'cash',
        reference: ''
    })
    const [loggingPayment, setLoggingPayment] = useState(false)
    const [manualPaymentFile, setManualPaymentFile] = useState(null)

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
            // Load all payments to track pending client submissions
            try {
                const { getProjectPayments } = await import('../services/projectService')
                const allPaymentArrays = await Promise.all(data.map(p => getProjectPayments(p.id)))
                const allPayments = allPaymentArrays.flat()
                setPayments(allPayments)
            } catch (payErr) {
                console.warn('Could not load all payments:', payErr)
            }
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectProject = async (projOrId) => {
        const proj = typeof projOrId === 'string' ? await getProjectById(projOrId) : projOrId
        
        // Recalculate balance to ensure accuracy
        const recalculatedBalance = Math.max(0, (proj.totalAmount || 0) - (proj.amountPaid || 0))
        const updatedProj = { ...proj, balance: recalculatedBalance }
        
        // Mark all messages as read by admin
        const unreadAdmin = (updatedProj.messages || []).some(msg => msg.sender === 'client' && !msg.readByAdmin)
        if (unreadAdmin) {
            const updatedMessages = (updatedProj.messages || []).map(msg =>
                msg.sender === 'client' ? { ...msg, readByAdmin: true } : msg
            )
            updatedProj.messages = updatedMessages
            setProjects(prev => prev.map(p => p.id === updatedProj.id ? { ...p, messages: updatedMessages } : p))
            updateProjectMessages(updatedProj.id, updatedMessages).catch(err => {
                console.error('Could not mark client messages read:', err)
            })
        }

        setSelectedProject(updatedProj)
        
        const mUrls = updatedProj.measurementPdfUrls && Array.isArray(updatedProj.measurementPdfUrls)
            ? updatedProj.measurementPdfUrls
            : (updatedProj.measurementPdfUrl ? [{ name: 'Legacy Measurement PDF.pdf', url: updatedProj.measurementPdfUrl }] : [])

        const eUrls = updatedProj.estimatePdfUrls && Array.isArray(updatedProj.estimatePdfUrls)
            ? updatedProj.estimatePdfUrls
            : (updatedProj.estimatePdfUrl ? [{ name: 'Legacy Estimate PDF.pdf', url: updatedProj.estimatePdfUrl }] : [])

        setEditProjData({
            status: updatedProj.status || 'measurement',
            clientName: updatedProj.clientName || '',
            clientEmail: updatedProj.clientEmail || '',
            clientPhone: updatedProj.clientPhone || '',
            projectTitle: updatedProj.projectTitle || '',
            projectDescription: updatedProj.projectDescription || '',
            serviceAddress: updatedProj.serviceAddress || '',
            totalAmount: updatedProj.totalAmount || 0,
            measurementDate: updatedProj.measurementDate || '',
            measurementNotes: updatedProj.measurementNotes || '',
            estimatePdfUrls: eUrls,
            estimateApproved: updatedProj.estimateApproved || false,
            selectedFabrics: updatedProj.selectedFabrics || '',
            installationDate: updatedProj.installationDate || '',
            measurementPdfUrls: mUrls
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

    React.useEffect(() => {
        if (!selectedProject || !selectedProjectRef.current) return
        selectedProjectRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [selectedProject?.id])

    // Create new project
    const handleCreateProject = async (e) => {
        e.preventDefault()
        setCreatingProject(true)
        try {
            const amount = parseFloat(newProjData.totalAmount) || 0
            const projectId = await createProject({
                clientName: newProjData.clientName.trim(),
                clientEmail: (newProjData.clientEmail || '').trim().toLowerCase(),
                clientPhone: newProjData.clientPhone.trim(),
                projectTitle: newProjData.projectTitle.trim(),
                projectDescription: newProjData.projectDescription.trim(),
                serviceAddress: newProjData.serviceAddress.trim(),
                totalAmount: amount,
                messages: [],
                status: 'measurement'
            })
            await fetchData()
            setNewProjData({
                clientName: '',
                clientEmail: '',
                clientPhone: '',
                projectTitle: '',
                projectDescription: '',
                serviceAddress: '',
                totalAmount: '0'
            })
            setShowCreateModal(false)
            showToast('Project created successfully.', 'success')
        } catch (err) {
            console.error('Create error:', err)
            const message = err?.message || 'Please check Firebase rules or network connectivity.'
            showToast(`Failed to create project: ${message}`, 'error')
        } finally {
            setCreatingProject(false)
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
                clientEmail: (editProjData.clientEmail || '').trim().toLowerCase(),
                clientPhone: editProjData.clientPhone.trim(),
                projectTitle: editProjData.projectTitle.trim(),
                projectDescription: editProjData.projectDescription.trim(),
                serviceAddress: editProjData.serviceAddress.trim(),
                totalAmount: total,
                measurementDate: editProjData.measurementDate,
                measurementNotes: editProjData.measurementNotes,
                estimatePdfUrls: editProjData.estimatePdfUrls,
                estimatePdfUrl: editProjData.estimatePdfUrls.length > 0 ? editProjData.estimatePdfUrls[0].url : '',
                estimateApproved: editProjData.estimateApproved,
                selectedFabrics: editProjData.selectedFabrics,
                installationDate: editProjData.installationDate,
                measurementPdfUrls: editProjData.measurementPdfUrls,
                measurementPdfUrl: editProjData.measurementPdfUrls.length > 0 ? editProjData.measurementPdfUrls[0].url : ''
            }
            
            await updateProject(selectedProject.id, updatePayload)
            showToast('Project details updated successfully.', 'success')
            
            // Reload all data & select refreshed project
            const freshList = await getAllProjects()
            setProjects(freshList)
            const freshProj = freshList.find(p => p.id === selectedProject.id)
            if (freshProj) {
                handleSelectProject(freshProj)
            }
        } catch (err) {
            console.error('Update error:', err)
            showToast('Failed to save project updates.', 'error')
        }
    }

    const handleSendReply = async () => {
        if (!selectedProject || !replyInput.trim()) return
        setSendingReply(true)
        const message = {
            id: `msg-${Date.now()}`,
            sender: 'admin',
            body: replyInput.trim(),
            createdAt: new Date().toISOString(),
            readByClient: false,
            readByAdmin: true
        }

        const updatedMessages = (selectedProject.messages || []).map(msg =>
            msg.sender === 'client' ? { ...msg, readByAdmin: true } : msg
        )
        const finalMessages = [...updatedMessages, message]

        setSelectedProject(prev => prev ? { ...prev, messages: finalMessages } : prev)
        setReplyInput('')
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, messages: finalMessages } : p))

        try {
            await updateProjectMessages(selectedProject.id, finalMessages)
            await handleSelectProject(selectedProject.id)
            showToast('Reply sent successfully.', 'success')
        } catch (err) {
            console.error('Reply send error:', err)
            showToast('Could not send reply. Please try again.', 'error')
        } finally {
            setSendingReply(false)
        }
    }

    React.useEffect(() => {
        if (!messagesListRef.current) return
        messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight
    }, [selectedProject?.messages?.length])

    // Log offline manual payment
    const handleLogPayment = async (e) => {
        e.preventDefault()
        if (!selectedProject) return
        const amountNum = parseFloat(manualPayment.amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            showToast('Please enter a valid amount.', 'error')
            return
        }
        if (!manualPaymentFile) {
            showToast('Please upload a payment receipt file.', 'error')
            return
        }

        setLoggingPayment(true)
        try {
            // Upload receipt file
            const path = `receipts/admin_${selectedProject.id}_${Date.now()}_${manualPaymentFile.name}`
            const receiptUrl = await uploadFile(path, manualPaymentFile)
            
            // Record payment transaction
            await recordPayment({
                projectId: selectedProject.id,
                amount: amountNum,
                reference: manualPaymentFile.name,
                receiptUrl: receiptUrl,
                status: 'success',
                paymentMethod: manualPayment.method,
                clientEmail: selectedProject.clientEmail || 'no-email@demargo.com',
                clientName: selectedProject.clientName,
                transactionId: `TXN_${Date.now()}`,
                paidAt: new Date().toISOString()
            })

            // Update balance
            await updateProjectPayment(selectedProject.id, amountNum)
            const timestamp = new Date().toLocaleTimeString('en-GH')
            showToast(`Logged manual payment of GHS ${amountNum} successfully at ${timestamp}.`, 'success')
            setManualPaymentFile(null)

            // Refresh project view
            const freshList = await getAllProjects()
            setProjects(freshList)
            const freshProj = freshList.find(p => p.id === selectedProject.id)
            if (freshProj) {
                handleSelectProject(freshProj)
            }
        } catch (err) {
            console.error('Payment logging error:', err)
            showToast('Failed to log payment.', 'error')
        } finally {
            setLoggingPayment(false)
        }
    }

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0]
        if (!file || !selectedProject) return
        
        const currentUrls = editProjData.measurementPdfUrls || []
        if (currentUrls.length >= 5) {
            showToast('Maximum of 5 measurement files allowed.', 'error')
            e.target.value = ''
            return
        }

        setUploadingPdf(true)
        try {
            const path = `receipts/measurement_${selectedProject.id}_${Date.now()}_measurement.pdf`
            const downloadUrl = await uploadFile(path, file)
            
            const newUrls = [...currentUrls, { name: file.name, url: downloadUrl }]
            
            // Auto-save to the project document immediately
            await updateProject(selectedProject.id, {
                measurementPdfUrls: newUrls,
                measurementPdfUrl: downloadUrl // legacy compatibility
            })
            
            setEditProjData(prev => ({ ...prev, measurementPdfUrls: newUrls }))
            setSelectedProject(prev => prev ? { ...prev, measurementPdfUrls: newUrls, measurementPdfUrl: downloadUrl } : prev)
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, measurementPdfUrls: newUrls, measurementPdfUrl: downloadUrl } : p))
            
            showToast('PDF uploaded and saved successfully.', 'success')
        } catch (err) {
            console.error('PDF upload error:', err.code, err.message, err)
            showToast(`Failed to upload PDF: ${err.code || err.message || 'Unknown error'}`, 'error')
        } finally {
            setUploadingPdf(false)
            e.target.value = '' // Clear input so the change event triggers next time
        }
    }

    const handleDeleteMeasurementPdf = async (indexToDelete) => {
        if (!selectedProject) return
        try {
            const currentUrls = editProjData.measurementPdfUrls || []
            const newUrls = currentUrls.filter((_, idx) => idx !== indexToDelete)
            
            await updateProject(selectedProject.id, {
                measurementPdfUrls: newUrls,
                measurementPdfUrl: newUrls.length > 0 ? newUrls[0].url : '' // legacy compat
            })
            
            setEditProjData(prev => ({ ...prev, measurementPdfUrls: newUrls }))
            setSelectedProject(prev => prev ? { ...prev, measurementPdfUrls: newUrls, measurementPdfUrl: newUrls.length > 0 ? newUrls[0].url : '' } : prev)
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, measurementPdfUrls: newUrls, measurementPdfUrl: newUrls.length > 0 ? newUrls[0].url : '' } : p))
            
            showToast('Measurement file removed successfully.', 'success')
        } catch (err) {
            console.error('Error removing measurement file:', err)
            showToast('Failed to remove measurement file.', 'error')
        }
    }

    const handleEstimatePdfUpload = async (e) => {
        const file = e.target.files[0]
        if (!file || !selectedProject) return
        
        const currentUrls = editProjData.estimatePdfUrls || []
        if (currentUrls.length >= 5) {
            showToast('Maximum of 5 estimate files allowed.', 'error')
            e.target.value = ''
            return
        }

        setUploadingEstimatePdf(true)
        try {
            const path = `receipts/estimate_${selectedProject.id}_${Date.now()}_estimate.pdf`
            const downloadUrl = await uploadFile(path, file)
            
            const newUrls = [...currentUrls, { name: file.name, url: downloadUrl }]
            
            // Auto-save to the project document immediately
            await updateProject(selectedProject.id, {
                estimatePdfUrls: newUrls,
                estimatePdfUrl: downloadUrl // legacy compatibility
            })
            
            setEditProjData(prev => ({ ...prev, estimatePdfUrls: newUrls }))
            setSelectedProject(prev => prev ? { ...prev, estimatePdfUrls: newUrls, estimatePdfUrl: downloadUrl } : prev)
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, estimatePdfUrls: newUrls, estimatePdfUrl: downloadUrl } : p))
            
            showToast('Estimate PDF uploaded and saved successfully.', 'success')
        } catch (err) {
            console.error('Estimate PDF upload error:', err.code, err.message, err)
            showToast(`Failed to upload Estimate PDF: ${err.code || err.message || 'Unknown error'}`, 'error')
        } finally {
            setUploadingEstimatePdf(false)
            e.target.value = '' // Clear input so the change event triggers next time
        }
    }

    const handleDeleteEstimatePdf = async (indexToDelete) => {
        if (!selectedProject) return
        try {
            const currentUrls = editProjData.estimatePdfUrls || []
            const newUrls = currentUrls.filter((_, idx) => idx !== indexToDelete)
            
            await updateProject(selectedProject.id, {
                estimatePdfUrls: newUrls,
                estimatePdfUrl: newUrls.length > 0 ? newUrls[0].url : '' // legacy compat
            })
            
            setEditProjData(prev => ({ ...prev, estimatePdfUrls: newUrls }))
            setSelectedProject(prev => prev ? { ...prev, estimatePdfUrls: newUrls, estimatePdfUrl: newUrls.length > 0 ? newUrls[0].url : '' } : prev)
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, estimatePdfUrls: newUrls, estimatePdfUrl: newUrls.length > 0 ? newUrls[0].url : '' } : p))
            
            showToast('Estimate file removed successfully.', 'success')
        } catch (err) {
            console.error('Error removing estimate file:', err)
            showToast('Failed to remove estimate file.', 'error')
        }
    }

    const handleVerifyPayment = async (projectId, paymentId, amount) => {
        try {
            await approvePayment(projectId, paymentId, amount)
            const timestamp = new Date().toLocaleTimeString('en-GH')
            showToast(`Approved and verified payment of GHS ${amount} successfully at ${timestamp}.`, 'success')
            // Refresh project view
            const freshList = await getAllProjects()
            setProjects(freshList)
            const freshProj = freshList.find(p => p.id === selectedProject.id)
            if (freshProj) {
                handleSelectProject(freshProj)
            }
        } catch (err) {
            console.error('Verify payment error:', err)
            showToast('Failed to verify and approve payment.', 'error')
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
    
    // Projects with pending client payment submissions (from global payments array)
    const pendingClientPaymentProjectIds = new Set(
        payments.filter(pay => pay.status === 'pending' && pay.clientSubmitted === true).map(pay => pay.projectId)
    )
    
    // Ensure all projects have correct balance calculated
    const projectsWithCorrectBalance = projects.map(p => ({
        ...p,
        balance: Math.max(0, (p.totalAmount || 0) - (p.amountPaid || 0))
    }))

    // Filter projects
    const filteredProjects = projectsWithCorrectBalance.filter(p => {
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
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                showToast('Refreshing data...', 'success')
                                await fetchData()
                                if (selectedProject) {
                                    await handleSelectProject(selectedProject.id)
                                }
                            }}
                            className="px-4 py-2 border border-demargo-orange/40 hover:bg-slate-900/60 transition text-xs font-bold text-demargo-orange hover:text-white flex items-center gap-1.5"
                        >
                            <span>↻</span> Refresh Updates
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-slate-850 hover:bg-slate-900 transition text-xs font-bold text-slate-400 hover:text-white"
                        >
                            [ LOGOUT SYSTEM ]
                        </button>
                    </div>
                </div>

                {/* Notification Alerts: Unread Client Messages and Pending Payments */}
                {(() => {
                    const unreadProjects = projects.filter(p =>
                        (p.messages || []).some(m => m.sender === 'client' && !m.readByAdmin)
                    )
                    const pendingPaymentProjects = projects.filter(p =>
                        pendingClientPaymentProjectIds.has(p.id)
                    )
                    if (unreadProjects.length === 0 && pendingPaymentProjects.length === 0) return null
                    return (
                        <div className="space-y-2">
                            {unreadProjects.length > 0 && (
                                <div className="border border-yellow-600/30 bg-yellow-950/20 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                        <span className="inline-flex h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
                                        Unread Client Messages ({unreadProjects.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {unreadProjects.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleSelectProject(p)}
                                                className="text-[11px] px-2 py-1 bg-yellow-900/30 text-yellow-300 border border-yellow-800/40 hover:bg-yellow-900/60 transition font-medium"
                                            >
                                                {p.clientName || p.projectTitle || p.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {pendingPaymentProjects.length > 0 && (
                                <div className="border border-orange-600/30 bg-orange-950/20 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                                        <span className="inline-flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                                        Pending Payment Proofs ({pendingPaymentProjects.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {pendingPaymentProjects.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleSelectProject(p)}
                                                className="text-[11px] px-2 py-1 bg-orange-900/30 text-orange-300 border border-orange-800/40 hover:bg-orange-900/60 transition font-medium"
                                            >
                                                {p.clientName || p.projectTitle || p.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })()}

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl shadow-sm">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Database Entries</span>
                        <span className="text-2xl font-black text-white block mt-1">{projects.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl shadow-sm">
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
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-3xl shadow-sm sm:col-span-2 md:col-span-1">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Payments Logged</span>
                        <span className="text-xl font-black text-green-500 block mt-1">GHS {totalCollected.toLocaleString('en-GH')}</span>
                    </div>
                </div>

                {/* Primary Workspace: Projects List and Project Details */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Projects Table (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 space-y-6 rounded-3xl shadow-2xl">
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                            <table className="w-full min-w-full text-left border-collapse text-xs">
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
                                                <td className="py-3 px-2 max-w-[220px] min-w-0 break-words">
                                                    <div className="font-semibold text-slate-200 break-words">{p.projectTitle}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5 break-words">{p.serviceAddress}</div>
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
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-6 space-y-6 rounded-3xl shadow-2xl">
                        {!selectedProject ? (
                            <div className="min-h-[18rem] sm:h-96 flex flex-col justify-center items-center text-center p-6 border border-dashed border-slate-800 text-slate-500">
                                <span className="text-2xl block mb-2">📋</span>
                                <h3 className="font-bold text-white uppercase text-xs tracking-wider">No Project Selected</h3>
                                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">Click a row in the project records directory to manage stages, set measurements, fabrics and log manual payments.</p>
                            </div>
                        ) : (
                            <div ref={selectedProjectRef} className="space-y-6">
                                <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase">Selected Project</span>
                                        <h3 className="text-base font-bold text-white mt-0.5">{selectedProject.clientName}</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{selectedProject.projectTitle}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500 uppercase">Payment Status</div>
                                        <div className="text-lg font-bold text-white mt-1">GHS {selectedProject.amountPaid?.toLocaleString('en-GH') || 0}</div>
                                        <div className="text-[10px] text-slate-400">of GHS {selectedProject.totalAmount?.toLocaleString('en-GH') || 0}</div>
                                        <div className={`text-xs font-bold mt-1 ${selectedProject.balance > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                                            Balance: GHS {selectedProject.balance?.toLocaleString('en-GH') || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 bg-slate-950 border border-slate-850 rounded-3xl p-5 flex flex-col h-[460px]">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-demargo-orange animate-pulse" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-white">Project Conversation</span>
                                        </div>
                                        <span className="text-[9px] text-slate-500 font-semibold bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-full">{(selectedProject.messages || []).length} messages</span>
                                    </div>
                                    
                                    {/* Messages list */}
                                    <div ref={messagesListRef} className="flex-1 overflow-y-auto space-y-4 my-3 pr-1 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain' }}>
                                        {(selectedProject.messages || []).length === 0 ? (
                                            <div className="h-full flex flex-col justify-center items-center text-center text-slate-500 py-10">
                                                <span className="text-2xl mb-1">💬</span>
                                                <p className="text-[11px] italic">No messages yet. Send a note to start the chat.</p>
                                            </div>
                                        ) : (
                                            selectedProject.messages.map((msg) => {
                                                const isAdmin = msg.sender === 'admin'
                                                const clientInitial = selectedProject.clientName ? selectedProject.clientName.trim().charAt(0).toUpperCase() : 'C'
                                                return (
                                                    <div key={msg.id} className={`flex w-full gap-2.5 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                        {!isAdmin && (
                                                            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs flex items-center justify-center shrink-0 shadow-sm" title={selectedProject.clientName}>
                                                                {clientInitial}
                                                            </div>
                                                        )}
                                                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs relative ${
                                                            isAdmin 
                                                                ? 'bg-demargo-orange text-blue-950 font-semibold rounded-tr-none' 
                                                                : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                                                        }`}>
                                                            <p className="whitespace-pre-line leading-relaxed">{msg.body}</p>
                                                            {isAdmin ? (
                                                                <div className="flex items-center justify-end gap-1 text-[8px] mt-1.5 text-blue-950/60">
                                                                    <span>{new Date(msg.createdAt).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    {msg.readByClient ? (
                                                                        <span className="text-white font-black text-[9px] leading-none" title="Read by Client">✓✓</span>
                                                                    ) : (
                                                                        <span className="text-blue-950/40 font-black text-[9px] leading-none" title="Sent">✓</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="block text-[8px] mt-1.5 text-right text-slate-500">
                                                                    {new Date(msg.createdAt).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {isAdmin && (
                                                            <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-blue-950" title="Admin">
                                                                A
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                    
                                    {/* Inline reply bar */}
                                    <div className="flex gap-2 items-center bg-slate-900 border border-slate-850 rounded-full px-4 py-2 focus-within:border-demargo-orange focus-within:ring-1 focus-within:ring-demargo-orange/20 transition">
                                        <input
                                            type="text"
                                            value={replyInput}
                                            onChange={(e) => setReplyInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && replyInput.trim() && !sendingReply) {
                                                    handleSendReply()
                                                }
                                            }}
                                            placeholder="Write your admin reply..."
                                            className="flex-1 bg-transparent text-xs text-white placeholder-slate-650 focus:outline-none border-none outline-none"
                                            disabled={sendingReply}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSendReply}
                                            disabled={sendingReply || !replyInput.trim()}
                                            className="p-1 text-demargo-orange hover:text-orange-400 disabled:opacity-30 transition shrink-0"
                                        >
                                            <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => requestDeleteProject(selectedProject.id, selectedProject.clientName)}
                                    className="px-2.5 py-1.5 bg-red-950/40 text-red-500 border border-red-900/50 hover:bg-red-900/40 hover:text-white transition text-[10px] font-bold uppercase"
                                >
                                    Delete Record
                                </button>

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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-slate-500 font-semibold mb-1">Measurement Date</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="datetime-local"
                                                    value={editProjData.measurementDate}
                                                    onChange={(e) => setEditProjData(p => ({ ...p, measurementDate: e.target.value }))}
                                                    className="flex-1 bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none focus:border-demargo-orange focus:ring-1 focus:ring-demargo-orange/20 transition-all duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        const inputEl = e.currentTarget.previousSibling;
                                                        if (inputEl) inputEl.blur();
                                                    }}
                                                    className="px-4 bg-slate-900 border border-slate-800 hover:border-demargo-orange hover:bg-slate-850 text-slate-300 hover:text-white font-extrabold uppercase tracking-wider text-[10px] transition-all duration-200 shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                                                >
                                                    <span>OK</span>
                                                    <svg className="w-3.5 h-3.5 text-demargo-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* PDF Upload */}
                                    <div className="space-y-2">
                                        <label className="block text-slate-500 font-semibold">Site Measurement Documents (Max 5)</label>
                                        <div className="space-y-1.5 max-w-md">
                                            {(editProjData.measurementPdfUrls || []).map((fileItem, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-850 p-2 text-xs text-slate-300">
                                                    <button 
                                                        type="button"
                                                        onClick={() => viewDocument(fileItem.url)}
                                                        className="text-left font-semibold truncate hover:underline hover:text-demargo-orange pr-2 flex-1"
                                                        title={fileItem.name}
                                                    >
                                                        📄 {fileItem.name}
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleDeleteMeasurementPdf(idx)}
                                                        className="text-[10px] font-black text-red-500 hover:text-red-400 bg-slate-950 px-2 py-1 rounded transition uppercase"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {(editProjData.measurementPdfUrls || []).length < 5 && (
                                            <label className={`inline-block cursor-pointer px-3 py-2 text-xs font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition ${uploadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploadingPdf ? 'Uploading...' : '📎 Upload Measurement PDF'}
                                                <input 
                                                    type="file" 
                                                    accept=".pdf"
                                                    className="hidden"
                                                    disabled={uploadingPdf}
                                                    onChange={handlePdfUpload}
                                                />
                                            </label>
                                        )}
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
                                        <div className="space-y-2">
                                            <label className="block text-slate-500 font-semibold">Client Estimate Documents (Max 5)</label>
                                            <div className="space-y-1.5 max-w-md">
                                                {(editProjData.estimatePdfUrls || []).map((fileItem, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-850 p-2 text-xs text-slate-300">
                                                        <button 
                                                            type="button"
                                                            onClick={() => viewDocument(fileItem.url)}
                                                            className="text-left font-semibold truncate hover:underline hover:text-demargo-orange pr-2 flex-1"
                                                            title={fileItem.name}
                                                        >
                                                            📄 {fileItem.name}
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleDeleteEstimatePdf(idx)}
                                                            className="text-[10px] font-black text-red-500 hover:text-red-400 bg-slate-955 px-2 py-1 rounded transition uppercase"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            {(editProjData.estimatePdfUrls || []).length < 5 && (
                                                <label className={`inline-block cursor-pointer px-3 py-2 text-xs font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition ${uploadingEstimatePdf ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    {uploadingEstimatePdf ? 'Uploading...' : '📎 Upload Estimate PDF'}
                                                    <input 
                                                        type="file" 
                                                        accept=".pdf"
                                                        className="hidden"
                                                        disabled={uploadingEstimatePdf}
                                                        onChange={handleEstimatePdfUpload}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                     </div>
                                </div>

                                {/* 3. Fabric selection */}
                                <div className="border-t border-slate-850 pt-4 space-y-3">
                                    <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">3. Fabric Selections</span>
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
                                </div>

                                {/* 4. Installation scheduling */}
                                <div className="border-t border-slate-850 pt-4 space-y-3">
                                    <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">4. Installation Information</span>
                                    <div>
                                        <label className="block text-slate-500 font-semibold mb-1">Installation Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="datetime-local"
                                                value={editProjData.installationDate}
                                                onChange={(e) => setEditProjData(p => ({ ...p, installationDate: e.target.value }))}
                                                className="flex-1 bg-slate-950 border border-slate-850 text-white px-3 py-2 focus:outline-none focus:border-demargo-orange focus:ring-1 focus:ring-demargo-orange/20 transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    const inputEl = e.currentTarget.previousSibling;
                                                    if (inputEl) inputEl.blur();
                                                }}
                                                className="px-4 bg-slate-900 border border-slate-800 hover:border-demargo-orange hover:bg-slate-850 text-slate-300 hover:text-white font-extrabold uppercase tracking-wider text-[10px] transition-all duration-200 shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                                            >
                                                <span>OK</span>
                                                <svg className="w-3.5 h-3.5 text-demargo-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
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
                            <div className="border-t border-slate-850 pt-6 space-y-4">
                                <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block">5. Log Manual/Offline Payment</span>
                                <form onSubmit={handleLogPayment} className="space-y-3 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="sm:col-span-2">
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
                                        <label className="block text-slate-500 mb-1">Upload Receipt (PDF or DOCX) *</label>
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            onChange={(e) => setManualPaymentFile(e.target.files[0])}
                                            className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 text-xs focus:outline-none"
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

                            {/* Payments List for Selected Project */}
                            <div className="border-t border-slate-850 pt-6">
                                <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block mb-3">Project Ledger</span>
                                {loadingPayments ? (
                                    <p className="text-[10px] text-slate-500 italic">Syncing payment ledgers...</p>
                                ) : projectPayments.length === 0 ? (
                                    <p className="text-[10px] text-slate-500 italic">No payments logged under this project.</p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                        {projectPayments.map(p => (
                                            <div key={p.id} className="p-3 bg-slate-950 border border-slate-850 text-[10px] space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-200">GHS {p.amount.toLocaleString('en-GH')}</span>
                                                    {p.status === 'pending' ? (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-orange-900/30 border border-orange-700/50 text-orange-400 uppercase animate-pulse">PENDING VERIFY</span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-green-900/30 border border-green-700/50 text-green-400 uppercase">VERIFIED</span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between text-slate-500">
                                                    <span>Ref: {p.reference?.substring(0, 18)}</span>
                                                    <span className="capitalize">{p.paymentMethod?.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600">{p.paidAt ? new Date(p.paidAt).toLocaleString('en-GH') : ''}</span>
                                                    <div className="flex items-center gap-2">
                                                        {p.receiptUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={() => viewDocument(p.receiptUrl)}
                                                                className="text-demargo-orange hover:underline text-[9px] font-bold"
                                                            >
                                                                📄 Receipt
                                                            </button>
                                                        )}
                                                        {p.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleVerifyPayment(selectedProject.id, p.id, p.amount)}
                                                                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-[8px] font-bold uppercase transition"
                                                            >
                                                                ✓ Approve
                                                            </button>
                                                        )}
                                                    </div>
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
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
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
                                disabled={creatingProject}
                                className="w-full py-3 bg-demargo-orange text-white font-bold hover:opacity-90 transition-opacity uppercase tracking-wider text-xs disabled:opacity-50"
                            >
                                {creatingProject ? 'Creating project...' : 'Create Project Record'}
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
