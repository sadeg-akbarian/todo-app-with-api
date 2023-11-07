const addToDoButton = document.querySelector("#addToDoButton");
const deleteButton = document.querySelector("#deleteButton");
const toDoList = document.querySelector("#toDoList");

const backendPath = "http://localhost:4730/todos";

let localState = [];

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function requestFromAPI() {
  fetch(backendPath)
    .then((response) => {
      if (response.ok === true) {
        return response.json();
      }
    })
    .then((newToDosFromApi) => {
      localState = newToDosFromApi;
      renderState();
    });
}

requestFromAPI();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function renderState() {
  toDoList.innerHTML = "";
  localState.forEach((ToDo) => {
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
      localState.push(newToDosFromApi);
      renderState();
    });
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

toDoList.addEventListener("change", function (event) {
  if (event.target.type === "checkbox") {
    for (let index = 0; index < localState.length; index++) {
      let currentToDo = localState[index];
      if (currentToDo.id == event.target.id) {
        const updatedToDo = currentToDo;
        updatedToDo.done = event.target.checked;
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
            renderState();
          });
      }
    }
  }
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

deleteButton.addEventListener("click", function () {
  const checkedArray = [];
  const notCheckedArray = [];
  localState.forEach((ToDo) => {
    if (ToDo.done === true) {
      checkedArray.push(ToDo);
    } else {
      notCheckedArray.push(ToDo);
    }
  });
  checkedArray.forEach((ToDo) => {
    fetch(backendPath + "/" + ToDo.id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then();
  });
  localState = notCheckedArray;
  renderState();
});
