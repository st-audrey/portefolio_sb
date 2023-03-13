 async function getCategories(){

    await fetch('http://localhost:5678/api/categories', { 
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }})
            
        .then((response) => {
            if (response.status == 500) {
                throw new Error("Servor error responses")
            }
            return response.json()
        }).then((response) => {
            console.log("toto")
            let loggin = checkLoggedIn()

            if(loggin){
                return response

            }else{
                response.forEach(item => {
                    categorie = new Category(item)
                    categories.push(categorie) 
                });

                console.log(categories)
                createFilters()
            }

    }).catch((error) => {
        console.warn('Something went wrong with categories', err)
    })
}