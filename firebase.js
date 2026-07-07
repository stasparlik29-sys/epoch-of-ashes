const firebaseConfig = {
  apiKey: "AIzaSyADJg1m2L5AgemtSNr1u3ZHbsPQ6SLMvbI",
  authDomain: "epoch-of-ashes.firebaseapp.com",
  projectId: "epoch-of-ashes",
  storageBucket: "epoch-of-ashes.firebasestorage.app",
  messagingSenderId: "643542990904",
  appId: "1:643542990904:web:1f2790f4dc58f4772c3467",
  measurementId: "G-7LJVQXRZ44"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

console.log("Firebase подключен");