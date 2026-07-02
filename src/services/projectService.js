import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
    arrayUnion,
    onSnapshot
} from 'firebase/firestore'
import { db, storage, isFirebaseConfigured, initFirebaseAuth } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const PROJECTS_COLLECTION = 'projects'
const PAYMENTS_COLLECTION = 'payments'

if (!isFirebaseConfigured) {
    console.warn('Firebase API key missing or set to placeholder. Running in Local Storage Mock mode.')
}

/* ==========================================================================
   LOCAL STORAGE MOCK DATABASE (For Development / Quick Start)
   ========================================================================== */

const defaultProjects = [
    {
        id: 'mock-proj-1',
        clientName: 'Kofi Mensah',
        clientEmail: 'kofi.mensah@example.com',
        clientPhone: '0241234567',
        projectTitle: 'Penthouse Curtains Installation',
        projectDescription: 'Premium motorized double-height curtains for the living room and sheers for bedrooms.',
        serviceAddress: 'Airport Residential Area, Accra',
        totalAmount: 18000,
        amountPaid: 0,
        balance: 18000,
        status: 'measurement',
        measurementDate: '2026-06-25T10:00',
        measurementNotes: 'Awaiting site visit to measure 4 living room windows (double height) and 3 bedroom windows.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        satisfaction: '',
        messages: []
    },
    {
        id: 'mock-proj-2',
        clientName: 'Ama Serwaa',
        clientEmail: 'ama.serwaa@example.com',
        clientPhone: '0247654321',
        projectTitle: 'Living Room Curtains & Blinds',
        projectDescription: 'Custom fabric curtains for the main lounge and wooden zebra blinds for the study room.',
        serviceAddress: 'East Legon, Accra',
        totalAmount: 8500,
        amountPaid: 0,
        balance: 8500,
        status: 'estimate',
        measurementDate: '2026-06-20T14:00',
        measurementNotes: 'Living room: 3 windows of 2.5m drop. Study: 2 windows of 1.8m drop.',
        estimateDetails: 'Living Room: GHS 5,500 (3 sets of heavy drapery + 3 sheers + tracks).\nStudy Room: GHS 3,000 (2 wooden zebra blinds + installation fee).',
        estimateApproved: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        satisfaction: '',
        messages: []
    },
    {
        id: 'mock-proj-3',
        clientName: 'Yaw Boateng',
        clientEmail: 'yaw.boateng@example.com',
        clientPhone: '0559876543',
        projectTitle: 'Executive Office Draperies',
        projectDescription: 'Aesthetic room divider curtains and blackout roller blinds for the main boardroom.',
        serviceAddress: 'Ridge, Accra',
        totalAmount: 12000,
        amountPaid: 3000,
        balance: 9000,
        status: 'fabric',
        measurementDate: '2026-06-18T09:00',
        measurementNotes: 'Boardroom windows: 5 large panels. Glass dividers: 1 heavy ceiling-track curtain.',
        estimateDetails: 'Boardroom Roller Blinds: GHS 7,000\nDivider Curtain: GHS 5,000',
        estimateApproved: true,
        selectedFabrics: 'Boardroom: Grey Blackout Blinds.\nDivider: Premium Beige Soundproof Wool.',
        fabricSelectionNotes: 'Client selected fabrics on 2026-06-22. Sewing requires 60% deposit (GHS 7,200). Paid GHS 3,000 so far.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        satisfaction: '',
        messages: []
    },
    {
        id: 'mock-proj-4',
        clientName: 'Abena Osei',
        clientEmail: 'abena.osei@example.com',
        clientPhone: '0201112222',
        projectTitle: 'Villa Curtains & Rods Upgrade',
        projectDescription: 'High-end velvet curtains for the master suite and linen drapery for the dining area.',
        serviceAddress: 'Spintex Road, Accra',
        totalAmount: 22000,
        amountPaid: 14000,
        balance: 8000,
        status: 'production',
        measurementDate: '2026-06-15T11:00',
        measurementNotes: 'Master Bedroom: 4 windows, 3m drop. Dining Room: 2 windows, 2.8m drop.',
        estimateDetails: 'Master suite velvet drapery: GHS 14,000\nDining room linen curtains: GHS 8,000',
        estimateApproved: true,
        selectedFabrics: 'Master: Royal Blue Velvet (Code: BL-V-02).\nDining: Off-White Linen (Code: LN-OW-09).',
        fabricSelectionNotes: 'Approved fabrics. Client paid 60%+ deposit of GHS 14,000.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        satisfaction: '',
        feedbackRemarks: '',
        messages: []
    },
    {
        id: 'mock-proj-5',
        clientName: 'Kwame Asante',
        clientEmail: 'kwame.asante@example.com',
        clientPhone: '0503334444',
        projectTitle: 'Apartment Blackout Blinds',
        projectDescription: 'Blackout roller curtains and sheers for a 3-bedroom apartment.',
        serviceAddress: 'Cantonments, Accra',
        totalAmount: 15000,
        amountPaid: 9000,
        balance: 6000,
        status: 'installation',
        measurementDate: '2026-06-10T15:00',
        measurementNotes: '3 Bedrooms, total 6 windows.',
        estimateDetails: 'Premium Blackout Blinds: GHS 9,500\nSheer Curtains & tracks: GHS 5,500',
        estimateApproved: true,
        selectedFabrics: 'Bedrooms: Dark Charcoal Blackout Roller blinds.',
        fabricSelectionNotes: 'All materials purchased and sewn.',
        installationDate: '2026-06-26T09:00',
        installationNotes: 'Drapery sewn and packed. Installation team scheduled for Friday morning.',
        satisfaction: '',
        messages: [],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
]

const defaultPayments = [
    {
        id: 'mock-pay-1',
        projectId: 'mock-proj-3',
        amount: 3000,
        reference: 'PAY-MOCK-101',
        status: 'success',
        paymentMethod: 'paystack',
        clientEmail: 'yaw.boateng@example.com',
        clientName: 'Yaw Boateng',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mock-pay-2',
        projectId: 'mock-proj-4',
        amount: 14000,
        reference: 'PAY-MOCK-102',
        status: 'success',
        paymentMethod: 'bank_transfer',
        clientEmail: 'abena.osei@example.com',
        clientName: 'Abena Osei',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mock-pay-3',
        projectId: 'mock-proj-5',
        amount: 9000,
        reference: 'PAY-MOCK-103',
        status: 'success',
        paymentMethod: 'mobile_money',
        clientEmail: 'kwame.asante@example.com',
        clientName: 'Kwame Asante',
        paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
]

const getMockData = (key, defaults) => {
    const data = localStorage.getItem(key)
    if (!data) {
        localStorage.setItem(key, JSON.stringify(defaults))
        return defaults
    }
    return JSON.parse(data)
}

const saveMockData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

const mockCreateProject = async (projectData) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const newId = `mock-proj-${Date.now()}`
    const newProject = {
        id: newId,
        ...projectData,
        status: projectData.status || 'measurement',
        amountPaid: 0,
        balance: Number(projectData.totalAmount) || 0,
        satisfaction: projectData.satisfaction || '',
        feedbackRemarks: projectData.feedbackRemarks || '',
        messages: projectData.messages || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    projects.push(newProject)
    saveMockData('demargo_mock_projects', projects)
    return newId
}

const mockGetProjectById = async (projectId) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const project = projects.find(p => p.id === projectId)
    if (!project) throw new Error('Project not found')
    return { ...project }
}

const mockGetProjectsByEmail = async (email) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    return projects.filter(p => p.clientEmail === email.toLowerCase())
}

const mockGetProjectsByPhone = async (phone) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    // Trim spaces and filter
    const searchPhone = phone.trim()
    return projects.filter(p => p.clientPhone.replace(/\s+/g, '') === searchPhone.replace(/\s+/g, '') || p.clientPhone.includes(searchPhone))
}

const mockUpdateProjectPayment = async (projectId, paymentAmount) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) throw new Error('Project not found')
    
    const project = projects[idx]
    const newAmountPaid = (project.amountPaid || 0) + paymentAmount
    const newBalance = Math.max(0, (project.totalAmount || 0) - newAmountPaid)
    
    // Auto-update status if fully paid (or handle custom transitions)
    let newStatus = project.status
    if (newBalance <= 0) {
        newStatus = 'completed'
    }
    
    projects[idx] = {
        ...project,
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newStatus,
        updatedAt: new Date().toISOString()
    }
    saveMockData('demargo_mock_projects', projects)
}

const mockRecordPayment = async (paymentData) => {
    const payments = getMockData('demargo_mock_payments', defaultPayments)
    const newId = `mock-pay-${Date.now()}`
    const newPayment = {
        id: newId,
        ...paymentData,
        createdAt: new Date().toISOString()
    }
    payments.push(newPayment)
    saveMockData('demargo_mock_payments', payments)
    return newId
}

const mockGetProjectPayments = async (projectId) => {
    const payments = getMockData('demargo_mock_payments', defaultPayments)
    return payments.filter(p => p.projectId === projectId)
}

const mockGetAllProjects = async () => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    // Sort by createdAt descending
    return [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const mockUpdateProject = async (projectId, updatedData) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) throw new Error('Project not found')
    
    // Recalculate balance if totalAmount is changing
    let extra = {}
    if ('totalAmount' in updatedData) {
        const total = Number(updatedData.totalAmount) || 0
        const paid = Number(projects[idx].amountPaid) || 0
        extra.balance = Math.max(0, total - paid)
    }

    projects[idx] = {
        ...projects[idx],
        ...updatedData,
        ...extra,
        updatedAt: new Date().toISOString()
    }
    saveMockData('demargo_mock_projects', projects)
}

const normalizeMessage = (message) => ({
    ...message,
    readByClient: message.sender === 'admin' ? false : true,
    readByAdmin: message.sender === 'client' ? false : true
})

const mockAddProjectMessage = async (projectId, message) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) throw new Error('Project not found')

    const project = projects[idx]
    const newMessages = [...(project.messages || []), normalizeMessage(message)]
    projects[idx] = {
        ...project,
        messages: newMessages,
        updatedAt: new Date().toISOString()
    }
    saveMockData('demargo_mock_projects', projects)
}

const mockUpdateProjectMessages = async (projectId, messages) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) throw new Error('Project not found')
    projects[idx] = {
        ...projects[idx],
        messages: messages.map((msg) => ({
            ...msg,
            readByClient: msg.sender === 'admin' ? Boolean(msg.readByClient) : true,
            readByAdmin: msg.sender === 'client' ? Boolean(msg.readByAdmin) : true
        })),
        updatedAt: new Date().toISOString()
    }
    saveMockData('demargo_mock_projects', projects)
}

const mockDeleteProject = async (projectId) => {
    const projects = getMockData('demargo_mock_projects', defaultProjects)
    const filtered = projects.filter(p => p.id !== projectId)
    saveMockData('demargo_mock_projects', filtered)
}


/* ==========================================================================
   FIRESTORE DB SERVICE (For Production Cloud database)
   ========================================================================== */

/**
 * Create a new project in Firestore
 * @param {Object} projectData - Project information
 * @returns {Promise<string>} - Created project ID
 */
export const createProject = async (projectData) => {
    if (!isFirebaseConfigured) {
        return mockCreateProject(projectData)
    }

    await initFirebaseAuth()

    try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
            ...projectData,
            status: projectData.status || 'measurement',
            amountPaid: 0,
            balance: Number(projectData.totalAmount) || 0,
            satisfaction: projectData.satisfaction || '',
            feedbackRemarks: projectData.feedbackRemarks || '',
            messages: projectData.messages || [],
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
    if (!isFirebaseConfigured) {
        return mockGetProjectById(projectId)
    }
    await initFirebaseAuth()
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

export const subscribeToProject = (projectId, onProjectUpdate) => {
    if (!isFirebaseConfigured) {
        const storageListener = (event) => {
            if (event.key !== 'demargo_mock_projects' || !event.newValue) return
            try {
                const projects = JSON.parse(event.newValue)
                const project = projects.find(p => p.id === projectId)
                if (project) {
                    onProjectUpdate({ ...project })
                }
            } catch (err) {
                console.error('Error parsing mock project storage update:', err)
            }
        }
        window.addEventListener('storage', storageListener)
        return () => window.removeEventListener('storage', storageListener)
    }

    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
        if (!snapshot.exists()) return
        onProjectUpdate({ id: snapshot.id, ...snapshot.data() })
    }, (err) => {
        console.error('Error subscribing to project snapshot:', err)
    })
    return unsubscribe
}

/**
 * Search projects by client email
 * @param {string} email - Client email
 * @returns {Promise<Array>} - Array of projects
 */
export const getProjectsByEmail = async (email) => {
    if (!isFirebaseConfigured) {
        return mockGetProjectsByEmail(email)
    }
    await initFirebaseAuth()
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
    if (!isFirebaseConfigured) {
        return mockGetProjectsByPhone(phone)
    }
    await initFirebaseAuth()
    try {
        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where('clientPhone', '==', phone.trim())
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
    if (!isFirebaseConfigured) {
        return mockUpdateProjectPayment(projectId, paymentAmount)
    }
    await initFirebaseAuth()
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
            throw new Error('Project not found')
        }

        const projectData = projectSnap.data()
        const newAmountPaid = (projectData.amountPaid || 0) + paymentAmount
        const newBalance = Math.max(0, (projectData.totalAmount || 0) - newAmountPaid)

        // Update project status if fully paid
        let newStatus = projectData.status
        if (newBalance <= 0) {
            newStatus = 'completed'
        }

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
    if (!isFirebaseConfigured) {
        return mockRecordPayment(paymentData)
    }
    await initFirebaseAuth()
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
    if (!isFirebaseConfigured) {
        return mockGetProjectPayments(projectId)
    }
    await initFirebaseAuth()
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

/**
 * Get all projects ordered by creation date
 * @returns {Promise<Array>} - Array of projects
 */
export const getAllProjects = async () => {
    if (!isFirebaseConfigured) {
        return mockGetAllProjects()
    }
    await initFirebaseAuth()
    try {
        const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        const projects = []
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() })
        })
        return projects
    } catch (error) {
        console.error('Error getting all projects:', error)
        throw error
    }
}

/**
 * Update project details
 * @param {string} projectId - Project ID
 * @param {Object} updatedData - Updated project properties
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, updatedData) => {
    if (!isFirebaseConfigured) {
        return mockUpdateProject(projectId, updatedData)
    }
    await initFirebaseAuth()
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        const projectSnap = await getDoc(projectRef)
        if (!projectSnap.exists()) {
            throw new Error('Project not found')
        }
        
        let extra = {}
        if ('totalAmount' in updatedData) {
            const total = Number(updatedData.totalAmount) || 0
            const paid = Number(projectSnap.data().amountPaid) || 0
            extra.balance = Math.max(0, total - paid)
        }

        await updateDoc(projectRef, {
            ...updatedData,
            ...extra,
            updatedAt: serverTimestamp()
        })
    } catch (error) {
        console.error('Error updating project:', error)
        throw error
    }
}

/**
 * Delete project
 * @param {string} projectId - Project ID
 * @returns {Promise<void>}
 */
export const addProjectMessage = async (projectId, message) => {
    const normalizedMessage = normalizeMessage(message)
    if (!isFirebaseConfigured) {
        return mockAddProjectMessage(projectId, normalizedMessage)
    }
    await initFirebaseAuth()
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        await updateDoc(projectRef, {
            messages: arrayUnion(normalizedMessage),
            updatedAt: serverTimestamp()
        })
    } catch (error) {
        console.error('Error adding project message:', error)
        throw error
    }
}

export const updateProjectMessages = async (projectId, messages) => {
    if (!isFirebaseConfigured) {
        return mockUpdateProjectMessages(projectId, messages)
    }
    await initFirebaseAuth()
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        await updateDoc(projectRef, {
            messages: messages.map((msg) => ({
                ...msg,
                readByClient: msg.sender === 'admin' ? Boolean(msg.readByClient) : true,
                readByAdmin: msg.sender === 'client' ? Boolean(msg.readByAdmin) : true
            })),
            updatedAt: serverTimestamp()
        })
    } catch (error) {
        console.error('Error updating project messages:', error)
        throw error
    }
}

export const deleteProject = async (projectId) => {
    if (!isFirebaseConfigured) {
        return mockDeleteProject(projectId)
    }
    await initFirebaseAuth()
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
        await deleteDoc(projectRef)
    } catch (error) {
        console.error('Error deleting project:', error)
        throw error
    }
}

/**
 * Upload a file to Firebase Storage (with local base64 fallback)
 * @param {string} path - Storage path
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Download URL or base64 data URL
 */
export const uploadFile = async (path, file) => {
    if (!isFirebaseConfigured) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = (err) => reject(err)
            reader.readAsDataURL(file)
        })
    }
    await initFirebaseAuth()
    try {
        const storageRef = ref(storage, path)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        return downloadURL
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}

/**
 * Approve a client-submitted pending payment
 * @param {string} projectId - Project ID
 * @param {string} paymentId - Payment ID
 * @param {number} amount - Payment amount
 * @returns {Promise<void>}
 */
export const approvePayment = async (projectId, paymentId, amount) => {
    if (!isFirebaseConfigured) {
        // Local storage mock mode
        const payments = getMockData('demargo_mock_payments', defaultPayments)
        const pIdx = payments.findIndex(p => p.id === paymentId)
        if (pIdx !== -1) {
            payments[pIdx].status = 'success'
            saveMockData('demargo_mock_payments', payments)
        }
        await mockUpdateProjectPayment(projectId, amount)
        return
    }

    await initFirebaseAuth()
    try {
        // Update payment status to success
        const paymentRef = doc(db, PAYMENTS_COLLECTION, paymentId)
        await updateDoc(paymentRef, {
            status: 'success',
            updatedAt: serverTimestamp()
        })

        // Update project amountPaid and balance
        await updateProjectPayment(projectId, amount)
    } catch (error) {
        console.error('Error approving payment:', error)
        throw error
    }
}


