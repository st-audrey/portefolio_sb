//TODO : addClass (au lieu du style)
  

const chargeLoginSection = async function (e){
    //document.getElementById("login-out-btn").style.fontWeight = 600;
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target.startsWith("#")){
        modal = document.querySelector(target);
    } else {
        modal = await loadLoginSection(target);
    }

}

//refacto les load### function
const loadLoginSection = async function(url){
      //ajax loading
      const target = '#' + url.split('#')[1];
      const html = await fetch(url).then(response => response.text());
      const element = document.createRange().createContextualFragment(html).querySelector(target);
  
      if(element === null) throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`;

      document.body.style.height = "100vh";
      document.getElementById("login-link").style.fontWeight = "900";
      let main = document.getElementById("main");
      main.innerHTML = "";
      main.append(element);
      return element;

}

const chargeMainPage = function(url){
    if(!checkLoggedIn()){
        //tu charges les filtres
    }else{
        //tu charges le mode édition
    }
}

function logout(){
    localStorage.clear();
    document.getElementById('login-link-li').classList.remove("hide");
    document.getElementById('logout-link-li').classList.add("hide");
    window.location.href="index.html"
}

function checkLoggedIn(){

    let token = localStorage.getItem("token");
    let logged;
    if(token){
        logged = true;
        document.getElementById('navbar').style.marginTop = "100px"
        document.getElementById('logout-link-li').classList.remove("hide");
        document.getElementById('login-link-li').classList.add("hide");
        getWorks()

    }else{
        logged = false;
        editionModeDisabled()
        getWorks()
        getCategories()
    } 
    return logged;
}

function editionModeDisabled(){
    let editionElems = document.getElementsByClassName("edition-mode");

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
        dispatchWorks(data, "toGallery");

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

function dispatchWorks(data, workDestination, idCategory){
    if(workDestination == "toGallery"){
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

    } else {
       
        let workContainer = document.getElementById("modal-photo-container");


        for(let i = 0; i < data.length; i++){

            let work = document.createElement('div')
            let workImage = document.createElement('img')
            let workEditionLink = document.createElement('a')
            let iconContainer = document.createElement('div') 
            let deleteIcon = document.createElement('i')
        
            work.classList.add('modal-work-container')

            workImage.setAttribute('src', data[i].imageUrl)
            workImage.classList.add('modal-img-project')
            workImage.setAttribute('src', data[i].imageUrl)

            workEditionLink.setAttribute( 'href', '#')
            workEditionLink.classList.add('modal-edition-link')
            workEditionLink.innerHTML = "éditer"

            iconContainer.classList.add('modal-icon-container')

            deleteIcon.classList.add('fa-solid')
            deleteIcon.classList.add('fa-trash-can')
            deleteIcon.classList.add('modal-edition-icon')
            
            if(i == 0){
                let moveIcon = document.createElement('i')
    
                moveIcon.classList.add('fa-solid')
                moveIcon.classList.add('fa-arrows-up-down-left-right')
                moveIcon.classList.add('modal-edition-icon')

                iconContainer.append(moveIcon)
            } 
            
            iconContainer.append(deleteIcon)
            work.append( iconContainer, workImage, workEditionLink)
    
            workContainer.appendChild(work)
        }         
    }
}

function createFilters(data){

    let portfolio = document.getElementById('portfolio');
    let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];
    let newContainer = document.createElement('div');  
    newContainer.style.width = '65%';
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
        filter.style.backgroundColor = '#FFFEF8';
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
            filter.style.backgroundColor = '#FFFEF8';
        });

        filter.addEventListener("click", (event) => {
            dispatchWorks(worksData, "toGallery", item.id);
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


const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target.startsWith("#")){
        modal = document.querySelector(target);
    } else {
        modal = await loadModal(target);
    }
    
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.edition-modal-stop').addEventListener('click', stopPropagation);
    console.log("data for modal", worksData)
    dispatchWorks(worksData, 'toModal');
}

const closeModal = function (e){
    if ( modal === null ) return
    e.preventDefault()
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').removeEventListener('click', closeModal)
    modal.querySelector('.edition-modal-stop').removeEventListener('click', stopPropagation)
    let element = document.getElementById('edition-modal-project')
    document.body.removeChild(element)
    modal = null
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

const loadModal = async function (url){
    //ajax loading might need a loader
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);

    if(element === null) throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`;

    document.body.append(element);
    return element;

}

document.querySelectorAll('.edition-modal').forEach(item =>{
    item.addEventListener('click', openModal);
})

document.getElementById('login-link').addEventListener('click', chargeLoginSection);

window.addEventListener('keydown', function (e) {
    if( e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
})


checkLoggedIn();
// checkAuthorized();

