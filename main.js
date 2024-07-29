const list = document.getElementById('list');
const form = document.getElementById('form');
const input = document.getElementById('new-task');
const clearAll = document.getElementById('clear-all');

const tasksArray = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function createElement(elementType, options = {}) {
  const element = document.createElement(elementType);
  const optionKeys = Object.keys(options);

  optionKeys.forEach((key) => {
    if (key == 'classList' && Array.isArray(options[key])) {
      element[key].add(...options[key]);
    } else {
      element[key] = options[key];
    }
  });

  return element;
}

function createTask(inputValue) {
  return createElement('span', { textContent: inputValue });
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

function addClearAll() {
  clearAll.addEventListener('click', () => {
    list.innerHTML = '';
    tasksArray.splice(0, tasksArray.length);
    updateLocalStorage();
  });
}

function recoverTasks() {
  tasksArray.forEach((inputValue) => appendChildren(list, createElement('li', { classList: ['task'] }), createTask(inputValue), createDeleteButton()));
}

recoverTasks();
updateLocalStorage();
handleFormSubmit();
addClearAll();
