class Project {
    constructor(obj) {
        this.category = obj.category;
        this.categoryId = obj.categoryId;
        this.id = obj.id;
        this.imageUrl = obj.imageUrl;
        this.title = obj.title;
        this.userId = obj.userId;
    }

    addToGallery(gallery) {
        let project = document.createElement('figure');
        let projectImage = document.createElement('img');
        let projectText = document.createElement('figcaption');
    
        projectImage.setAttribute('src', this.imageUrl);
        projectText.innerHTML += this.title;

        project.append(projectImage, projectText);
        gallery.appendChild(project);
    }

    addToModal(modal, displayMoveIcon) {
        //TODO : add class not style
        let project = document.createElement('div')
        let projectImage = document.createElement('img')
        let projectEditionLink = document.createElement('a')
        let iconContainer = document.createElement('div') 
        let deleteIcon = document.createElement('i')
    
        project.classList.add('modal-work-container')

        projectImage.setAttribute('src', this.imageUrl)
        projectImage.classList.add('modal-img-project')
        projectImage.setAttribute('id', "work_"+ this.id)

        projectEditionLink.setAttribute( 'href', '#')
        projectEditionLink.classList.add('modal-edition-link')
        projectEditionLink.innerHTML = "éditer"

        iconContainer.classList.add('modal-icon-container')

        deleteIcon.classList.add('fa-solid')
        deleteIcon.classList.add('fa-trash-can')
        deleteIcon.classList.add('modal-edition-icon')
        deleteIcon.addEventListener('click', () => { 
            preDeleteProject(this.id)
        })
        
        if(displayMoveIcon){
            let moveIcon = document.createElement('i')

            moveIcon.classList.add('fa-solid')
            moveIcon.classList.add('fa-arrows-up-down-left-right')
            moveIcon.classList.add('modal-edition-icon')

            iconContainer.append(moveIcon)
        } 
        
        iconContainer.append(deleteIcon)
        project.append( iconContainer, projectImage, projectEditionLink)

        modal.appendChild(project)
    }
}


