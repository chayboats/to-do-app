const list = document.getElementById('list');
const form = document.getElementById('form');
const input = document.getElementById('new-task');
const clearAll = document.getElementById('clear-all');

// I want to store the tasks in an array.
// If there is a key/value pair for 'tasks',
// then I will get it and convert it to an object
// If not, I will create an empty array
const tasksArray = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

// If I am going to be getting this 'tasks' key from local storage, I need to set it
// Since tasksArray is an object, it needs to be converted to a string
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

// I will be creating many elements, so I want to create a resusable function
// That accepts the type of element I will be creating as well as class names
function createElement(elementType, options = {}) {
  const element = document.createElement(elementType);
  
  // optionKeys returns and array of keys from the options argument
  //Object is an object constructor
  // Keys is a method placed on the object constructor, it returns an array of keys
  const optionKeys = Object.keys(options);

  // When looping through the optionKeys array, 
  // The key/value pairs will be set for the element
  // element[key] will be used to target the element's key
  // options[key] will be used to set the value 
  // Using data from the argument

  optionKeys.forEach((key) => {
    if(key == 'classList' && Array.isArray(options[key])) {
      element[key].add(...options[key]);
    } else {
      element[key] = options[key];
    }
  })

  return element;
}

// I made this function reusuable by adding a parameter of inputValue,
// If I pass input.value as the argument, it will make the textContent the value
// of what was put into the input
function createTask(inputValue) {
  return createElement('span', { textContent: inputValue });;
}

function removeTask(trashCan) {
  const taskTextContent = trashCan.previousSibling.textContent;
  const taskIndex = tasksArray.indexOf(taskTextContent);

  tasksArray.splice(taskIndex, 1);
}

function createDeleteButton() {
  const trashCan = createElement('i', { classList: ['fa-trash', 'fa-solid'] });

  trashCan.addEventListener('click', () => {
    removeTask(trashCan);
    updateLocalStorage();
    trashCan.parentElement.remove();
  });

  return trashCan;
}

function appendChildren(grandparent, parent, child1, child2) {
  grandparent.append(parent);
  parent.append(child1, child2);
}

function handleFormSubmit() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    appendChildren(list, createElement('li', { classList: ['task'] }), createTask(input.value), createDeleteButton());

    tasksArray.push(input.value);
    updateLocalStorage();
    input.value = '';
  });
}

// I am adding an event listener to the clearAll button
// When the button is clicked:
// List innerHTML will be an empty string
// The elements inside the tasksArray will be removed
// And the local storage will be updated

function addClearAll() {
  clearAll.addEventListener('click', () => {
    list.innerHTML = '';
    tasksArray.splice(0, tasksArray.length);
    updateLocalStorage();
  });
}

// This is a function that will recover the tasks once the page has been refreshed, returned to etc.
// It will take the elements from the array and apply the appendChildren method
// Each element is a task, so when creating the span,
// We pass the element as an arguement so that it can add that task to the list

function recoverTasks() {
  tasksArray.forEach((inputValue) => appendChildren(list, createElement('li', { classList: ['task'] }), createTask(inputValue), createDeleteButton()));
}

recoverTasks();
updateLocalStorage();
handleFormSubmit();
addClearAll();
