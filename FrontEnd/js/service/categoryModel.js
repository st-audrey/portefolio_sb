 async function getCategories(){
    try {
        const response = await fetch('http://localhost:5678/api/categories', { 
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }})
                
        if (response.status == 500) {
            throw new Error("Servor error responses")
        }
        const json = await response.json()

        let loggin = checkLoggedIn()

        if(loggin){
            return json

        }else{
            json.forEach(item => {
                categorie = new Category(item)
                categories.push(categorie) 
            });

            console.log(categories)
            createFilters()
        }
    }
    catch(error) {
        console.warn('Something went wrong with categories', err)
    }
}