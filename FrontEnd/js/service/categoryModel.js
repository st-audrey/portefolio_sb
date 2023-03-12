async function getCategories(){
    return fetch('http://localhost:5678/api/categories')

    .then((response)=>response.json())

    .then(function (data) {
        let loggin = checkLoggedIn()
        if(loggin){
            return data
        }else{
            data.forEach(item => {
                categorie = new Category(item)
                categories.push(categorie) 
            });
            createFilters()
        }

    }).catch(function (err) {
        console.warn('Something went wrong with categories', err);
    });
}
