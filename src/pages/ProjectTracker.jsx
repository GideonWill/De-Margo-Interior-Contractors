import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { getProjectsByPhone, getProjectById, updateProject, updateProjectPayment, recordPayment } from '../services/projectService'

import './ProjectTracker.css';
const STAGES = [
    { key: 'measurement', label: 'Measurement', title: 'Measurement Scheduled', desc: 'Taking window measurements & booking details' },
    { key: 'estimate', label: 'Estimate', title: 'Estimate Review', desc: 'Detailed pricing given for client approval' },
    { key: 'fabric', label: 'Fabric Selection', title: 'Fabric Selection', desc: 'Choosing colors, patterns & styles of fabrics' },
    { key: 'production', label: 'Tailoring', title: 'Production & Sewing', desc: 'Production team crafting your custom curtains (Min 60% deposit)' },
    { key: 'installation', label: 'Installation', title: 'Site Installation', desc: 'Installation team mounting curtains neatly at your site' },
    { key: 'completed', label: 'Completed', title: 'Project Finished', desc: 'Lifecycle complete and balance cleared' }
]

function ProjectTracker() {
    const [phone, setPhone] = useState('')
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState(null)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [loadingProject, setLoadingProject] = useState(false)
    
    // Payment states
    
    
    // Estimate approval state
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
                                        onChange={(e) => setPhone(e.target.value)}
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
                                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-demargo-orange/15 text-demargo-orange text-xs font-bold border border-demargo-orange/20 uppercase tracking-wider">
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

                        {/* STEPPER PROGRESS */}
                        <div className="bg-white border border-gray-200 p-6 md:p-8">
                            <h3 className="font-bold text-blue-900 text-lg mb-8 uppercase tracking-wider">Project Lifecycle Progress</h3>
                            
                            <div className="relative">
                                {/* Desktop Horizontal Timeline */}
                                <div className="hidden md:flex justify-between items-start relative">
                                    {/* Connection Line */}
                                    <div className="absolute top-5 left-[8%] right-[8%] h-[2px] bg-slate-800 z-0">
                                        <div 
                                            className="h-full bg-demargo-orange transition-all duration-500" 
                                            style={{ width: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 100}%` }}
                                        />
                                    </div>

                                    {STAGES.map((s, idx) => {
                                        const isCompleted = idx < currentStageIdx
                                        const isActive = idx === currentStageIdx
                                        const isUpcoming = idx > currentStageIdx
                                        
                                        return (
                                            <div key={s.key} className="flex-1 flex flex-col items-center text-center px-2 z-10 relative">
                                                {/* Node Circle */}
                                                <div 
                                                    className={`w-10 h-10 flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
                                                        isCompleted ? 'bg-demargo-orange border-demargo-orange text-blue-900' :
                                                        isActive ? 'bg-white border-demargo-orange text-demargo-orange ring-4 ring-demargo-orange/20' :
                                                        'bg-white border-gray-200 text-slate-600'
                                                    }`}
                                                >
                                                    {isCompleted ? '✓' : idx + 1}
                                                </div>

                                                <span className={`text-sm font-bold mt-4 transition-colors ${isActive ? 'text-demargo-orange' : isUpcoming ? 'text-blue-700' : 'text-blue-900'}`}>
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
                                        className="absolute left-[11px] top-2 w-[2px] bg-demargo-orange transition-all duration-500"
                                        style={{ height: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 90}%` }}
                                    />
                                    
                                    {STAGES.map((s, idx) => {
                                        const isCompleted = idx < currentStageIdx
                                        const isActive = idx === currentStageIdx
                                        
                                        return (
                                            <div key={s.key} className="flex gap-4 relative">
                                                {/* Left Bullet */}
                                                <div 
                                                    className={`w-6 h-6 flex items-center justify-center font-bold text-[10px] border-2 z-10 relative shrink-0 ${
                                                        isCompleted ? 'bg-demargo-orange border-demargo-orange text-blue-900' :
                                                        isActive ? 'bg-white border-demargo-orange text-demargo-orange ring-2 ring-demargo-orange/20' :
                                                        'bg-white border-gray-200 text-slate-600'
                                                    }`}
                                                >
                                                    {isCompleted ? '✓' : idx + 1}
                                                </div>
                                                {/* Text Content */}
                                                <div>
                                                    <div className={`text-sm font-bold ${isActive ? 'text-demargo-orange' : isCompleted ? 'text-blue-900' : 'text-slate-600'}`}>
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
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Detailed Info Column (Takes 2 cols) */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Active Step Details Card */}
                                <div className="bg-white border border-gray-200 p-6">
                                    <h4 className="text-xs text-demargo-orange uppercase tracking-wider font-semibold mb-2">Stage Details</h4>
                                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                                        Current Phase: {STAGES[currentStageIdx]?.title}
                                    </h3>
                                    
                                    {/* Action Box based on Status */}
                                    {selectedProject.status === 'measurement' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                Our team is scheduled to visit your site. This allows us to take accurate window dimensions, inspect wall structures, and evaluate track fittings.
                                            </p>
                                            {selectedProject.measurementDate ? (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-slate-300">
                                                    <strong className="text-blue-900 block mb-1">Scheduled Site Visit Date:</strong>
                                                    {new Date(selectedProject.measurementDate).toLocaleString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-blue-700 italic">Site measurement date will be set shortly by the admin.</p>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'estimate' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-4">
                                            <p className="text-sm text-slate-300">
                                                The measurements are completed. We have generated an estimate. Please review and provide your approval below.
                                            </p>
                                            {selectedProject.estimateDetails ? (
                                                <div className="bg-white p-4 border border-gray-200 text-xs whitespace-pre-line text-slate-300 font-mono">
                                                    <strong className="text-blue-900 font-sans block mb-2 text-sm">Estimate Breakdown:</strong>
                                                    {selectedProject.estimateDetails}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-blue-700 italic">No itemized estimate details uploaded yet. Total amount is GHS {selectedProject.totalAmount.toLocaleString('en-GH')}.</p>
                                            )}

                                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs text-blue-700 uppercase block">Total Estimate Price</span>
                                                    <span className="text-xl font-black text-demargo-orange">GHS {selectedProject.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <button
                                                    onClick={handleApproveEstimate}
                                                    disabled={approvingEstimate}
                                                    className="px-6 py-3 bg-demargo-orange hover:opacity-90 text-blue-900 font-bold text-sm transition disabled:opacity-50"
                                                >
                                                    {approvingEstimate ? 'Approving Estimate...' : 'Approve Estimate & Proceed'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject.status === 'fabric' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-4">
                                            <p className="text-sm text-slate-300">
                                                Fabric selection is now in progress. You can consult with our team to choose materials, colors, and textures for your curtains or blinds.
                                            </p>
                                            
                                            {selectedProject.selectedFabrics ? (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-slate-300">
                                                    <strong className="text-blue-900 block mb-1">Selections Chosen:</strong>
                                                    {selectedProject.selectedFabrics}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500 italic">Please contact our designers to finalize fabric codes.</p>
                                            )}

                                            {percentPaid < 60 ? (
                                                <div className="bg-orange-950/20 border border-orange-900/40 p-4 text-xs text-orange-400">
                                                    <strong className="block mb-1">Tailoring Sewing Notice:</strong>
                                                    Client must pay <strong>60% or more</strong> of the estimate (GHS {Math.ceil(selectedProject.totalAmount * 0.6).toLocaleString('en-GH')}) to start sewing. Current payment: {percentPaid}%. Minimum required deposit remaining: <strong>GHS {Math.max(0, Math.ceil(selectedProject.totalAmount * 0.6) - selectedProject.amountPaid).toLocaleString('en-GH')}</strong>.
                                                </div>
                                            ) : (
                                                <div className="bg-green-950/20 border border-green-900/40 p-4 text-xs text-green-400">
                                                    ✓ Deposit requirement of 60% met! Ready for tailoring.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'production' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-slate-300">
                                                Your fabrics have been selected, and the tailoring team has officially started cutting and sewing. 
                                            </p>
                                            <div className="bg-white p-4 border border-gray-200 text-xs text-slate-300 flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border border-demargo-orange border-t-transparent animate-spin shrink-0" />
                                                <span>Fabric Tailoring / Stitching in progress at production center.</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject.status === 'installation' && (
                                        <div className="bg-white p-5 border border-gray-200 space-y-3">
                                            <p className="text-sm text-slate-300">
                                                Curtains/blinds have been fully sewn. Our installation team is scheduling or executing the onsite mounting.
                                            </p>
                                            {selectedProject.installationDate && (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-slate-300">
                                                    <strong className="text-blue-900 block mb-1">Installation Site Date:</strong>
                                                    {new Date(selectedProject.installationDate).toLocaleString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                            {selectedProject.installationNotes && (
                                                <div className="bg-white p-4 border border-gray-200 text-xs text-blue-700 italic">
                                                    <strong>Status Notes:</strong> {selectedProject.installationNotes}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedProject.status === 'completed' && (
                                        <div className="bg-green-950/20 border border-green-900/30 p-5 text-green-300 space-y-2">
                                            <div className="text-2xl font-bold flex items-center gap-2">🏆 Project Complete</div>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                Your curtains and blinds have been installed neatly! The final balances are cleared. Thank you for partnering with Demargo Interior Contractors. We look forward to working with you again.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Project Notes & Logs Card */}
                                <div className="bg-white border border-gray-200 p-6">
                                    <h3 className="font-bold text-blue-900 text-md mb-4 uppercase tracking-wider">Project Records</h3>
                                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                                        <div className="bg-white p-4 border border-gray-200">
                                            <span className="text-slate-500 uppercase block mb-1">Client Address / Site Location</span>
                                            <span className="text-slate-200">{selectedProject.serviceAddress || 'No site location registered.'}</span>
                                        </div>
                                        <div className="bg-white p-4 border border-gray-200">
                                            <span className="text-slate-500 uppercase block mb-1">Measurement Details</span>
                                            <span className="text-slate-200 whitespace-pre-line">{selectedProject.measurementNotes || 'No measurements details recorded yet.'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Column (Takes 1 col) */}
                            <div className="space-y-6">
                                {/* Make Payment Widget */}
                                <div className="bg-white border border-gray-200 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-demargo-orange" />
                                    <h3 className="font-bold text-blue-900 text-md mb-4 uppercase tracking-wider">Settle Payments</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 border border-gray-200 space-y-3">
                                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Manual Payment Options</h4>
                                            <ul className="list-disc list-inside text-blue-700 space-y-1">
                                                <li><strong>MTN MOMO:</strong> 0538804623 (Demargo Interior Contractors)</li>
                                                <li><strong>Cal Bank:</strong> 1400005238082 (De Margo Bedding Sets and Collections)</li>
                                                <li><strong>Stanbic Bank:</strong> 9040013941399 (Demargo Interior Contractors)</li>
                                            </ul>
                                            <p className="text-xs text-blue-600">After payment, please inform the office so we can update the project status.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payments Log */}
                                <div className="bg-white border border-gray-200 p-6">
                                    <h3 className="font-bold text-blue-900 text-md mb-4 uppercase tracking-wider">Payment Log</h3>
                                    
                                    <ProjectPaymentsList projectId={selectedProject.id} triggerReload={loadingProject} />
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
                        <span className="text-green-500 uppercase font-black text-[9px] tracking-widest bg-green-500/10 px-1 border border-green-500/15">Success</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Ref: {p.reference?.substring(0, 14)}</span>
                        <span>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-GH') : ''}</span>
                    </div>
                    {p.paymentMethod && (
                        <div className="text-[10px] text-blue-700 capitalize">
                            Method: {p.paymentMethod.replace('_', ' ')}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ProjectTracker
