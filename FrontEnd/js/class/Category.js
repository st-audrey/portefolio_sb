class Category {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
    }

    addToFiltersContainer(filtersContainer) {
        let filter = document.createElement('button');
        filter.classList.add('filter-btn')

        filter.addEventListener("click", function(){
            dispatchProjects(projectsData, "toGallery", this.id);
        });
        
        //missing "^" in db
        this.name == "Hotels & restaurants" ? this.name = "Hôtels & restaurants" : this.name

        filter.innerHTML = this.name
        filtersContainer.append(filter)        
    }
}


