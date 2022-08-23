const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.plates');
const items = JSON.parse(localStorage.getItem("items")) || [];

function addItemsSubmitHandler(e) {
    // To Prevent from Page Reload which is the default behaviour of form
    e.preventDefault();

    // we are getting input value of the form and storing it in text
    let text = (this.querySelector(`[name="item"]`)).value;

    // make an Object to store Data of dishes
    const item = {
       text,
       done: false
    }

    // pushing that object to the Array
    items.push(item);
    
    // Show list on screen
    populateList(items,itemsList);

    // using local storage to store our data
    localStorage.setItem("items",JSON.stringify(items));

    // reseting the form everytime we click submit button
    this.reset();
} 

function populateList(plates = [], platesList) {
    platesList.innerHTML = plates.map((plate,i) => {
        return`
        <li>
            <input type="checkbox" data-index=${i} id="item${i}" ${(plate.done) ? "checked" : ""} />
            <label for="item${i}" >${plate.text}</label>
        </li>
        `
    }).join("");
}

addItems.addEventListener("submit", addItemsSubmitHandler);

// when page reload this function is executed to get our
// list of items from local storage
populateList(items,itemsList);


/* 
  ==========================================================
                        EVENT DELEGATION
  ==========================================================
*/

// This not going to work if you update your current list b/c the inputs
// are going to be created after we listens for them, they don't have 
// event listeners attached to them.

// const checkboxes = document.querySelectorAll("input");

// checkboxes.forEach( input => input.addEventListener("click", () => alert("hi")));

////////////////////////////////////////////////////////////////////

// WHole idea behind event delegation is rather than listening for a click or a change in these checkboxes directly, what we do is look for somebody who is going to be on the page at the time of listening 

// for ex - In our case , if we look at the html that <ul> holds everything. we are going to listens for a click on the <ul class="plates"> and attach the event listeners to its childern

// Think EVENT DELEGATION as very Responsible parents like <ul class="plates"> and very negligent children who neccessarily here any instructions from the parent.

// what we saying is Hey! ' <ul class="plates"> ' , you your children inputs get clicked, can you please pass this click on to them, rather than you handling the click directly. we are just telling you b/c you are the only one resposible here, so that when someone clicks it, if it's for your children and I don't know they are your current children or you are going to make more children in the future but if you are going to make more children in future make sure you tell them to handle this click.

// So think like responsible parents and negligent children, who don't know what to do with the click. So, parents there tell them


function toggleDone(e) {
    // skip this unless it's an input
    // google more about matches() API
    if(!e.target.matches("input")) return; 
    
    // Getting the checkbox input element from the <ul class="plates">
    const el = e.target;
    
    // Index of the element
    const index = el.dataset.index;

    // we are flip flopping the property
    // if true => this will set it to false
    // if false => this will set it to true
    items[index].done = !items[index].done;

    localStorage.setItem("items", JSON.stringify(items));
    populateList(items,itemsList);
}

itemsList.addEventListener("click", toggleDone);


//////// Challenge //////////
// clearAll btn
// checkAll Btn
// unCheckAll btn

const clearAll = document.getElementById("clearAll");
const checkAll = document.getElementById("checkAll");
const unCheckAll = document.getElementById("uncheckAll");


function clearAllClickHandler() {
    // to clear the local storage
    localStorage.clear();

    // To RELOAD page
    location.reload();
}

function checkAllClickHandler(isChecked) {

    // seleting All <ul> list children (i.e <li>) and converting it to an array
   const itemsListChildren = Array.from(itemsList.children);

   itemsListChildren.forEach(itemChild => {
    // selecting all <li> list children and converting that list to an array
    listInputs = Array.from(itemChild.children);

    listInputs.forEach(el => {

        // selecting only Input elements from the <li> children
        if(el.tagName == "INPUT") {

            // if not checked and isChecked == true, making all the checkbox checked 
            if(!el.checked && isChecked){
                el.checked = true;
            // if checked and isChecked == false, making all the checkbox not checked
            } else if(el.checked && !isChecked) {
                el.checked = false;
            }
        }
    })
   });


   // storing the data to localStorage
    items.forEach(item => {

        if(isChecked){
            item.done = true;
        } else {
            item.done = false;
        }

        localStorage.setItem("items", JSON.stringify(items));
       })
}


clearAll.addEventListener("click", clearAllClickHandler);
checkAll.addEventListener("click", () => checkAllClickHandler(true));
unCheckAll.addEventListener("click", () => checkAllClickHandler(false));