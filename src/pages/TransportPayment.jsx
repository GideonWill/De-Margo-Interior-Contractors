import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { createProject, recordPayment, updateProjectPayment, updateProject } from '../services/projectService'

/**
 * TransportPayment Component
 * Self-service form for measurement transport payment
 * Allows clients to submit details and record payment via cash, mobile money, or bank transfer.
 */
function TransportPayment() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceAddress: '',
        preferredDate: '',
        additionalNotes: '',
        transportFee: ''
    })
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const fee = parseFloat(formData.transportFee)
            if (isNaN(fee) || fee <= 0) {
                throw new Error('Please enter a valid transport fee amount')
            }
            // Create project record
            const projectData = {
                clientName: formData.clientName.trim(),
                clientEmail: formData.clientEmail.trim().toLowerCase(),
                clientPhone: formData.clientPhone.trim(),
                projectTitle: 'Measurement Transport Service',
                projectDescription: `Service Address: ${formData.serviceAddress}${formData.preferredDate ? `\nPreferred Date: ${formData.preferredDate}` : ''}${formData.additionalNotes ? `\nNotes: ${formData.additionalNotes}` : ''}`,
                totalAmount: fee,
                status: 'approved' // Auto‑approved since payment will be recorded immediately
            }
            const projectId = await createProject(projectData)
            // Record payment manually (no Paystack)
            await recordPayment({
                projectId,
                amount: fee,
                reference: `MANUAL-${Date.now()}`,
                status: 'success',
                paymentMethod: paymentMethod,
                clientEmail: projectData.clientEmail,
                clientName: projectData.clientName,
                paidAt: new Date().toISOString()
            })
            // Update project payment info (balance becomes 0)
            await updateProjectPayment(projectId, fee)
            // Show success UI then redirect
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                navigate('/')
            }, 3000)
        } catch (err) {
            console.error('Error processing transport payment:', err)
            setError(err.message || 'Failed to process request. Please try again.')
        } finally {
            setLoading(false)
        }
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
                        Fill out the form below to request measurement transport service and record your payment.
                    </p>
                </div>

                {/* Success Notification */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <p className="font-semibold">Payment recorded successfully! Redirecting...</p>
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
                                Fee varies based on your location. Contact us if unsure.
                            </p>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-demargo-orange focus:border-transparent"
                            >
                                <option value="cash">Cash (Office)</option>
                                <option value="mobile_money">MTN Mobile Money</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
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
                                    <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                            {loading ? 'Processing...' : 'Submit & Record Payment'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default TransportPayment
