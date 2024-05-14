// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCBJ4BQ1H7zzpAuJBRvF6AS0xTkfoBuVdA',
  authDomain: 'teleport-419609.firebaseapp.com',
  projectId: 'teleport-419609',
  storageBucket: 'teleport-419609.appspot.com',
  messagingSenderId: '872236454588',
  appId: '1:872236454588:web:edbf7b16c065911fb5f6b9',
  measurementId: 'G-04DDD2PZXN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
