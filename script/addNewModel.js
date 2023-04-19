// import firebase from 'firebase/compat/app';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxag9sUnLJlx0jdH4gH5Lw98wjD1OI6Ww",
  authDomain: "portal-fad1c.firebaseapp.com",
  databaseURL: "https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-fad1c",
  storageBucket: "portal-fad1c.appspot.com",
  messagingSenderId: "366187279512",
  appId: "1:366187279512:web:cdfaca11ead46624d0cced",
  measurementId: "G-KXVB9X45VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const form = document.getElementById("addModelForm");
const submitInput = document.getElementById("submitInput");
submitInput.addEventListener("click", async (event) => {
  event.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const description = document.querySelector('textarea[name="desc"]').value;
  const markerFile = document.querySelector('input[name="marker"]').files[0];
  const modelFile = document.querySelector('input[name="model"]').files[0];

  // Upload marker and model files to Firebase Storage and get their download URLs
  const storage = getStorage();
  const markerRef = ref(storage,`markers/${name}_${Date.now()}_${markerFile.name}`);
  const modelRef = ref(storage,`models/${name}_${Date.now()}_${modelFile.name}`);

  const [markerSnapshot, modelSnapshot] = await Promise.all([
    uploadBytesResumable(markerRef, markerFile),
    uploadBytesResumable(modelRef, modelFile)
  ]);

  const [markerURL, modelURL] = await Promise.all([
    getDownloadURL(markerSnapshot.ref),
    getDownloadURL(modelSnapshot.ref)
  ]);

  // Update the formData object with the file download URLs
  const formData = {
    name: name,
    description: description,
    marker: markerURL,
    model: modelURL
  };

  // Post the formData object to Firebase Realtime Database
  fetch("https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app/models.json", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  });
});



  
