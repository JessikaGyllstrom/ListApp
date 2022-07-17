// select items
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option 
let editElement;
let editFlag = false;
let editID = "";

// event listeners
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
//load items
window.addEventListener('DOMContentLoaded', setUpItems);

// functions
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    //if value is not empty and not editing
    if(value !== '' && editFlag === false) {
        console.log("add item to list");
        createListItem(id, value);
        //display alert
        displayAlert("item added to the list", "success");
        // show container
        container.classList.add("show-container");
        // add to  local storage 
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    // if value is not empty and editing
    else if(value !== '' && editFlag === true) {
        console.log("editing");
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        //edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        console.log("empty value");
        displayAlert("please enter value", "danger");
    }
}
// display alert 
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}
// clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
// delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    console.log("item deleted");
    if(list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);
}
// edit function
function editItem(e) {
    console.log("editing item");
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;  
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}
// set back to default
function setBackToDefault() {
    console.log("set back to default");
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
// local storage
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getLocalStorage();
    console.log("added to local storage");
    //console.log(grocery);
    items.push(grocery);
    //console.log(items);
    localStorage.setItem('list', JSON.stringify(items));
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
      if (item.id !== id) {
        console.log(item.id);
        return item;
      }
    }); 
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();


}
function getLocalStorage() {
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
//setup items
function setUpItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(item) {
            createListItem(item.id, item.value)
        });
        container.classList.add("show-container");
    }
}
function createListItem(id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>                        
        </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // append child
    list.appendChild(element);
}
