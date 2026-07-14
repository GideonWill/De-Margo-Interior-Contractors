import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { TrophyIcon } from '@heroicons/react/24/outline'
import { getProjectsByPhone, getProjectById, updateProject, updateProjectPayment, recordPayment, addProjectMessage, updateProjectMessages, subscribeToProject, uploadFile } from '../services/projectService'

import './ProjectTracker.css';
const STAGES = [
    { key: 'measurement', label: 'Measurement', title: 'Measurement Scheduled', desc: 'Taking window measurements & booking details' },
    { key: 'estimate', label: 'Estimate', title: 'Estimate Review', desc: 'Detailed pricing given for client approval' },
    { key: 'fabric', label: 'Fabric Selection', title: 'Fabric Selection', desc: 'Choosing colors, patterns & styles of fabrics' },
    { key: 'production', label: 'Tailoring', title: 'Production & Sewing', desc: 'Production team crafting your custom curtains (Min 60% deposit)' },
    { key: 'installation', label: 'Installation', title: 'Site Installation', desc: 'Installation team mounting curtains neatly at your site' },
    { key: 'correction', label: 'Correction', title: 'Project Under Correction', desc: 'Addressing and correcting any issues or adjustments with the project' },
    { key: 'completed', label: 'Completed', title: 'Project Finished', desc: 'Lifecycle complete and balance cleared' }
]

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

function ProjectTracker() {
    const [phone, setPhone] = useState('')
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState(null)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [loadingProject, setLoadingProject] = useState(false)
    const [messageInput, setMessageInput] = useState('')
    const [sendingMessage, setSendingMessage] = useState(false)
    const [hasNewAdminMessage, setHasNewAdminMessage] = useState(false)
    const projectSubscriptionRef = useRef(null)
    const messagesListRef = useRef(null)
    
    // Payment states
    const [clientPaymentData, setClientPaymentData] = useState({
        amount: '',
        method: 'mobile_money',
        reference: ''
    })
    const [clientPaymentFile, setClientPaymentFile] = useState(null)
    const [submittingPaymentProof, setSubmittingPaymentProof] = useState(false)
    const [approvingEstimate, setApprovingEstimate] = useState(false)

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
    }

    // Handle search by phone number
    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (!phone.trim()) return
        
        setSearching(true)
        setError(null)
        setSelectedProject(null)
        
        try {
            const results = await getProjectsByPhone(phone)
            setProjects(results)
            if (results.length === 0) {
                setError('No projects found associated with this phone number. Please ensure it matches the number used during registration.')
            } else if (results.length === 1) {
                // If only one project is found, select it automatically
                handleSelectProject(results[0].id)
            }
        } catch (err) {
            console.error('Search error:', err)
            setError('An error occurred while fetching project data. Please try again.')
        } finally {
            setSearching(false)
        }
    }

    // Select project and load fresh details
    const handleSelectProject = async (id) => {
        setLoadingProject(true)
        setError(null)
        try {
            const proj = await getProjectById(id)
            setSelectedProject(proj)
        } catch (err) {
            console.error('Error fetching project:', err)
            setError('Could not load project details. Please try again.')
        } finally {
            setLoadingProject(false)
        }
    }

    React.useEffect(() => {
        if (!selectedProject?.id) return

        if (projectSubscriptionRef.current) {
            projectSubscriptionRef.current()
            projectSubscriptionRef.current = null
        }

        projectSubscriptionRef.current = subscribeToProject(selectedProject.id, (updatedProject) => {
            setSelectedProject(prev => {
                if (!prev || prev.id !== updatedProject.id) return updatedProject
                return { ...prev, ...updatedProject }
            })
        })

        return () => {
            if (projectSubscriptionRef.current) {
                projectSubscriptionRef.current()
                projectSubscriptionRef.current = null
            }
        }
    }, [selectedProject?.id])

    React.useEffect(() => {
        if (!selectedProject) return
        const unread = (selectedProject.messages || []).some(msg => msg.sender === 'admin' && !msg.readByClient)
        setHasNewAdminMessage(unread)

        if (!unread) return

        const updatedMessages = (selectedProject.messages || []).map(msg =>
            msg.sender === 'admin' ? { ...msg, readByClient: true } : msg
        )

        setSelectedProject(prev => prev ? { ...prev, messages: updatedMessages } : prev)
        updateProjectMessages(selectedProject.id, updatedMessages).catch(err => {
            console.error('Could not mark admin messages read:', err)
        })
    }, [selectedProject?.messages])

    React.useEffect(() => {
        if (!messagesListRef.current) return
        messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight
    }, [selectedProject?.messages?.length])

    // Approve the estimate (moves stage from 'estimate' to 'fabric')
    const handleApproveEstimate = async () => {
        if (!selectedProject) return
        setApprovingEstimate(true)
        try {
            await updateProject(selectedProject.id, {
                status: 'fabric',
                estimateApproved: true
            })
            // Reload project
            await handleSelectProject(selectedProject.id)
            showToast('Estimate approved successfully! You can now proceed to fabric selection.', 'success')
        } catch (err) {
            console.error('Approval error:', err)
            showToast('Failed to approve estimate. Please try again or contact support.', 'error')
        } finally {
            setApprovingEstimate(false)
        }
    }

    const handleSendMessage = async () => {
        if (!selectedProject || !messageInput.trim()) return
        setSendingMessage(true)
        const message = {
            id: `msg-${Date.now()}`,
            sender: 'client',
            body: messageInput.trim(),
            createdAt: new Date().toISOString(),
            readByAdmin: false,
            readByClient: true
        }
        setSelectedProject(prev => prev ? { ...prev, messages: [...(prev.messages || []), message] } : prev)
        setMessageInput('')

        try {
            await addProjectMessage(selectedProject.id, message)
            await handleSelectProject(selectedProject.id)
            showToast('Message sent. Our team will respond shortly.', 'success')
        } catch (err) {
            console.error('Message send error:', err)
            showToast('Could not send your message. Please try again.', 'error')
        } finally {
            setSendingMessage(false)
        }
    }

    const handleManualPaymentSubmit = async (e) => {
        e.preventDefault()
        if (!selectedProject) return
        const amountNum = parseFloat(clientPaymentData.amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            showToast('Please enter a valid amount.', 'error')
            return
        }
        if (!clientPaymentFile) {
            showToast('Please upload your receipt file.', 'error')
            return
        }

        setSubmittingPaymentProof(true)
        try {
            // Upload receipt file
            const receiptPath = `payments/${selectedProject.id}_${Date.now()}_${clientPaymentFile.name}`
            const receiptUrl = await uploadFile(receiptPath, clientPaymentFile)

            // Record payment as pending
            await recordPayment({
                projectId: selectedProject.id,
                amount: amountNum,
                reference: clientPaymentData.reference.trim(),
                status: 'pending',
                paymentMethod: clientPaymentData.method,
                clientEmail: selectedProject.clientEmail || 'no-email@demargo.com',
                clientName: selectedProject.clientName,
                receiptUrl: receiptUrl,
                clientSubmitted: true,
                paidAt: new Date().toISOString()
            })

            // Add client message notifying admin
            const notificationMsg = {
                id: `msg-${Date.now()}`,
                sender: 'client',
                body: `[PAYMENT PROOF SUBMITTED] I have uploaded a payment proof of GHS ${amountNum.toLocaleString('en-GH')} (Method: ${clientPaymentData.method.replace('_', ' ')}). Reference: ${clientPaymentData.reference.trim()}`,
                createdAt: new Date().toISOString(),
                readByAdmin: false,
                readByClient: true
            }
            await addProjectMessage(selectedProject.id, notificationMsg)

            // Reset form
            setClientPaymentData({ amount: '', method: 'mobile_money', reference: '' })
            setClientPaymentFile(null)
            
            // Reset form element
            e.target.reset()

            showToast('Payment proof submitted successfully! Admin will verify and update the status.', 'success')
            // Refresh project view
            await handleSelectProject(selectedProject.id)
        } catch (err) {
            console.error('Error submitting payment proof:', err)
            showToast('Failed to upload receipt or record payment.', 'error')
        } finally {
            setSubmittingPaymentProof(false)
        }
    }

    // Get stage index
    const getStageIndex = (status) => {
        return STAGES.findIndex(s => s.key === status)
    }

    const currentStageIdx = selectedProject ? getStageIndex(selectedProject.status) : 0
    const percentPaid = selectedProject && selectedProject.totalAmount > 0 
        ? Math.round((selectedProject.amountPaid / selectedProject.totalAmount) * 100)
        : 0

    return (
        <main className="project-tracker-theme min-h-screen bg-white text-blue-900 py-16 px-4">
            <Helmet>
                <title>Track Your Project • Demargo Interior Contractors</title>
                <meta name="description" content="Track the real-time progress of your custom interior design, curtain sewing, and installation projects." />
            </Helmet>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-demargo-orange mb-3">
                        <span>●</span> Live Tracking Portal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        TRACK <span className="text-gradient-ob font-black">PROJECT PROGRESS</span>
                    </h1>
                    <p className="text-blue-700 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                        Follow your design project step-by-step from measurement, fabric tailoring, to final neat installation.
                    </p>
                </div>

                {/* Lookup Widget */}
                {!selectedProject && (
                    <div className="max-w-xl mx-auto bg-white border border-gray-200 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-demargo-orange" />
                        <h2 className="text-xl font-bold text-blue-900 mb-2">Find Your Project</h2>
                        <p className="text-xs text-blue-700 mb-6">
                            Enter the phone number you provided during your consultation (e.g. 0241234567).
                        </p>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label htmlFor="phoneSearch" className="sr-only">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-bold">☏</span>
                                    <input
                                        type="tel"
                                        id="phoneSearch"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                                        required
                                        placeholder="Phone number used to register"
                                        className="w-full pl-10 pr-4 py-4 bg-white border border-gray-300 text-blue-900 placeholder-gray-500 focus:outline-none focus:border-demargo-orange transition-colors"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={searching}
                                className="w-full py-4 bg-demargo-orange text-blue-900 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                {searching ? 'Searching Data...' : 'Lookup Project'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>

                        {error && (
                            <div className="mt-6 bg-red-100 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
                                <span className="text-base">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Multiple Projects Selector */}
                {!selectedProject && projects.length > 1 && (
                    <div className="max-w-2xl mx-auto mt-8 bg-white border border-gray-200 p-6">
                        <h3 className="font-bold text-blue-900 mb-4">We found multiple projects under this number:</h3>
                        <div className="grid gap-3">
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelectProject(p.id)}
                                    className="w-full text-left p-4 bg-white hover:bg-gray-200 border border-gray-200 hover:border-gray-700 transition flex justify-between items-center gap-2"
                                >
                                    <div>
                                        <div className="font-bold text-blue-900">{p.projectTitle}</div>
                                        <div className="text-xs text-blue-700 mt-1">Status: {STAGES.find(s => s.key === p.status)?.label || p.status}</div>
                                    </div>
                                    <span className="text-demargo-orange text-lg">›</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Project Details Dashboard */}
                {selectedProject && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Control Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 px-6 py-4">
                            <div>
                                <span className="text-xs text-blue-700 uppercase tracking-widest">Client Name</span>
                                <div className="text-lg font-bold text-blue-900">{selectedProject.clientName}</div>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        setSelectedProject(null)
                                        if (projects.length <= 1) setProjects([])
                                    }}
                                    className="px-4 py-2 border border-gray-700 hover:bg-gray-200 transition text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedProject) {
                                            handleSelectProject(selectedProject.id);
                                        }
                                    }}
                                    disabled={loadingProject}
                                    className="px-4 py-2 border border-blue-900 hover:bg-blue-50 transition text-sm text-blue-900 font-bold w-full sm:w-auto text-center flex items-center justify-center gap-2"
                                >
                                    {loadingProject ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-blue-900 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h5M20 20v-5h-5M4 20l5-5M20 4l-5 5"
                                                />
                                            </svg>
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-5 w-5 text-blue-900"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h5M20 20v-5h-5M4 20l5-5M20 4l-5 5"
                                                />
                                            </svg>
                                            Refresh Status
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Top Summary Banner */}
                        <div className="bg-white border border-gray-200 p-6 md:p-8 grid md:grid-cols-3 gap-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-demargo-orange to-demargo-blue" />
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wider block">Project Title</span>
                                <h2 className="text-2xl font-extrabold text-blue-900 mt-1">{selectedProject.projectTitle}</h2>
                                <p className="text-xs text-blue-700 mt-2 line-clamp-2">{selectedProject.projectDescription}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wider block">Current Status</span>
                                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                                    selectedProject.status === 'correction' 
                                        ? 'bg-red-500/15 text-red-500 border-red-500/20 animate-pulse' 
                                        : 'bg-demargo-orange/15 text-demargo-orange border-demargo-orange/20'
                                }`}>
                                    {STAGES[currentStageIdx]?.label}
                                </div>
                                <p className="text-xs text-blue-700 mt-2">{STAGES[currentStageIdx]?.desc}</p>
                            </div>
                            <div>
                                <span className="text-xs text-blue-700 uppercase tracking-wider block">Payment Progress ({percentPaid}%)</span>
                                <div className="w-full bg-gray-300 h-2 mt-3 relative">
                                    <div 
                                        className="h-full bg-gradient-to-r from-demargo-orange to-demargo-blue transition-all duration-500" 
                                        style={{ width: `${percentPaid}%` }}
                                    />
                                    {percentPaid < 60 && (
                                        <div 
                                            className="absolute top-0 h-full w-[2px] bg-red-500" 
                                            style={{ left: '60%' }} 
                                            title="60% Tailoring Deposit Threshold"
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between text-xs text-blue-700 mt-2">
                                    <span>GHS {selectedProject.amountPaid.toLocaleString('en-GH')} Paid</span>
                                    <span>GHS {selectedProject.balance.toLocaleString('en-GH')} Bal</span>
                                </div>
                            </div>
                        </div>

                        {/* Thank You Completed Banner */}
                        {selectedProject.status === 'completed' && (
                            <div className="bg-emerald-50 border border-emerald-200 p-6 md:p-8 rounded-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-md">
                                <div className="text-4xl">🎉</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-emerald-950 mb-1">Thank You for Partnering with Us!</h3>
                                    <p className="text-sm text-emerald-800 leading-relaxed">
                                        We sincerely appreciate your business and trust in <strong>Demargo Interior Contractors</strong>. It has been our absolute pleasure to bring your vision to life and complete this project with you. We hope your new space brings you joy and great ambience!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STEPPER PROGRESS */}
                        <div className="bg-white border border-gray-200 p-6 md:p-8">
                            <h3 className="font-bold text-blue-900 text-lg mb-8 uppercase tracking-wider">Project Lifecycle Progress</h3>
                            
                            <div className="relative">
                                {/* Desktop Horizontal Timeline */}
                                <div className="hidden md:flex justify-between items-start relative">
                                    {/* Connection Line */}
                                    <div className="absolute top-5 left-[8%] right-[8%] h-[2px] bg-slate-800 z-0">
                                        <div 
                                            className={`h-full transition-all duration-500 ${selectedProject.status === 'completed' ? 'bg-emerald-500' : 'bg-demargo-orange'}`} 
                                            style={{ width: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 100}%` }}
                                        />
                                    </div>

                                    {STAGES.map((s, idx) => {
                                        const isCompleted = idx < currentStageIdx
                                        const isActive = idx === currentStageIdx
                                        const isUpcoming = idx > currentStageIdx
                                        const isFinalCompleted = s.key === 'completed' && selectedProject.status === 'completed'
                                        
                                        return (
                                            <div key={s.key} className="flex-1 flex flex-col items-center text-center px-2 z-10 relative">
                                                {/* Node Circle */}
                                                <div 
                                                    className={`w-10 h-10 flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
                                                        isFinalCompleted ? 'bg-emerald-500 border-emerald-500 text-white ring-4 ring-emerald-500/20' :
                                                        isCompleted ? 'bg-demargo-orange border-demargo-orange text-blue-900' :
                                                        isActive ? 'bg-white border-demargo-orange text-demargo-orange ring-4 ring-demargo-orange/20' :
                                                        'bg-white border-gray-200 text-slate-600'
                                                    }`}
                                                >
                                                    {isFinalCompleted || isCompleted ? '✓' : idx + 1}
                                                </div>

                                                <span className={`text-sm font-bold mt-4 transition-colors ${
                                                    isFinalCompleted ? 'text-emerald-600' : 
                                                    isActive ? 'text-demargo-orange' : isUpcoming ? 'text-blue-700' : 'text-blue-900'
                                                }`}>
                                                    {s.label}
                                                </span>
                                                <span className="text-[10px] text-blue-700 mt-1 max-w-[140px] leading-relaxed">
                                                    {s.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Mobile Vertical Timeline */}
                                <div className="md:hidden space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                                    {/* Mobile Connection Line indicator */}
                                    <div 
                                        className={`absolute left-[11px] top-2 w-[2px] transition-all duration-500 ${selectedProject.status === 'completed' ? 'bg-emerald-500' : 'bg-demargo-orange'}`}
                                        style={{ height: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 90}%` }}
                                    />
                                    
                                    {STAGES.map((s, idx) => {
                                        const isCompleted = idx < currentStageIdx
                                        const isActive = idx === currentStageIdx
                                        const isFinalCompleted = s.key === 'completed' && selectedProject.status === 'completed'
                                        
                                        return (
                                            <div key={s.key} className="flex gap-4 relative">
                                                {/* Left Bullet */}
                                                <div 
                                                    className={`w-6 h-6 flex items-center justify-center font-bold text-[10px] border-2 z-10 relative shrink-0 ${
                                                        isFinalCompleted ? 'bg-emerald-500 border-emerald-500 text-white ring-2 ring-emerald-500/20' :
                                                        isCompleted ? 'bg-demargo-orange border-demargo-orange text-blue-900' :
                                                        isActive ? 'bg-white border-demargo-orange text-demargo-orange ring-2 ring-demargo-orange/20' :
                                                        'bg-white border-gray-200 text-slate-600'
                                                    }`}
                                                >
                                                    {isFinalCompleted || isCompleted ? '✓' : idx + 1}
                                                </div>
                                                {/* Text Content */}
                                                <div>
                                                    <div className={`text-sm font-bold ${
                                                        isFinalCompleted ? 'text-emerald-600' :
                                                        isActive ? 'text-demargo-orange' : isCompleted ? 'text-blue-900' : 'text-slate-600'
                                                    }`}>
                                                        {s.label} ({s.title})
                                                    </div>
                                                    <p className="text-xs text-blue-700 mt-0.5">{s.desc}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Context Cards */}
                        <div className="max-w-4xl mx-auto space-y-6">
                                {/* Active Step Details Card */}
                                <div className="bg-white border border-gray-200 p-6">
                                    <h4 className="text-xs text-demargo-orange uppercase tracking-wider font-semibold mb-2">Stage Details</h4>
                                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                                        Current Phase: {STAGES[currentStageIdx]?.title}
                                    </h3>
                                                      {/* Action Box based on Status */}
                                    {selectedProject.status === 'measurement' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-blue-900 leading-relaxed">
                                                Our team is scheduled to visit your site. This allows us to take accurate window dimensions, inspect wall structures, and evaluate track fittings.
                                            </p>
                                            {selectedProject.measurementDate && (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-blue-900">
                                                    <strong className="text-blue-900 block mb-1">Scheduled Site Visit Date:</strong>
                                                    {new Date(selectedProject.measurementDate).toLocaleString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                            {!selectedProject.measurementDate && (
                                                <p className="text-xs text-blue-700 italic">Site measurement details/date will be set shortly by the admin.</p>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'estimate' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-4">
                                            <p className="text-sm text-blue-900 leading-relaxed">
                                                Your site measurements are completed and an estimate has been prepared. Please review the breakdown below. Once you make the required deposit/payment manually, the admin team will update your project to the next stage (Fabric Selection).
                                            </p>
                                            {((selectedProject.estimatePdfUrls && selectedProject.estimatePdfUrls.length > 0) || selectedProject.estimatePdfUrl) ? (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-blue-900 space-y-2">
                                                    <strong className="text-blue-900 font-sans block mb-2 text-sm">Estimate Documents:</strong>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedProject.estimatePdfUrls && selectedProject.estimatePdfUrls.length > 0 ? (
                                                            selectedProject.estimatePdfUrls.map((fileItem, idx) => (
                                                                <button 
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => viewDocument(fileItem.url)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-demargo-orange hover:opacity-90 text-blue-900 font-bold text-[11px] transition"
                                                                >
                                                                    📄 {fileItem.name}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <button 
                                                                type="button"
                                                                onClick={() => viewDocument(selectedProject.estimatePdfUrl)}
                                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-demargo-orange hover:opacity-90 text-blue-900 font-bold text-xs transition"
                                                            >
                                                                📄 View Client Estimate PDF
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-blue-700 italic">No estimate document uploaded yet. Total amount is GHS {selectedProject.totalAmount.toLocaleString('en-GH')}.</p>
                                            )}

                                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs text-blue-700 uppercase block">Total Estimate Price</span>
                                                    <span className="text-xl font-black text-demargo-orange">GHS {selectedProject.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="text-xs text-blue-700 font-medium italic">
                                                    Awaiting manual payment/deposit to proceed.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject.status === 'fabric' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-4">
                                            <p className="text-sm text-blue-900">
                                                Fabric selection is now in progress. You can consult with our team to choose materials, colors, and textures for your curtains or blinds.
                                            </p>
                                            
                                            {selectedProject.selectedFabrics ? (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-blue-900">
                                                    <strong className="text-blue-900 block mb-1">Selections Chosen:</strong>
                                                    {selectedProject.selectedFabrics}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500 italic">Please contact our designers to finalize fabric codes.</p>
                                            )}

                                            {percentPaid < 60 ? (
                                                <div className="bg-orange-50 border border-orange-200 p-4 text-xs text-orange-800">
                                                    <strong className="block mb-1">Tailoring Sewing Notice:</strong>
                                                    Client must pay <strong>60% or more</strong> of the estimate (GHS {Math.ceil(selectedProject.totalAmount * 0.6).toLocaleString('en-GH')}) to start sewing. Current payment: {percentPaid}%. Minimum required deposit remaining: <strong>GHS {Math.max(0, Math.ceil(selectedProject.totalAmount * 0.6) - selectedProject.amountPaid).toLocaleString('en-GH')}</strong>.
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 border border-green-200 p-4 text-xs text-green-800">
                                                    ✓ Deposit requirement of 60% met! Ready for tailoring.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'production' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-blue-900">
                                                Your fabrics have been selected, and the tailoring team has officially started cutting and sewing. 
                                            </p>
                                            <div className="bg-white p-4 border border-gray-200 text-xs text-blue-950 flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border border-demargo-orange border-t-transparent animate-spin shrink-0" />
                                                <span>Fabric Tailoring / Stitching in progress at production center.</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject.status === 'installation' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-blue-900">
                                                Curtains/blinds have been fully sewn. Our installation team is scheduling or executing the onsite mounting.
                                            </p>
                                            {selectedProject.installationDate && (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-blue-900">
                                                    <strong className="text-blue-900 block mb-1">Installation Site Date:</strong>
                                                    {new Date(selectedProject.installationDate).toLocaleString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'correction' && (
                                        <div className="bg-red-50/50 p-5 border border-red-200 space-y-3">
                                            <p className="text-sm text-red-950 font-medium">
                                                Ongoing issues or post-installation adjustments have been reported.
                                            </p>
                                            <div className="bg-white/80 p-4 border border-red-100 text-xs text-red-900 flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border border-red-500 border-t-transparent animate-spin shrink-0" />
                                                <span>Our team is actively working to resolve the issues and make the necessary corrections.</span>
                                            </div>
                                        </div>
                                    )}

                                     {selectedProject.status === 'completed' && (
                                         <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-emerald-950">
                                             <div className="flex items-center gap-3 text-2xl font-bold text-emerald-900">
                                                 <TrophyIcon className="h-8 w-8 text-amber-500" />
                                                 <span>Project Complete</span>
                                             </div>
                                         </div>
                                     )}
                                </div>

                                {/* Project Notes & Logs Card */}
                                <div className="bg-white border border-gray-200 p-6">
                                    <h3 className="font-bold text-blue-900 text-md mb-4 uppercase tracking-wider">Project Records</h3>
                                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                                        <div className="bg-white p-4 border border-gray-200 space-y-3">
                                            <div>
                                                <span className="text-slate-500 uppercase block mb-1">Client Address / Site Location</span>
                                                <span className="text-blue-900">{selectedProject.serviceAddress || 'No site location registered.'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-gray-200 rounded-3xl p-5 flex flex-col h-[480px]">
                                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Support Chat (Direct Line)</span>
                                                </div>
                                                <span className="text-[9px] text-slate-500 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-full">{(selectedProject.messages || []).length} messages</span>
                                            </div>
                                            {hasNewAdminMessage && (
                                                <div className="my-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 text-emerald-900 flex items-start gap-2 animate-pulse text-[11px]">
                                                    <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                                    <div>
                                                        <span className="font-bold">New reply from Demargo team!</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Messages Log area */}
                                            <div ref={messagesListRef} className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
                                                {(selectedProject.messages || []).length > 0 ? (
                                                    selectedProject.messages.map((msg) => {
                                                        const isAdmin = msg.sender === 'admin'
                                                        return (
                                                            <div key={msg.id} className={`flex w-full gap-2 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                                                {isAdmin && (
                                                                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-blue-950 uppercase" title="Admin">
                                                                        A
                                                                    </div>
                                                                )}
                                                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs relative ${
                                                                    isAdmin 
                                                                        ? 'bg-white text-blue-950 border border-gray-200 rounded-tl-none' 
                                                                        : 'bg-demargo-orange text-blue-950 font-semibold rounded-tr-none'
                                                                }`}>
                                                                    <p className="whitespace-pre-line leading-relaxed">{msg.body}</p>
                                                                    {isAdmin ? (
                                                                        <span className="block text-[9px] mt-1.5 text-right text-slate-450">
                                                                            {new Date(msg.createdAt).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    ) : (
                                                                        <div className="flex items-center justify-end gap-1 text-[9px] mt-1.5 text-blue-900/60">
                                                                            <span>{new Date(msg.createdAt).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                            {msg.readByAdmin ? (
                                                                                <span className="text-white font-black text-[10px] leading-none" title="Read by Admin">✓✓</span>
                                                                            ) : (
                                                                                <span className="text-blue-900/40 font-black text-[10px] leading-none" title="Sent">✓</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!isAdmin && (
                                                                    <div className="w-8 h-8 rounded-full bg-amber-500 text-blue-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-amber-600 uppercase" title="You">
                                                                        U
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 py-10">
                                                        <span className="text-3xl mb-2">💬</span>
                                                        <p className="text-xs italic">No messages yet. Ask a question to start the conversation.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chat Input area */}
                                            <div className="flex gap-2 items-center bg-white border border-gray-300 rounded-full px-4 py-2 focus-within:border-demargo-orange focus-within:ring-1 focus-within:ring-demargo-orange/20 transition">
                                                <input
                                                    type="text"
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && messageInput.trim() && !sendingMessage) {
                                                            handleSendMessage()
                                                        }
                                                    }}
                                                    placeholder="Type a message..."
                                                    className="flex-1 bg-transparent text-xs text-blue-900 focus:outline-none border-none outline-none"
                                                    disabled={sendingMessage}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleSendMessage}
                                                    disabled={sendingMessage || !messageInput.trim()}
                                                    className="p-1 text-demargo-orange hover:text-orange-600 disabled:opacity-30 transition shrink-0"
                                                >
                                                    <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

            {/* Paystack Payment Modal Wrapper */}
            
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

// Subcomponent to fetch and render payments history list
function ProjectPaymentsList({ projectId, triggerReload }) {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPayments = async () => {
        try {
            // Import dynamically or use standard import
            const { getProjectPayments } = await import('../services/projectService')
            const list = await getProjectPayments(projectId)
            // Sort by date descending
            list.sort((a, b) => new Date(b.createdAt || b.paidAt) - new Date(a.createdAt || a.paidAt))
            setPayments(list)
        } catch (e) {
            console.error('Error fetching payments list:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [projectId, triggerReload])

    if (loading) return <p className="text-xs text-blue-700">Loading payment ledger...</p>
    if (payments.length === 0) return <p className="text-xs text-blue-700 italic">No payments recorded yet.</p>

    return (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {payments.map(p => (
                <div key={p.id} className="p-3 bg-white border border-gray-200 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-blue-900">
                        <span>GHS {p.amount.toLocaleString('en-GH')}</span>
                        {p.status === 'pending' ? (
                            <span className="text-orange-500 uppercase font-black text-[9px] tracking-widest bg-orange-500/10 px-1 border border-orange-500/15 animate-pulse">Pending</span>
                        ) : (
                            <span className="text-green-500 uppercase font-black text-[9px] tracking-widest bg-green-500/10 px-1 border border-green-500/15">Success</span>
                        )}
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Ref: {p.reference?.substring(0, 14)}</span>
                        <span>{p.paidAt ? new Date(p.paidAt).toLocaleString('en-GH') : ''}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-blue-700 capitalize">
                        <span>Method: {p.paymentMethod?.replace('_', ' ')}</span>
                        {p.receiptUrl && (
                            <button 
                                type="button"
                                onClick={() => viewDocument(p.receiptUrl)} 
                                className="text-blue-600 hover:underline font-semibold text-[10px]"
                            >
                                📄 View Receipt
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProjectTracker
