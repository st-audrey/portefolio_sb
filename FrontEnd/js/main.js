let projectsData = []
let categories = []
let formData = new FormData()
// faire un tableau d'objects pour ajout multiple => recheck toutes les conditions isCompleted
let formValues = {
    image: null,
    title: null,
    category: null
}
let projectToDeleteArray = []
let modal = null
let loginSection = null
let focusables = []
let previouslyFocusedElement = null

//TODO : revoir les focusableSelector
const focusableSelector = 'button, a, input'

const chargeLoginSection = async function (e){
    e.preventDefault();
    const target = e.target.getAttribute('href')
    if (target.startsWith("#")){
        loginSection = document.querySelector(target)
    } else {
        loginSection = await loadLoginSection(target)
    }
}

//refacto load### functions
const loadLoginSection = async function(url){
      //ajax loading
      const target = '#' + url.split('#')[1];
      const html = await fetch(url).then(response => response.text())
      const element = document.createRange().createContextualFragment(html).querySelector(target)
  
      if(element === null) throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`

      document.body.style.height = "100vh"
      document.getElementById("login-link").style.fontWeight = "900"
      let main = document.getElementById("main")
      main.innerHTML = ""
      main.append(element)
      return element
}

function checkLoggedIn(){
    let token = localStorage.getItem("token")
    let logged
    token ? logged = true : logged = false
    return logged
}

function editionModeDisabled(){
    let editionElems = document.getElementsByClassName("edition-mode")

    for(let i = 0; i < editionElems.length; i++){
        editionElems[i].classList.add("disabled")
    }
}

function dispatchProjects(projectArray, projectsDestination, idCategory){

    if(projectsDestination == "toGallery"){
        let portfolio = document.getElementById('portfolio')
        let gallery = portfolio.getElementsByClassName('gallery')[0]
        gallery.innerHTML = ""
    
        if(idCategory && idCategory != 4){
            projectArray = projectArray.filter((project)=> project.category.id == idCategory)
            
        }else if(!idCategory || idCategory == 4){
            projectArray = projectArray;
        }
    
        projectArray.forEach(project => {
            project.addToGallery(gallery)
        });

    } else {
       
        let modal = document.getElementById("modal-photo-container")
        for(let i = 0; i < projectArray.length; i++){
            projectArray[i].addToModal(modal, i == 0)
        }
    }
}

const createFilters = function (){

    let portfolio = document.getElementById('portfolio')
    let gallery = portfolio.getElementsByClassName('gallery')[0]

    let newContainer = document.createElement('div')
    newContainer.setAttribute('id', 'filters-container')
    portfolio.insertBefore(newContainer, gallery)

    let filtersContainer = document.getElementById('filters-container')

    // let allFilters = new Set();

    let tousCategory = new Category({id:4,name:"Tous"})
    categories.unshift(tousCategory)

    // for( i = 0 ; i < data.length ; i++ ){
    //     allFilters.add(data[i]);
    // }

    categories.forEach(category => {
        category.addToFiltersContainer(filtersContainer)
    });   

}

const enableSubmit = function(e){
//regex + nb caractères + !caratères spéciaux
    let inputTitle = document.getElementById('input-title')
    let maxLength = 45
    let maxCharsContainer = document.getElementById('max-chars')
    let sumitButton = modal.querySelector('.modal-form-submit')
    
    maxCharsContainer.innerHTML = "( " + inputTitle.value.length + " / "  + maxLength + " )"
    inputTitle.value.length <= maxLength ? maxCharsContainer.style.color = "green" : maxCharsContainer.style.color = "red"

    if(inputTitle.value.length < maxLength || inputTitle.value || inputTitle.value != "" || inputTitle.value != null){
        formValues.title = inputTitle.value
    }

    if(inputTitle.value.length > maxLength || !inputTitle.value || inputTitle.value === "" || inputTitle.value === null || formValues.category == null || formValues.image == null) { 

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
    formData.append("image", formValues.image)
    formData.append("title", formValues.title)
    formData.append("category", parseInt(formValues.category))

    // for (const value of formData.values()) {
    //     console.log("fillFormData", value);
    // }
}

const publishModifications = async function (projectArrayToDelete, projectToCreateformData) {

    if(projectArrayToDelete.length){
        projectArrayToDelete.forEach(projectToDelete => deleteProject(projectToDelete.id));
    }

    const isCompleted = Object.values(formValues).every(x => x != null && x != '')
    if(isCompleted) {
        createNewProject(projectToCreateformData)
    }
}

const preDeleteProject = function (projectToDeleteId){
    projectToDeleteArray.push(projectsData.filter(project => project.id == projectToDeleteId)[0])
    projectsData = projectsData.filter(project => project.id != projectToDeleteId)
    imgOfPTD = document.getElementById("work_"+projectToDeleteId)
    imgOfPTD.style.filter = "grayscale(1)"
}

//toastType = string
// types : success / warning / error
const popToast = function (toastType){

    toastType == null ? toastType ="warning" : toastType = toastType

    let toast = document.getElementById('edition-toast-'+ toastType)
    toast.classList.remove('d-none')

    setTimeout(() => {
        toast.classList.add('d-none')
      }, "3000")
}

document.querySelectorAll('.edition-modal').forEach(item =>{
    item.addEventListener('click', openModal);
})

document.getElementById('login-link').addEventListener('click', chargeLoginSection)


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


