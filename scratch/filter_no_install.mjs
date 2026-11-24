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
        const snap = await getDocs(collection(db, 'projects'));
        
        const noInstall = [];
        snap.docs.forEach(doc => {
            const d = doc.data();
            const instDate = d.installationDate ? String(d.installationDate).trim() : '';
            if (!instDate) {
                noInstall.push({
                    id: doc.id,
                    clientName: d.clientName || 'N/A',
                    clientPhone: d.clientPhone || 'N/A',
                    projectTitle: d.projectTitle || 'N/A',
                    status: d.status || 'N/A',
                    measurementDate: d.measurementDate || 'None',
                    createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString().split('T')[0] : String(d.createdAt).split('T')[0]) : 'N/A'
                });
            }
        });

        // Sort by createdAt descending
        noInstall.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

        console.log(`TOTAL_WITHOUT_INSTALL:${noInstall.length}`);
        
        // Group by status
        const byStatus = {};
        noInstall.forEach(p => {
            byStatus[p.status] = byStatus[p.status] || [];
            byStatus[p.status].push(p);
        });

        console.log('SUMMARY_BY_STATUS:', Object.keys(byStatus).map(k => `${k}: ${byStatus[k].length}`).join(', '));
        console.log('JSON_RESULT_START');
        console.log(JSON.stringify(noInstall, null, 2));
        console.log('JSON_RESULT_END');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
