import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { createProject, recordPayment, updateProjectPayment } from '../services/projectService'
import PaymentModal from '../components/PaymentModal'

/**
 * TransportPayment Component
 * Self-service form for measurement transport payment
 * Allows clients to submit details and pay immediately
 */
function TransportPayment() {
    const isSuccessRef = React.useRef(false)
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceAddress: '',
        preferredDate: '',
        additionalNotes: '',
        transportFee: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [createdProject, setCreatedProject] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // If we already have a project for this form and it's the same fee, just re-open the modal
        if (createdProject && Number(createdProject.totalAmount) === Number(formData.transportFee)) {
            setShowPaymentModal(true)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Validate transport fee
            const fee = parseFloat(formData.transportFee)
            if (isNaN(fee) || fee <= 0) {
                throw new Error('Please enter a valid transport fee amount')
            }

            // Create project in Firestore
            const projectData = {
                clientName: formData.clientName.trim(),
                clientEmail: formData.clientEmail.trim().toLowerCase(),
                clientPhone: formData.clientPhone.trim(),
                projectTitle: 'Measurement Transport Service',
                projectDescription: `Service Address: ${formData.serviceAddress}${formData.preferredDate ? `\nPreferred Date: ${formData.preferredDate}` : ''}${formData.additionalNotes ? `\nNotes: ${formData.additionalNotes}` : ''}`,
                totalAmount: fee,
                status: 'approved' // Auto-approved for immediate payment
            }

            const projectId = await createProject(projectData)

            // Set created project with ID for payment
            setCreatedProject({
                id: projectId,
                ...projectData,
                amountPaid: 0,
                balance: fee
            })

            // Show payment modal immediately
            setShowPaymentModal(true)
            setLoading(false)
        } catch (err) {
            console.error('Error creating transport project:', err)
            setError(err.message || 'Failed to create transport request. Please try again.')
            setLoading(false)
        }
    }

    const navigate = useNavigate()

    const handlePaymentSuccess = async (reference) => {
        // 1. Mark as success immediately
        isSuccessRef.current = true

        // 2. CLOSE EVERYTHING IN THE UI INSTANTLY
        setShowPaymentModal(false)
        setShowSuccess(true)

        // Save project info for background DB update
        const projectToUpdate = { ...createdProject }

        // 3. Reset form and active project state
        setFormData({
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            serviceAddress: '',
            preferredDate: '',
            additionalNotes: '',
            transportFee: ''
        })
        setCreatedProject(null)

        // 4. Force closure of any other open dialogues (like the chat)
        window.dispatchEvent(new CustomEvent('closeAllDialogs'))

        // 5. Perform database updates in the background
        try {
            await recordPayment({
                projectId: projectToUpdate.id,
                amount: Number(projectToUpdate.balance),
                reference: reference.reference,
                status: 'success',
                paymentMethod: 'paystack',
                clientEmail: projectToUpdate.clientEmail,
                clientName: projectToUpdate.clientName,
                transactionId: reference.transaction,
                paidAt: new Date().toISOString()
            })

            await updateProjectPayment(projectToUpdate.id, Number(projectToUpdate.balance))
        } catch (err) {
            console.error('Error updating database after payment:', err)
        }

        // Hide success message after 3 seconds and redirect home
        setTimeout(() => {
            setShowSuccess(false)
            navigate('/') // Redirect to home page
        }, 3000)
    }

    const handlePaymentClose = (isSilent = false) => {
        if (isSilent || isSuccessRef.current) {
            setShowPaymentModal(false)
            isSuccessRef.current = false
            return
        }

        // Show confirmation before closing
        setShowCancelConfirm(true)
    }

    const confirmCancelPayment = () => {
        setShowCancelConfirm(false)
        setShowPaymentModal(false)

        alert(`Transport request created successfully!\n\nWe will contact you shortly regarding your payment and measurement schedule.`)

        // Reset form
        setFormData({
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            serviceAddress: '',
            preferredDate: '',
            additionalNotes: '',
            transportFee: ''
        })
        setCreatedProject(null)
        isSuccessRef.current = false
    }

    const resumePayment = () => {
        setShowCancelConfirm(false)
    }

    return (
        <section className="min-h-screen bg-gray-50 py-16">
            <Helmet>
                <title>Measurement Transport Payment - Demargo Interior Contractors</title>
                <meta name="description" content="Pay for measurement transport service quickly and securely." />
            </Helmet>

            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="text-demargo-orange">Measurement</span>{' '}
                        <span className="text-demargo-blue">Transport Payment</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Fill out the form below to request measurement transport service and make payment securely.
                    </p>
                </div>

                {/* Success Notification */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-semibold">Payment successful! Your transport request has been received.</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Client Name */}
                        <div>
                            <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="clientEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="clientEmail"
                                name="clientEmail"
                                value={formData.clientEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="clientPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="clientPhone"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                placeholder="+233123456789"
                            />
                        </div>

                        {/* Service Address */}
                        <div>
                            <label htmlFor="serviceAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                                Service Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="serviceAddress"
                                name="serviceAddress"
                                value={formData.serviceAddress}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                placeholder="Enter the full address where measurement service is needed"
                            />
                        </div>

                        {/* Transport Fee */}
                        <div>
                            <label htmlFor="transportFee" className="block text-sm font-semibold text-gray-700 mb-2">
                                Transport Fee (GHS) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">GHS</span>
                                <input
                                    type="number"
                                    id="transportFee"
                                    name="transportFee"
                                    value={formData.transportFee}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    step="0.01"
                                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Fee varies based on your location. Please contact us if you're unsure of the amount.
                            </p>
                        </div>

                        {/* Preferred Date */}
                        <div>
                            <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Preferred Date (Optional)
                            </label>
                            <input
                                type="date"
                                id="preferredDate"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                            />
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label htmlFor="additionalNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                id="additionalNotes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                                placeholder="Any special instructions or requirements..."
                            />
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-demargo-orange to-demargo-blue text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? 'Processing...' : 'Submit & Pay Now'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            By submitting this form, you'll be redirected to secure payment via Paystack
                        </p>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-2">Need Help?</p>
                            <p>If you're unsure about the transport fee for your location, please contact us at:</p>
                            <p className="mt-2">
                                <strong>Phone:</strong> +233 54 647 8040<br />
                                <strong>Email:</strong> demargointerior@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && createdProject && (
                <PaymentModal
                    project={createdProject}
                    onClose={handlePaymentClose}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* Cancel Confirmation Dialog */}
            {showCancelConfirm && (
                <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-demargo-orange rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Payment?</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to cancel the payment? You can still pay later after we contact you.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmCancelPayment}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                                >
                                    YES
                                </button>
                                <button
                                    onClick={resumePayment}
                                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-demargo-orange to-demargo-blue text-white font-semibold hover:opacity-90 transition shadow-lg"
                                >
                                    NO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default TransportPayment
