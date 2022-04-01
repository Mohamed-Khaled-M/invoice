import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCyvTcvgIa1P_3WNYNX-ID0KSGrKyvokog',
  authDomain: 'invoice-app-3e148.firebaseapp.com',
  projectId: 'invoice-app-3e148',
  storageBucket: 'invoice-app-3e148.appspot.com',
  messagingSenderId: '17383562080',
  appId: '1:17383562080:web:158154eac61b9432cddc05',
};

const firebaseApp = initializeApp(firebaseConfig);

export default getFirestore(firebaseApp);
