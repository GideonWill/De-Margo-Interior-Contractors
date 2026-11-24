import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

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
    try {
        await signInAnonymously(auth);
        console.log('Auth success');
        const snap = await getDocs(collection(db, 'projects'));
        console.log(`TOTAL_COUNT:${snap.docs.length}`);
        const list = [];
        snap.docs.forEach(doc => {
            const d = doc.data();
            list.push({
                id: doc.id,
                clientName: d.clientName || 'N/A',
                clientPhone: d.clientPhone || 'N/A',
                projectTitle: d.projectTitle || 'N/A',
                status: d.status || 'N/A',
                measurementDate: d.measurementDate || null,
                installationDate: d.installationDate || null,
                createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : null
            });
        });

        console.log('ALL_PROJECTS_START');
        console.log(JSON.stringify(list, null, 2));
        console.log('ALL_PROJECTS_END');
    } catch (err) {
        console.error('FAILED:', err);
    }
}

run();
