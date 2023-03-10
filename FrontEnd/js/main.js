let worksData;
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

function logout(){
    localStorage.clear();
    document.getElementById('login-link-li').classList.remove("hide");
    document.getElementById('logout-link-li').classList.add("hide");
    window.location.href="index.html"
}

function checkLoggedIn(){

    let token = localStorage.getItem("token")
    let logged
    token ? logged = true : logged = false
    return logged
}

function editionModeDisabled(){
    let editionElems = document.getElementsByClassName("edition-mode");

    for(let i = 0; i < editionElems.length; i++){
        editionElems[i].classList.add("disabled");
    }
}

async function getWorks(){
    fetch('http://localhost:5678/api/works').then(function (response) {
        return response.json();

    }).then(function (data) {
        worksData = data;
        dispatchWorks(data, "toGallery");

    }).catch(function (err) {
        console.warn('Something went wrong with works', err);
    });
}

async function getCategories(){
    return fetch('http://localhost:5678/api/categories')

    .then((response)=>response.json())

    .then(function (data) {
        let loggin = checkLoggedIn()
        if(loggin == true){
            return data
        }else{
            createFilters(data)
        }
        

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
            workImage.setAttribute('id', "work_"+ data[i].id)

            workEditionLink.setAttribute( 'href', '#')
            workEditionLink.classList.add('modal-edition-link')
            workEditionLink.innerHTML = "éditer"

            iconContainer.classList.add('modal-icon-container')

            deleteIcon.classList.add('fa-solid')
            deleteIcon.classList.add('fa-trash-can')
            deleteIcon.classList.add('modal-edition-icon')
            deleteIcon.addEventListener('click', (event) => { 
                preDeleteProject(data[i].id)
            })
            
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

const createFilters = function (data){
//TODO : addClass (au lieu du style)
//console.log(data)
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
        
        item.name == "Hotels & restaurants" ? item.name = "Hôtels & restaurants" : item

        filter.innerHTML = item.name
        filtersContainer.append(filter)
    });   

}

let modal = null;
//TODO : revoir les focusableSelector
const focusableSelector = 'button, a, input'
let focusables = []
let previouslyFocusedElement = null


const openModal = async function (e) {
    e.preventDefault()
    const target = e.target.getAttribute('href')
    if (target.startsWith("#")){
        modal = document.querySelector(target)
    } else {
        modal = await loadModal(target)
    }
    
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    focusables[0].focus()
    //modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')

    modal.addEventListener('click', closeModal)
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal)
    modal.querySelector('.edition-modal-stop').addEventListener('click', stopPropagation)

    displayModalStep(1);

}

const closeModal = function (e){
    if ( modal === null ) return
    e.preventDefault()
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

    //TODO = suppression des projets au clic sur le bouton "publier les changements"
    // if(projectToDeleteArray.length){
    //     deleteProject(projectToDeleteArray)
    // }

    let element = document.getElementById('edition-modal-project')
    document.body.removeChild(element)
    modal = null
    dispatchWorks(worksData, "toGallery")

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

// modalStep : int 
// step 1 "Galerie photo"
// step 2 "Ajouter une photo"

async function displayModalStep(modalStep){

    switch(modalStep){

        case 1 :
            let container = modal.querySelector('#modal-photo-container')
            container.style.display = "grid"
            modal.querySelector('#modal-add-photo').style.display = "none"
            modal.querySelector('.modal-form-submit').style.display = "none"
            modal.querySelector('.modal-btn-container').style.justifyContent = "flex-end"
            modal.querySelector('.modal-back-btn').style.display = "none"
            modal.querySelector('.modal-title').innerHTML = "Galerie photo"
            modal.querySelector('.modal-add-btn').style.display = "flex"
            modal.querySelector('.modal-add-btn').innerHTML = "Ajouter une photo"
            modal.querySelector('.modal-add-btn').addEventListener('click', (event => {
                displayModalStep(2)
            }));

            if(!container.firstChild){
                dispatchWorks(worksData, 'toModal')
            }
           
            break;
            
        case 2 :
        
            modal.querySelector('#modal-add-photo').style.display = null
            modal.querySelector('#modal-photo-container').style.display = "none"

            modal.querySelector('.modal-form-submit').style.display = null
            modal.querySelector('.modal-btn-container').style.justifyContent = "space-between"
            modal.querySelector('.modal-back-btn').style.display = "block"
            modal.querySelector('.modal-back-btn').addEventListener('click', (event => {
                displayModalStep(1)
            }));
            modal.querySelector('.modal-title').innerHTML = "Ajout photo"
            modal.querySelector('.modal-add-btn').style.display = "none"
            modal.querySelector('.modal-delete-gallery-btn') ? modal.querySelector('.modal-delete-gallery-btn').style.display = "none" : ""

            let fileInput = document.getElementById('modal-upload-field')
            fileInput.addEventListener('change', verifySelectedPhoto)

            let select = document.getElementById('select-category')

            if(!select.firstChild){

                let categories = await getCategories(); 

                let defaultOption = {id : 0,name : ""}
                categories.unshift(defaultOption)

                categories.forEach(data =>{
                    let option = document.createElement('option')
                    option.setAttribute('value', data.id)
                    option.innerHTML = data.name
                    select.append(option)
                })

                select.addEventListener('change', (event) => {
                    //console.log("select", select.value)
                    prepareData(null, select.value)
                });
            }
            break;
    }
}

const verifySelectedPhoto = function (e){
    e.preventDefault;

    const fileInput = document.getElementById('modal-upload-field')

    //1 Mo = 1 MB
    //1 Mo = 1024 k0 = 1 048 576 octets
    if (fileInput.files.length > 0) {
        const fileSize = fileInput.files.item(0).size //given in octets
        const fileMB = fileSize / 1024 ** 2
        //console.log(fileSize + " octets =", fileMB + " MB")

        if (fileMB > 4) {
            // err "Please select a file less than 2MB.";
        }else{
            
            const file = document.getElementById('modal-upload-field').files[0];
            prepareData(file)
            let container = document.querySelector('.modal-upload')
            container.innerHTML = ""

            let image = document.createElement('img')
            image.src = URL.createObjectURL(file)
            container.append(image)

        }
    }else{
        //err : aucun fichier sélectionné
    }
}

var formData = new FormData();
const prepareData = function (imgFile, title, category){

    imgFile ? formData.append("userfile", imgFile) :
    title ? formData.append("title", title) :
    category ? formData.append("title", category) : ""
    
    for (const value of formData.values()) {
        console.log("value",value);
      }
}

// formElem.onsubmit = async (e) => {
//     e.preventDefault();

//     let response = await fetch('/article/formdata/post/user-avatar', {
//       method: 'POST',
//       body: new FormData(formElem)
//     });

//     let result = await response.json();

//     alert(result.message);
//   };

let projectToDeleteArray = [];
const preDeleteProject = function (projectToDelete){
    projectToDeleteArray.push(projectToDelete)
    worksData = worksData.filter(work => work.id != projectToDelete)
    imgOfPTD = document.getElementById("work_"+projectToDelete)
    imgOfPTD.style.filter = "grayscale(1)"
}

async function deleteProject(arrayOfProjectsId){
    //TODO : gérer les erreurs
    let token = localStorage.getItem('token');

    for(const project of arrayOfProjectsId){
        let response = await fetch(`http://localhost:5678/api/works/${project}`, {

            method: 'DELETE',
            headers: new Headers({
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
                
            })
    });
          
        let result = await response.json();
        //console.log(result)
 
    }
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


if(checkLoggedIn()){
    document.getElementById('navbar').style.marginTop = "100px"
    document.getElementById('logout-link-li').classList.remove("hide")
    document.getElementById('login-link-li').classList.add("hide")
    getWorks()
}else{
    editionModeDisabled()
    getWorks()
    getCategories()
}


