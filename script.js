const addToDoButton = document.querySelector("#addToDoButton");
const deleteButton = document.querySelector("#deleteButton");
const toDoList = document.querySelector("#toDoList");

const backendPath = "http://localhost:4730/todos";

let localState = [];

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function requestFromAPI() {
  console.log();
  fetch(backendPath)
    .then((response) => {
      if (response.ok === true) {
        return response.json();
      }
    })
    .then((newToDosFromApi) => {
      console.log(newToDosFromApi);
      localState = newToDosFromApi;
      console.log(localState);
      renderState();
    });
}

requestFromAPI();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function renderState() {
  toDoList.innerHTML = "";
  console.log(localState);
  localState.forEach((ToDo) => {
    console.log(ToDo);
    const newLi = document.createElement("li");
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.checked = ToDo.done;
    newCheckbox.id = ToDo.id;
    newLi.appendChild(newCheckbox);
    const toDoDescription = document.createElement("label");
    toDoDescription.innerText = ToDo.description;
    toDoDescription.setAttribute("for", ToDo.id);
    newLi.appendChild(toDoDescription);
    toDoList.appendChild(newLi);
  });
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

addToDoButton.addEventListener("click", function (event) {
  const inputTextElement = document.querySelector("#inputTextElement");
  const newToDo = {
    description: inputTextElement.value,
    done: false,
  };
  inputTextElement.value = "";
  console.log(newToDo);
  fetch(backendPath, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newToDo),
  })
    .then((response) => {
      if (response.ok === true) {
        return response.json();
      }
    })
    .then((newToDosFromApi) => {
      console.log(newToDosFromApi);
      localState.push(newToDosFromApi);
      renderState();
    });
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

toDoList.addEventListener("change", function (event) {
  console.log(localState);
  console.log(event.target);
  console.log(event.target.id);
  console.log(event.target.type);
  console.log(event.target.checked);
  if (event.target.type === "checkbox") {
    console.log(localState);
    for (let index = 0; index < localState.length; index++) {
      let currentToDo = localState[index];
      console.log(currentToDo);
      console.log(currentToDo.id);
      console.log(event.target.id);
      if (currentToDo.id == event.target.id) {
        const updatedToDo = currentToDo;
        console.log(updatedToDo);
        console.log(localState[index]);
        updatedToDo.done = event.target.checked;
        console.log(updatedToDo);
        console.log(localState[index]);
        console.log(backendPath + "/" + event.target.id);
        fetch(backendPath + "/" + event.target.id, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(updatedToDo),
        })
          .then((response) => {
            if (response.ok === true) {
              return response.json();
            }
          })
          .then((newToDosFromApi) => {
            console.log(newToDosFromApi);
            console.log(localState);
            console.log("üüüüüüüüüüüüüüüüüüüüüüüüüüüüüüüüüüüü");
            renderState();
          });
      }
    }
  }
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

deleteButton.addEventListener("click", function () {
  console.log(localState);
  const checkedArray = [];
  const notCheckedArray = [];
  localState.forEach((ToDo) => {
    console.log(ToDo);
    if (ToDo.done === true) {
      console.log(checkedArray);
      checkedArray.push(ToDo);
      console.log(checkedArray);
    } else {
      notCheckedArray.push(ToDo);
    }
  });
  console.log(localState);
  checkedArray.forEach((ToDo) => {
    fetch(backendPath + "/" + ToDo.id, {
      method: "DELETE",
    })
      .then((response) => {
        response.json();
      })
      .then();
  });
  console.log("öööööööööööööööööööööööööööö");
  console.log(checkedArray);
  console.log(notCheckedArray);
  localState = notCheckedArray;
  renderState();
});
