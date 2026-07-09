import React, { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { updateProjectPayment, recordPayment } from '../services/projectService'

/**
 * PaymentModal Component
 * Handles Paystack payment integration for project payments
 */
function PaymentModal({ project, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const config = {
        reference: `DMG_${project.id}_${new Date().getTime()}`,
        email: project.clientEmail,
        amount: Math.round(project.balance * 100), // Paystack expects amount in kobo (pesewas)
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        currency: 'GHS',
        channels: ['mobile_money', 'card'],
        metadata: {
            projectId: project.id,
            projectTitle: project.projectTitle,
            clientName: project.clientName,
            clientPhone: project.clientPhone,
            custom_fields: [
                {
                    display_name: 'Project',
                    variable_name: 'project_title',
                    value: project.projectTitle
                },
                {
                    display_name: 'Client',
                    variable_name: 'client_name',
                    value: project.clientName
                }
            ]
        }
    }

    const onPaymentSuccess = (reference) => {
        // We call onSuccess immediately so the parent can hide the modal
        // and perform the database updates.
        if (onSuccess) {
            onSuccess(reference)
        }
        // Force close local modal state if any
        if (onClose) {
            onClose()
        }
    }

    const onPaymentClose = () => {
        console.log('Payment popup closed')
    }

    const initializePayment = usePaystackPayment(config)
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = () => {
        setIsProcessing(true)
        initializePayment(
            (ref) => {
                setIsProcessing(false) // Reset loading if it returns (though onSuccess usually closes the modal)
                onPaymentSuccess(ref)
            },
            () => {
                console.log('Payment popup closed')
                setIsProcessing(false)
            }
        )
        // Close the modal immediately so the user doesn't see it while the popup is opening/active
        if (onClose) {
            onClose(true)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-demargo-orange to-demargo-blue p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Make Payment</h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Project Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Project</span>
                            <span className="text-sm font-semibold text-right">{project.projectTitle}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Client</span>
                            <span className="text-sm font-semibold">{project.clientName}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Amount</span>
                                <span className="text-sm">GHS {project.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Amount Paid</span>
                                <span className="text-sm text-green-600">GHS {project.amountPaid.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
                                <span className="font-semibold text-gray-900">Balance Due</span>
                                <span className="text-xl font-bold text-demargo-orange">
                                    GHS {project.balance.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Secure Payment via Paystack</p>
                                <p className="text-xs">You will be redirected to Paystack to complete your payment securely. We accept all major cards and mobile money.</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={loading || isProcessing}
                            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-demargo-orange to-demargo-blue text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading || isProcessing ? 'Opening...' : `Pay GHS ${project.balance.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal
