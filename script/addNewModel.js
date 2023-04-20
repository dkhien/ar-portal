// import firebase from 'firebase/compat/app';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxag9sUnLJlx0jdH4gH5Lw98wjD1OI6Ww",
  authDomain: "portal-fad1c.firebaseapp.com",
  databaseURL:
    "https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-fad1c",
  storageBucket: "portal-fad1c.appspot.com",
  messagingSenderId: "366187279512",
  appId: "1:366187279512:web:cdfaca11ead46624d0cced",
  measurementId: "G-KXVB9X45VB",
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
  const markerRef = ref(
    storage,
    `markers/${name}_${Date.now()}_${markerFile.name}`
  );
  const modelRef = ref(
    storage,
    `models/${name}_${Date.now()}_${modelFile.name}`
  );
  const markerInput = document.querySelector('input[name="marker"]');
  const markerProgressBar =
    markerInput.parentElement.querySelector(".progress");
  const modelInput = document.querySelector('input[name="model"]');
  const modelProgressBar = modelInput.parentElement.querySelector(".progress");
  const markerUploadTask = uploadBytesResumable(markerRef, markerFile);
  const modelUploadTask = uploadBytesResumable(modelRef, modelFile);
  let markerURL, modelURL;
  
  markerUploadTask.on(
    "state_changed",
    (snapshot) => {
      markerProgressBar.parentElement.style.display = "block";
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      markerProgressBar.style.width = `${progress}%`;
    },
    (error) => {
      console.error(error);
      alert("Failed to upload marker file");
    },
    () => {
      getDownloadURL(markerUploadTask.snapshot.ref).then((downloadURL) => {
        console.log("Marker available at", downloadURL);
        markerURL = downloadURL;
        if (markerURL && modelURL) {
          updateFormData();
        }
      });
    }
  );
  
  modelUploadTask.on(
    "state_changed",
    (snapshot) => {
      modelProgressBar.parentElement.style.display = "block";
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      modelProgressBar.style.width = `${progress}%`;
    },
    (error) => {
      console.error(error);
      alert("Failed to upload model file");
    },
    () => {
      getDownloadURL(modelUploadTask.snapshot.ref).then((downloadURL) => {
        console.log("Model available at", downloadURL);
        modelURL = downloadURL;
        if (markerURL && modelURL) {
          updateFormData();
        }
      });
    }
  );
  
  function updateFormData() {
    console.log("Object added to database successfully");
    alert("Object added to database successfully");
  
    // Update the formData object with the file download URLs
    const formData = {
      name: name,
      description: description,
      marker: markerURL,
      model: modelURL,
    };
  
      // Post the formData object to Firebase Realtime Database
  fetch(
    "https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app/models.json",
    {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  }
  


});
