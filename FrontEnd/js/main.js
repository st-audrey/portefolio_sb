let projectsData = [];
let categories = [];
let formData = new FormData();
let formValues = {
    image: null,
    title: null,
    category: null
}
let projectToDeleteArray = [];
let modal = null
let focusables = []
let previouslyFocusedElement = null

//TODO : revoir les focusableSelector
const focusableSelector = 'button, a, input'


//TODO : addClass (au lieu du style)

const chargeLoginSection = async function (e){
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


//séparer
function dispatchProjects(projectArray, projectsDestination, idCategory){
    if(projectsDestination == "toGallery"){
        let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];
        gallery.innerHTML = "";
    
        if(idCategory && idCategory != 4){
            projectArray = projectArray.filter((project)=> project.category.id == idCategory);
            
        }else if(!idCategory || idCategory == 4){
            projectArray = projectArray;
        }
    
        projectArray.forEach(item => {
    
            let project = document.createElement('figure');
            let projectImage = document.createElement('img');
            let projectText = document.createElement('figcaption');
        
            projectImage.setAttribute('src', item.imageUrl);
            projectText.innerHTML += item.title;
    
            project.append(projectImage, projectText);
    
            gallery.appendChild(project);
        });

    } else {
       
        let projectContainer = document.getElementById("modal-photo-container");

        for(let i = 0; i < projectArray.length; i++){

            let project = document.createElement('div')
            let projectImage = document.createElement('img')
            let projectEditionLink = document.createElement('a')
            let iconContainer = document.createElement('div') 
            let deleteIcon = document.createElement('i')
        
            project.classList.add('modal-work-container')

            projectImage.setAttribute('src', projectArray[i].imageUrl)
            projectImage.classList.add('modal-img-project')
            projectImage.setAttribute('id', "work_"+ projectArray[i].id)

            projectEditionLink.setAttribute( 'href', '#')
            projectEditionLink.classList.add('modal-edition-link')
            projectEditionLink.innerHTML = "éditer"

            iconContainer.classList.add('modal-icon-container')

            deleteIcon.classList.add('fa-solid')
            deleteIcon.classList.add('fa-trash-can')
            deleteIcon.classList.add('modal-edition-icon')
            deleteIcon.addEventListener('click', (event) => { 
                preDeleteProject(projectArray[i].id)
            })
            
            if(i == 0){
                let moveIcon = document.createElement('i')
    
                moveIcon.classList.add('fa-solid')
                moveIcon.classList.add('fa-arrows-up-down-left-right')
                moveIcon.classList.add('modal-edition-icon')

                iconContainer.append(moveIcon)
            } 
            
            iconContainer.append(deleteIcon)
            project.append( iconContainer, projectImage, projectEditionLink)
    
            projectContainer.appendChild(project)
        }         
    }
}

const createFilters = function (){

    let portfolio = document.getElementById('portfolio');
    let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];
    let newContainer = document.createElement('div');  

    newContainer.setAttribute('id', 'filters-container');
    portfolio.insertBefore(newContainer, gallery);

    let filtersContainer = document.getElementById('filters-container');

    // let allFilters = new Set();

    let tousCategory = new Category({id:4,name:"Tous"});
    categories.unshift(tousCategory);

    // for( i = 0 ; i < data.length ; i++ ){
    //     allFilters.add(data[i]);
    // }

    categories.forEach(item => {
        let filter = document.createElement('button');
        filter.classList.add('filter-btn')

        filter.addEventListener("click", function(){
            dispatchProjects(projectsData, "toGallery", item.id);
        });
        
        //missing "^" in db
        item.name == "Hotels & restaurants" ? item.name = "Hôtels & restaurants" : item

        filter.innerHTML = item.name
        filtersContainer.append(filter)
    });   

}

const enableSubmit = function(e){
//regex + nb caractères + !caratères spéciaux
    let inputTitle = document.getElementById('input-title')

    if(inputTitle.value || inputTitle.value != "" || inputTitle.value != null){
        formValues.title = inputTitle.value
    }

    let sumitButton = modal.querySelector('.modal-form-submit')
    if(!inputTitle.value || inputTitle.value === "" || inputTitle.value === null || formValues.category == null || formValues.image == null) { 
        sumitButton.setAttribute("disabled", "disabled")
    } else {
        sumitButton.removeAttribute("disabled")
    }
}

const verifySelectedPhoto = function (e){
    e.preventDefault()

    const fileInput = document.getElementById('modal-upload-field')

    //1 Mo = 1 MB
    //1 Mo = 1024 k0 = 1 048 576 octets
    if (fileInput.files.length > 0) {
        const fileSize = fileInput.files.item(0).size //given in octets
        const fileMB = fileSize / 1024 ** 2

        if (fileMB > 1) {
            modal.querySelector('#modal-img-error').innerHTML = "Votre image doit peser moins de 4 Mo" 
        }else{
            modal.querySelector('#modal-img-error').innerHTML = ""
            const file = document.getElementById('modal-upload-field').files[0];
            formValues.image = file
            let container = document.querySelector('.modal-upload')
            container.innerHTML = ""

            let image = document.createElement('img')
            image.src = URL.createObjectURL(file)
            container.append(image)
            enableSubmit()
        }

    }else{
        //err : aucun fichier sélectionné
    }
}

const fillFormData = function (){
    console.log("from fillFormData -> image", formValues.image)
    formData.append("image", formValues.image)
    formData.append("title", formValues.title)
    formData.append("category", parseInt(formValues.category))

    for (const value of formData.values()) {
        console.log("fillFormData", value);
    }
}



const publishModifications = async function (projectToDeleteArray, projectToCreateformData) {

    if(projectToDeleteArray.length){
        deleteProject(projectToDeleteArray)
    }
   
    createNewProject(projectToCreateformData)
}

const preDeleteProject = function (projectToDelete){
    projectToDeleteArray.push(projectToDelete)
    projectsData = projectsData.filter(project => project.id != projectToDelete)
    imgOfPTD = document.getElementById("work_"+projectToDelete)
    imgOfPTD.style.filter = "grayscale(1)"
}



document.querySelectorAll('.edition-modal').forEach(item =>{
    item.addEventListener('click', openModal);
})

document.getElementById('login-link').addEventListener('click', chargeLoginSection);

//accessibility
window.addEventListener('keydown', function (e) {
    if( e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
})

const applyEditionStyle = function(){
    document.getElementById('navbar').style.marginTop = "100px"
    document.getElementById('logout-link-li').classList.remove("hide")
    document.getElementById('login-link-li').classList.add("hide")
}

if(checkLoggedIn()){
    applyEditionStyle()
    getProjects()

}else{
    editionModeDisabled()
    getProjects()
    getCategories()
}


