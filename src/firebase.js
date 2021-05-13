// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDQw6f5l11GhQjZDumcsTYNXQFTGqqp6Bg",
  authDomain: "bhrammanbeta.firebaseapp.com",
  databaseURL: "https://bhrammanbeta.firebaseio.com",
  projectId: "bhrammanbeta",
  storageBucket: "bhrammanbeta.appspot.com",
  messagingSenderId: "1044329996199",
  appId: "1:1044329996199:web:3ab13322150dc2dc99a082",
  measurementId: "G-GHEJLLZ1QL",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

var storageRef = firebase.storage().ref();

export { auth, provider, db, storageRef };