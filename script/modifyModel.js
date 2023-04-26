// import firebase from 'firebase/compat/app';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getStorage, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
import { ref as storageRef } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

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


const urlParams = new URLSearchParams(window.location.search);
const objectId = urlParams.get('objectId');
console.log(objectId);
const db = getDatabase();
const objectRef = ref(db, 'models/' + objectId);
let objectData = {};
get(objectRef).then((snapshot) => {
  if (snapshot.exists()) {
    objectData = snapshot.val();
    console.log(objectData);
    // Prefill object data
    const nameInput = document.querySelector('input[name="name"]');
    const descriptionInput = document.querySelector('textarea[name="desc"]');
    const markerFileInput = document.querySelector('input[name="marker"]');
    const modelFileInput = document.querySelector('input[name="model"]');
    const markerLabel = document.getElementById("currentMarker");
    const modelLabel = document.getElementById("currentModel");
    let markerURL = document.createElement("a");
    markerURL.setAttribute("href", objectData.marker);
    markerURL.innerHTML = "Current marker"
    let modelURL = document.createElement("a");
    modelURL.setAttribute("href", objectData.model);
    modelURL.innerHTML = "Current model"
    nameInput.value = objectData.name;
    descriptionInput.value = objectData.description;
    markerLabel.appendChild(markerURL);
    modelLabel.appendChild(modelURL);
    const markerInput = document.querySelector('input[name="marker"]');
    const markerProgressBar =
      markerInput.parentElement.querySelector(".progress");
    const modelInput = document.querySelector('input[name="model"]');
    const modelProgressBar = modelInput.parentElement.querySelector(".progress");
    //Modify
    const submitInput = document.getElementById("submitInput");

    submitInput.addEventListener("click", async (event) => {
      event.preventDefault();

      let name = nameInput.value;
      let description = descriptionInput.value;

      let markerFile = markerFileInput.files[0];
      let modelFile = modelFileInput.files[0];

      // Upload marker and model files to Firebase Storage and get their download URLs
      const storage = getStorage();
      let markerUploadTask, modelUploadTask;
      const uploadTasks = [];

      if (markerFile != undefined) {
        const markerRef = storageRef(storage, `markers/${name}_${Date.now()}_${markerFile.name}`);
        markerUploadTask = uploadBytesResumable(markerRef, markerFile);
        uploadTasks.push(new Promise((resolve, reject) => {
          markerUploadTask.on(
            "state_changed",
            (snapshot) => {
              markerProgressBar.parentElement.style.display = "block";
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              markerProgressBar.style.width = `${progress}%`;
            },
            (error) => {
              console.error(error);
              reject(new Error("Failed to upload marker file"));
            },
            () => {
              getDownloadURL(markerUploadTask.snapshot.ref).then((downloadURL) => {
                console.log("Marker available at", downloadURL);
                markerURL.href = downloadURL;
                resolve(downloadURL);
              });
            }
          );
        }));

      }

      if (modelFile != undefined) {
        const modelRef = storageRef(storage, `models/${name}_${Date.now()}_${modelFile.name}`);
        modelUploadTask = uploadBytesResumable(modelRef, modelFile);
        uploadTasks.push(new Promise((resolve, reject) => {
          modelUploadTask.on(
            "state_changed",
            (snapshot) => {
              modelProgressBar.parentElement.style.display = "block";
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              modelProgressBar.style.width = `${progress}%`;
            },
            (error) => {
              console.error(error);
              reject(new Error("Failed to upload model file"));
            },
            () => {
              getDownloadURL(modelUploadTask.snapshot.ref).then((downloadURL) => {
                console.log("Model available at", downloadURL);
                modelURL.href = downloadURL;
                resolve(downloadURL);
              });
            }
          );
        }));
      }

      Promise.all(uploadTasks).then(([markerDownloadURL, modelDownloadURL]) => {

        set(objectRef, {
          name: name,
          description: description,
          marker: markerURL.getAttribute("href"),
          model: modelURL.getAttribute("href"),
          id: objectData.id
        }).then(() => {
          alert("Modified object successfully");
          console.log("Data saved successfully");
        }).catch((error) => {
          console.error(error);
          alert("Failed to save object data");
        });

      })
    })
  }

  else {
    alert("Object not found");
    console.log("Object not found");
  }

  fetch("http://localhost:3000/delete",
    {
      method: "POST",
      body: JSON.stringify(objectData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  

}).catch((error) => {
  console.log(error);
})