import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

const PROJECTS_COLLECTION = 'projects'
const PAYMENTS_COLLECTION = 'payments'

/**
 * Project Service - Handles all project-related Firestore operations
 */

/**
 * Create a new project in Firestore
 * @param {Object} projectData - Project information
 * @returns {Promise<string>} - Created project ID
 */
export const createProject = async (projectData) => {
    try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
            ...projectData,
            status: projectData.status || 'pending',
            amountPaid: 0,
            balance: projectData.totalAmount,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
        return docRef.id
    } catch (error) {
        console.error('Error creating project:', error)
        throw error
    }
}

/**
 * Get project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Project data
 */
export const getProjectById = async (projectId) => {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, projectId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() }
        } else {
            throw new Error('Project not found')
        }
    } catch (error) {
        console.error('Error getting project:', error)
        throw error
    }
}

/**
 * Search projects by client email
 * @param {string} email - Client email
 * @returns {Promise<Array>} - Array of projects
 */
export const getProjectsByEmail = async (email) => {
    try {
        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where('clientEmail', '==', email.toLowerCase())
        )
        const querySnapshot = await getDocs(q)
        const projects = []
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() })
        })
        return projects
    } catch (error) {
        console.error('Error getting projects by email:', error)
        throw error
    }
}

/**
 * Search projects by client phone
 * @param {string} phone - Client phone number
 * @returns {Promise<Array>} - Array of projects
 */
export const getProjectsByPhone = async (phone) => {
    try {
        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where('clientPhone', '==', phone)
        )
        const querySnapshot = await getDocs(q)
        const projects = []
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() })
        })
        return projects
    } catch (error) {
        console.error('Error getting projects by phone:', error)
        throw error
    }
}

/**
 * Update project payment information
 * @param {string} projectId - Project ID
 * @param {number} paymentAmount - Amount paid
 * @returns {Promise<void>}
 */
export const updateProjectPayment = async (projectId, paymentAmount) => {
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
            throw new Error('Project not found')
        }

        const projectData = projectSnap.data()
        const newAmountPaid = (projectData.amountPaid || 0) + paymentAmount
        const newBalance = projectData.totalAmount - newAmountPaid

        // Update project status if fully paid
        const newStatus = newBalance <= 0 ? 'paid' : projectData.status

        await updateDoc(projectRef, {
            amountPaid: newAmountPaid,
            balance: newBalance,
            status: newStatus,
            updatedAt: serverTimestamp()
        })
    } catch (error) {
        console.error('Error updating project payment:', error)
        throw error
    }
}

/**
 * Record a payment transaction
 * @param {Object} paymentData - Payment information
 * @returns {Promise<string>} - Payment ID
 */
export const recordPayment = async (paymentData) => {
    try {
        const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), {
            ...paymentData,
            createdAt: serverTimestamp()
        })
        return docRef.id
    } catch (error) {
        console.error('Error recording payment:', error)
        throw error
    }
}

/**
 * Get all payments for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} - Array of payments
 */
export const getProjectPayments = async (projectId) => {
    try {
        const q = query(
            collection(db, PAYMENTS_COLLECTION),
            where('projectId', '==', projectId)
        )
        const querySnapshot = await getDocs(q)
        const payments = []
        querySnapshot.forEach((doc) => {
            payments.push({ id: doc.id, ...doc.data() })
        })
        return payments
    } catch (error) {
        console.error('Error getting project payments:', error)
        throw error
    }
}
