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
        idCell.innerHTML = i+1;
        nameCell.innerHTML = modelList[i].name;
        descCell.innerHTML = modelList[i].description;
        
        // Edit button
        let editButton = document.createElement("a");
        editButton.setAttribute("href", "admin_suahocphan.php?mahocphan=" + modelList[i].objectId);
        editButton.setAttribute("style", "padding: 0 0.4rem;");
        editButton.setAttribute("class", "btn btn-warning");
        let editIcon = document.createElement("i");
        editIcon.setAttribute("class", "ti-pencil");
        editButton.appendChild(editIcon);
        editButtonCell.appendChild(editButton);
        
        // Delete button
        let deleteButton = document.createElement("a");
        deleteButton.setAttribute("href", "admin_xoahocphan.php?mahocphan=" + modelList[i].objectId);
        deleteButton.setAttribute("style", "padding: 0 0.4rem;");
        deleteButton.setAttribute("class", "btn btn-danger");
        let deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("class", "ti-trash");
        deleteButton.appendChild(deleteIcon);
        deleteButtonCell.appendChild(deleteButton);
      
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
