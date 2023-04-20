// import firebase from 'firebase/compat/app';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getStorage, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
import {ref as storageRef} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

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
        modelURL.setAttribute("href", objectData.marker);
        modelURL.innerHTML = "Current model"
        nameInput.value = objectData.name;
        descriptionInput.value = objectData.description;
        markerLabel.appendChild(markerURL);
        modelLabel.appendChild(modelURL); 

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
        
          if(markerFile!=undefined){
            const markerRef = storageRef(storage,`markers/${name}_${Date.now()}_${markerFile.name}`);
            const uploadTask = uploadBytesResumable(markerRef, markerFile);
            const markerSnapshot = await uploadTask;
            markerURL.href = await getDownloadURL(markerSnapshot.ref);
            console.log("Marker URL: ", markerURL.href);
          }
          
          if (modelFile != undefined) {
            const modelRef = storageRef(storage, `models/${name}_${Date.now()}_${modelFile.name}`);
            const uploadTask = uploadBytesResumable(modelRef, modelFile);
            const modelSnapshot = await uploadTask;
            modelURL.href = await getDownloadURL(modelSnapshot.ref);
            console.log("Model URL: ", modelURL.href);
          }
          
          set(objectRef, {
            name: name,
            description: description,
            marker: markerURL.getAttribute("href"),
            model: modelURL.getAttribute("href")
          })
        
        });
    } else {
      console.log("Object not found");
    }
  }).catch((error) => {
    console.error(error);
  });
  



// const submitInput = document.getElementById("submitInput");
// submitInput.addEventListener("click", async (event) => {
//   event.preventDefault();

//   const name = document.querySelector('input[name="name"]').value;
//   const description = document.querySelector('textarea[name="desc"]').value;
//   const markerFile = document.querySelector('input[name="marker"]').files[0];
//   const modelFile = document.querySelector('input[name="model"]').files[0];

//   // Upload marker and model files to Firebase Storage and get their download URLs
//   const storage = getStorage();
//   const markerRef = ref(storage,`markers/${name}_${Date.now()}_${markerFile.name}`);
//   const modelRef = ref(storage,`models/${name}_${Date.now()}_${modelFile.name}`);

//   const [markerSnapshot, modelSnapshot] = await Promise.all([
//     uploadBytesResumable(markerRef, markerFile),
//     uploadBytesResumable(modelRef, modelFile)
//   ]);

//   const [markerURL, modelURL] = await Promise.all([
//     getDownloadURL(markerSnapshot.ref),
//     getDownloadURL(modelSnapshot.ref)
//   ]);

//   // Update the formData object with the file download URLs
//   const formData = {
//     name: name,
//     description: description,
//     marker: markerURL,
//     model: modelURL
//   };

//   // Post the formData object to Firebase Realtime Database
//   fetch("https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app/models.json", {
//     method: "POST",
//     body: JSON.stringify(formData),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   });
// });



  
