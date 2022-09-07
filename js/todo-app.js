(function () {

let itemsArray = [];
let listName = '';

  function createAppTitle(title) {
let appTitle = document.createElement('h2');
appTitle.innerHTML = title;
return appTitle;
  }

  function createTodoItemForm() {
let form = document.createElement('form');
let input = document.createElement('input');
let buttonWrapper = document.createElement('div');
let button = document.createElement('button');

form.classList.add('input-group', 'mb-3');
input.classList.add('form-control');
input.placeholder = 'Введите название нового дела';
buttonWrapper.classList.add('input-group-append');
button.classList.add('btn', 'btn-primary');
button.textContent = 'Добавить дело';
button.disabled = true;

buttonWrapper.append(button);
form.append(input);
form.append(buttonWrapper);

return {
  form,
  input,
  button,
};
  }

  function createTodoList() {
let list = document.createElement('ul');
list.classList.add('list-group');
return list;
  }

  function createTodoItem(obj) {
let item = document.createElement('li');
let buttonGroup = document.createElement('div');
let doneButton = document.createElement('button');
let deleteButton = document.createElement('button');

item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
item.textContent = obj.name;
buttonGroup.classList.add('btn-group', 'btn-group-sm');
doneButton.classList.add('btn', 'btn-success');
doneButton.textContent = 'Готово';
deleteButton.classList.add('btn', 'btn-danger');
deleteButton.textContent = 'Удалить';

if (obj.done) {
  item.classList.add('list-group-item-success');
}

buttonGroup.append(doneButton);
buttonGroup.append(deleteButton);
item.append(buttonGroup);

doneButton.addEventListener('click', function() {
  item.classList.toggle('list-group-item-success');
  for (let elem of itemsArray) {
    if (elem.id == obj.id) {
      elem.done = !elem.done;
    }
  }
  saveListItems(itemsArray, listName);
});

deleteButton.addEventListener('click', function() {
  if (confirm('Вы уверены?')) {
    item.remove();
  }
  for (let i = 0; i < itemsArray.length; i++) {
    if (itemsArray[i].id == obj.id) {
      itemsArray.splice(i, 1);
    }
  }
  saveListItems(itemsArray, listName);
});

return {
  item,
  doneButton,
  deleteButton,
};
  }

  function getId (array) {
    let max = 0;
    for (let item of array) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max+1;
  }

  function saveListItems (array, key) {
    localStorage.setItem(key, JSON.stringify(array))
  }

  function createTodoApp(container, title = "Cписок дел", key, defoltArray=[]) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    listName = key;
    itemsArray = defoltArray;

container.append(todoAppTitle);
container.append(todoItemForm.form);
container.append(todoList);

let localDate = localStorage.getItem(listName);
if (localDate !== null && localDate !=='') {
  itemsArray = JSON.parse(localDate);
}

for (let el of itemsArray) {
  let todoItem = createTodoItem(el);
  todoList.append(todoItem.item);
}

todoItemForm.input.addEventListener('input', function() {
  if (todoItemForm.input.value != '') {
    todoItemForm.button.disabled = false;
  } else {
    todoItemForm.button.disabled = true;
  }
})

todoItemForm.form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!todoItemForm.input.value) {
    return;
  }

  let newItem  = {
    id: getId(itemsArray),
    name: todoItemForm.input.value,
    done: false
  };

  let todoItem = createTodoItem(newItem);

  itemsArray.push(newItem);
  saveListItems(itemsArray, listName);

  todoList.append(todoItem.item);
  todoItemForm.input.value = '';
  todoItemForm.button.disabled = true;
});
  };

  window.createTodoApp = createTodoApp;

})();
