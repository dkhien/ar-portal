import { getDatabase, ref, remove, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";

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
const db = getDatabase();

const modelList = [];
fetch('https://portal-fad1c-default-rtdb.asia-southeast1.firebasedatabase.app/models.json')
  .then(response => response.json())
  .then(data => {
    // `data` variable now contains the parsed JSON response from the API
    for (let objectId in data) {
      let objectData = data[objectId];
      let description = objectData["description"];
      let marker = objectData["marker"];
      let model = objectData["model"];
      let name = objectData["name"];
      let modelInfo = {
        id: objectId,
        description: description,
        marker: marker,
        model: model,
        name: name
      };
      modelList.push(modelInfo);
      console.log(modelInfo);
    }

    const modelTableBody = document.getElementById("modelTableBody");
    modelTableBody.innerHTML = "";

    for (let i = 0; i < modelList.length; i++) {
      let row = document.createElement("tr");
      let idCell = document.createElement("td");
      let nameCell = document.createElement("td");
      let descCell = document.createElement("td");
      let markerCell = document.createElement("td");
      let modelCell = document.createElement("td");
      let markerLink = document.createElement("a");
      let modelLink = document.createElement("a");
      let editButtonCell = document.createElement("td");
      let deleteButtonCell = document.createElement("td");
      markerLink.setAttribute("href", modelList[i].model);
      modelLink.setAttribute("href", modelList[i].marker);
      markerLink.innerHTML = "Link";
      modelLink.innerHTML = "Link";
      idCell.innerHTML = i + 1;
      nameCell.innerHTML = modelList[i].name;
      descCell.innerHTML = modelList[i].description;

      // Edit button
      let editButton = document.createElement("a");
      editButton.setAttribute("href", `modifyModel.html?objectId=${modelList[i].id}`);
      editButton.setAttribute("style", "padding: 0 0.4rem;");
      editButton.setAttribute("class", "btn btn-warning");
      editButton.setAttribute("target", "_blank");
      let editIcon = document.createElement("i");
      editIcon.setAttribute("class", "ti-pencil");
      editButton.appendChild(editIcon);
      editButtonCell.appendChild(editButton);

      // Delete button
      let deleteButton = document.createElement("a");
      deleteButton.setAttribute("data-id", modelList[i].id);
      deleteButton.setAttribute("style", "padding: 0 0.4rem;");
      deleteButton.setAttribute("class", "btn btn-danger");
      let deleteIcon = document.createElement("i");
      deleteIcon.setAttribute("class", "ti-trash");
      deleteButton.appendChild(deleteIcon);
      deleteButtonCell.appendChild(deleteButton);

      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        let id = ""
        if (window.confirm("Are you sure you want to delete this model?")) {
          let objectId = event.currentTarget.getAttribute('data-id');
          let objectRef = ref(db, "models/" + objectId);

          get(objectRef).then((snapshot) => {
            if (snapshot.exists()) {
              let objectData = snapshot.val();
              id = objectData["id"];
              console.log(id)
              const data = { "id": id }
              fetch("https://afternoon-dusk-32468.herokuapp.com/delete",
                {
                  method: "POST",
                  body: JSON.stringify(data),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              ).then(() => {
                remove(objectRef).then(() => {
                  console.log("Object removed");
                  location.reload();
                });
              })
            }
          })

        }


      });


      modelCell.appendChild(modelLink);
      markerCell.appendChild(markerLink);
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(descCell);
      row.appendChild(modelCell);
      row.appendChild(markerCell);
      row.appendChild(editButtonCell);
      row.appendChild(deleteButtonCell);
      modelTableBody.appendChild(row);
    }

  })
  .catch(error => console.error(error));
