import firebase from 'firebase';
import 'firebase/storage'; 

// const firebaseConfig = {
//     apiKey: "AIzaSyA4GEt1FJqHIAaqO6eehP6RFwwqbkphgN0",
//     authDomain: "translatetools-e279d.firebaseapp.com",
//     projectId: "translatetools-e279d",
//     storageBucket: "translatetools-e279d.appspot.com",
//     messagingSenderId: "277158490730",
//     appId: "1:277158490730:web:02f99f8bc7d028c6921013",
//     measurementId: "G-GS149LSJE3"
// };

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();
const now = firebase.firestore.Timestamp.now();
export { fire, auth, storage, db, now };

export default fire;