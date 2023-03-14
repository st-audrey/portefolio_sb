const openModal = async function (e) {
    e.preventDefault()
    const target = e.target.getAttribute('href')
    if (target.startsWith("#")){
        modal = document.querySelector(target)
    } else {
        modal = await loadModal(target)
    }
    
    //accessibility
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    focusables[0].focus()
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')

    modal.addEventListener('click', closeModal)
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal)
    modal.querySelector('.edition-modal-stop').addEventListener('click', stopPropagation)

    displayModalStep(1);

    const isCompleted = Object.values(formValues).every(x => x != null && x != '')
    if(isCompleted){
        formValues = {
            image: null,
            title: null,
            category: null
        }
    }
}

const activatePublishButton = function(){
    document.querySelector('#edition-complete').addEventListener('click', function (e) {
        e.preventDefault()
        publishModifications(projectToDeleteArray, formData)
        projectToDeleteArray = []
    });
}

const closeModal = function (e){
    e.preventDefault()
    if ( modal === null ) return
    if ( previouslyFocusedElement !== null ) previouslyFocusedElement.focus()

    const isCompleted = Object.values(formValues).every(x => x != null && x != '')
    if(isCompleted){
        fillFormData()
       
        let imgURL = URL.createObjectURL(formValues.image)
        newProjectForDemo = new Project({
            categoryId: formValues.category,
            imageUrl: imgURL,
            title: formValues.title,
            id: null,
            category: categories[formValues.category],
            userId: localStorage.getItem('userId')
        });

        projectsData.unshift(newProjectForDemo)
    }

    dispatchProjects(projectsData, "toGallery")
    
    if(projectToDeleteArray.length || isCompleted) {
        activatePublishButton()
    }

    let element = document.getElementById('edition-modal-project')
    document.body.removeChild(element)
    modal = null
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
// case 1 "Galerie photo"
// case 2 "Ajouter une photo"
async function displayModalStep(modalStep){

    switch(modalStep){

        case 1 :
            let container = modal.querySelector('#modal-photo-container')
            container.style.display = "grid"
            modal.querySelector('#modal-add-photo').style.display = 'none'
            modal.querySelector('.modal-form-submit').style.display = 'none'
            modal.querySelector('.modal-btn-container').style.justifyContent = "flex-end"
            modal.querySelector('.modal-back-btn').style.display = 'none'
            modal.querySelector('.modal-title').innerHTML = "Galerie photo"
            modal.querySelector('.modal-delete-gallery-btn').style.display == "none" ? modal.querySelector('.modal-delete-gallery-btn').style.display = "flex" : "" 

            modal.querySelector('.modal-add-btn').style.display = "flex"
            modal.querySelector('.modal-add-btn').innerHTML = "Ajouter une photo"
            modal.querySelector('.modal-add-btn').addEventListener('click', (event => {
                displayModalStep(2)
            }));

            if(!container.firstChild){
                dispatchProjects(projectsData, 'toModal')
            }
           
            break;
            
        case 2 :
        
            modal.querySelector('#modal-add-photo').style.display = null
            modal.querySelector('#modal-photo-container').style.display = 'none'

            modal.querySelector('.modal-form-submit').style.display = null
            modal.querySelector('.modal-btn-container').style.justifyContent = "space-between"
            modal.querySelector('.modal-back-btn').style.display = "block"
            modal.querySelector('.modal-back-btn').addEventListener('click', (event => {
                displayModalStep(1)
            }));
            modal.querySelector('.modal-title').innerHTML = "Ajout photo"
            modal.querySelector('.modal-add-btn').style.display = 'none'
            modal.querySelector('.modal-delete-gallery-btn') ? 
            modal.querySelector('.modal-delete-gallery-btn').style.display = 'none' : ""

            modal.querySelector('#modal-upload-field') ? 
            modal.querySelector('#modal-upload-field').addEventListener('change', verifySelectedPhoto) : ""

            let select = document.getElementById('select-category')

            if(!select.firstChild){

                let categoriesPromise = getCategories(); 
                categoriesPromise.then( (categories) => {
                    let defaultOption = new Category({id : 0,name : ""})

                    categories.unshift(defaultOption)

                    categories.forEach(data =>{
                        let option = document.createElement('option')
                        option.setAttribute('value', data.id)
                        option.innerHTML = data.name
                        select.append(option)
                    })

                    select.addEventListener('change', (event) => {
                        formValues.category = select.value
                        enableSubmit()
                    })
                })
            }

            break;
    }
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

//accessibility
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