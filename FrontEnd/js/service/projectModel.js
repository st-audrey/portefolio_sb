async function getProjects(){

    await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })
    
        .then(function (response) {
            return response.json()
        })
        
        .then(function (data) {
            data.forEach(item => {
                project = new Project(item)
                projectsData.push(project) 
            })

            dispatchProjects(projectsData, "toGallery")

        })
        
        .catch(function (err) {
            console.warn('Something went wrong with works', err)
        })
}


async function createNewProject(projectToCreateformData){

    let token = localStorage.getItem('token')

    await fetch('http://localhost:5678/api/works', {

             method: 'POST',
             headers: new Headers({'Authorization' : `Bearer ${token}`}),
             body: projectToCreateformData
        })

        .then((response) => {
            if (response.status == 400 || response.status == 401 || response.status == 500) {

             popToast("error")

            }else{
                response.json()
                popToast("success")
                return response
            }
        })
        
        .catch(function (err) {
            console.warn('Something went wrong with works', err)
        })
}

async function deleteProject(projectId){

    let token = localStorage.getItem('token')

    await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization' : `Bearer ${token}`,
            'Accept': 'application/json'
        })
    })
    .then((response) => {
        if (response.status == 400 || response.status == 401 || response.status == 500) {
            popToast("error")
        }
        // response.json()
        popToast("success")
        return response
    })
    
    .catch(function (err) {
        console.warn('Something went wrong with works', err)
    })
}