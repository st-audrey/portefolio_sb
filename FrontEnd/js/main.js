function getWorks(){
    fetch('http://localhost:5678/api/works').then(function (response) {
        return response.json();

    }).then(function (data) {
        dispatchWorks(data);

    }).catch(function (err) {
        console.warn('Something went wrong with works', err);
    });
}

function getCategories(){
    fetch('http://localhost:5678/api/categories').then(function (response) {
        return response.json();

    }).then(function (data) {
        createFilters(data);

    }).catch(function (err) {
        console.warn('Something went wrong with categories', err);
    });
}

function dispatchWorks(data){
    let gallery = document.getElementById('portfolio').getElementsByClassName('gallery')[0];

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
    allFilters.add("Tous");
    for( i = 0 ; i < data.length ; i++ ){
        allFilters.add(data[i].name);
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
        
        item == "Hotels & restaurants" ? item = "Hôtels & restaurants" : item;

        filter.innerHTML = item;
        filtersContainer.append(filter);
    });   

}


getWorks();
getCategories();