"use strict";

window.addEventListener("DOMContentLoaded", sidenVises);

let allItems = [];

allItems = [
    {id: 0, toDo: false, description: "Køb mælk" },
    {id: 1, toDo: false, description: "Køb brød"},
    {id: 2, toDo: false, description: "Køb ost"},
    {id: 3, toDo: false, description: "Køb smør"},
]
let idCounter = 0

const item = {
    id: 0,
    toDo: false,
    description: "",
    type: ""
}

const storedItems = localStorage.getItem("allItems");
if (storedItems) {
    allItems = JSON.parse(storedItems);
    idCounter = Math.max(...allItems.map(item => item.id)) + 1;
}




function sidenVises() {
    displayList(allItems);
    
    document.querySelector("#submit").addEventListener("click", function(event){
        event.preventDefault()
      }); 
    
    document.querySelector("#submit").addEventListener("click", submit);
    
    document.querySelectorAll(".filter").forEach((button) => {
        button.addEventListener("click", filterClick);
    });
    
}

function submit() {

    if (document.querySelector("#new_description").value === "" && document.querySelector("#new_type").value === "choose"){
        document.querySelector("#error").textContent = "Please insert a description and a type for your task"
        document.querySelector("#error").classList = " ";
    }
    else if (document.querySelector("#new_description").value === "") {
        document.querySelector("#error").textContent = "Please insert a description for your task"
        document.querySelector("#error").classList = " ";
    }
    else if (document.querySelector("#new_type").value === "choose") {
        document.querySelector("#error").textContent = "Please insert a type for your task"
        document.querySelector("#error").classList = " ";
    }
    else {
        const item2 = {...item};
        item2.description = document.querySelector("#new_description").value;
        item2.type = document.querySelector("#new_type").value;
        item2.id = idCounter++;
        
        allItems.push(item2);
        displayList(allItems);

        document.querySelector("#form").reset();
        document.querySelector("#error").classList.add("hide");
    }
    
}

function slet() {
    const itemId = this.getAttribute("data-id"); // Get the ID of the item to delete
    const foundItem = allItems.indexOf(allItems.find(item => item.id == itemId));
    allItems.splice(foundItem, 1);

    displayList(allItems);
}

function displayList(items) {
    document.querySelector("#table tbody").innerHTML = "";

    if(allItems.length === 0){
        displayEmpty();
    }
    else {
        items.forEach(displayItem);
        document.querySelectorAll("#slet").forEach((button) => {
            button.addEventListener("click", slet)
        });
    }
    localStorage.setItem("allItems", JSON.stringify(allItems));
}

function displayItem (item) {
    const clone = document.querySelector("template#item").content.cloneNode(true);

    clone.querySelector("[data-field=description]").textContent = item.description;
    clone.querySelector("[data-field=type]").textContent = item.type;
    clone.querySelector("#slet").dataset.id = item.id;

    const toDoIcon = clone.querySelector("[data-field=toDo]");
    toDoIcon.textContent = item.toDo ? "🟠" : "🔘";


    // TODO: Add event listener to click on star
    toDoIcon.addEventListener("click", () => {
        item.toDo = !item.toDo;
        toDoIcon.textContent = item.toDo ? "🟠" : "🔘";

        if( document.querySelector("#all").classList.contains("active")){
            displayList(allItems);
        }
        else{
            const filter = !item.toDo === true; 
            const filteredItems = filterItems(filter);
            displayList(filteredItems);
        }
    });

    document.querySelector("#table tbody").appendChild(clone);
}

function displayEmpty() {
    const emptyClone = document.querySelector("template#empty").content.cloneNode(true);
    document.querySelector("#table tbody").appendChild(emptyClone);
}

function filterClick(event) {
    document.querySelectorAll(".filter").forEach((button) => {
        button.classList.remove("active");
    });
    event.target.classList.add("active");
    if (event.target.getAttribute("data-filter") === "*"){
        const filter = event.target.getAttribute("data-filter");
        const filteredItems = filterItems(filter);
        displayList(filteredItems);
    }
    else{
        const filter = event.target.getAttribute("data-filter") === "true";
        const filteredItems = filterItems(filter);
        displayList(filteredItems);
    }
    
}

function filterItems(filter) {
    if(filter === "*") {
        return allItems
    }
    else {
        return allItems.filter((item) => item.toDo === filter);
    }
}

