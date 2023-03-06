function checkLoggedIn(){
    let token = localStorage.getItem("token");
    let logged;
    if(token){
        logged = true
    }else{
        logged = false;
        logout();
    } 
    return logged;
}

function checkAuthorized(){
    let user = localStorage.getItem("user_id");
    let authorized;
    if(user == 1){
        authorized = true;
        getWorks();
    }else{
        authorized = false;
        editionModeDisabled();
        getWorks();
        getCategories();
    } 
    return authorized;
}

function logout(){
    localStorage.clear();
    window.location.href="/login.html";
}

function editionModeDisabled(){
    let editionElems = document.getElementsByClassName("edition-mode");
    console.log("editionElems", editionElems);

    for(let i = 0; i < editionElems.length; i++){
        editionElems[i].classList.add("disabled");
    }
}

let worksData;
let categoriesData;

function getWorks(){
    fetch('http://localhost:5678/api/works').then(function (response) {
        return response.json();

    }).then(function (data) {
        worksData = data;
        dispatchWorks(data);

    }).catch(function (err) {
        console.warn('Something went wrong with works', err);
    });
}

function getCategories(){
    fetch('http://localhost:5678/api/categories').then(function (response) {
        return response.json();

    }).then(function (data) {
        categoriesData = data;
        createFilters(data);

    }).catch(function (err) {
        console.warn('Something went wrong with categories', err);
    });
}


function dispatchWorks(data, idCategory){
    
    let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];
    gallery.innerHTML = "";


    if(idCategory && idCategory != 4){
        data = data.filter((work)=> work.categoryId == idCategory);
        
    }else if(!idCategory || idCategory == 4){
        console.log(data,"test");
    }


    data.forEach(item => {

        let work = document.createElement('figure');
        let workImage = document.createElement('img');
        let workText = document.createElement('figcaption');
    
        workImage.setAttribute('src', item.imageUrl);
        workText.innerHTML += item.title;

        work.append(workImage, workText);

        gallery.appendChild(work);
    });
}

function createFilters(data){

    let portfolio = document.getElementById('portfolio');
    let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];
    let newContainer = document.createElement('div');  
    newContainer.style.width = '50%';
    newContainer.style.margin = '50px auto 50px';
    newContainer.style.display = 'flex';
    newContainer.style.flexDirection = 'row';
    newContainer.style.justifyContent = 'space-around';
    
    newContainer.setAttribute('id', 'filters-container');

    portfolio.insertBefore(newContainer, gallery);

    let filtersContainer = document.getElementById('filters-container');

    let allFilters = new Set();
    let tousFilter = { id : 4, name: "Tous"};
    allFilters.add(tousFilter);

    for( i = 0 ; i < data.length ; i++ ){
        allFilters.add(data[i]);
    }

    allFilters.forEach(item => {
        let filter = document.createElement('button');
        filter.style.border = '1px solid #1D6154';
        filter.style.backgroundColor = 'white';
        filter.style.padding = '5px 17px 5px 17px';
        filter.style.borderRadius = '40px';
        filter.style.fontFamily = 'Syne';
        filter.style.fontSize = '16px';
        filter.style.color = '#1D6154';
        filter.style.cursor = 'pointer';

        filter.addEventListener("mouseover", (event) => {
            filter.style.color = 'white';
            filter.style.backgroundColor = '#1D6154';
        });
        
        filter.addEventListener("mouseout", (event) => {
            filter.style.color = '#1D6154';
            filter.style.backgroundColor = 'white';
        });

        filter.addEventListener("click", (event) => {
            dispatchWorks(worksData, item.id);
        });
        
        item.name == "Hotels & restaurants" ? item.name = "Hôtels & restaurants" : item;

        filter.innerHTML = item.name;
        filtersContainer.append(filter);
    });   

}

let modal = null;
const focusableSelector = 'button, a, input';
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
    e.preventDefault();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    modal = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.edition-close-modal-btn').addEventListener('click', closeModal);
    modal.querySelector('.edition-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = function (e){
    if ( modal === null ) return;
    e.preventDefault();
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.edition-close-modal-btn').removeEventListener('click', closeModal);
    modal.querySelector('.edition-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

const focusInModal = function (e){
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true){
        index--; 
    }else{
        index++;
    }
    
    if(index >= focusables.length){
        index = 0;
    }
    if(index < 0){
        index = focusables.length -1;
    }


    focusables[index].focus();
}

document.querySelectorAll('.edition-modal').forEach(item =>{
    item.addEventListener('click', openModal);
})

window.addEventListener('keydown', function (e) {
    if( e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
})


checkLoggedIn();
checkAuthorized();
    

