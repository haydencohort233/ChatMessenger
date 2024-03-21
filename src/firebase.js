import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA_9CyAiUTu1UO02mjAnej3TuGuxzxN7i0",
  authDomain: "redomessenger.firebaseapp.com",
  projectId: "redomessenger",
  storageBucket: "redomessenger.appspot.com",
  messagingSenderId: "419562512497",
  appId: "1:419562512497:web:4f8966edd912ac41c5bbd0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage, firebaseConfig };