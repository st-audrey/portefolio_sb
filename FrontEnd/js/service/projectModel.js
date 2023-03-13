async function getProjects(){
    fetch('http://localhost:5678/api/works').then(function (response) {
        return response.json();

    }).then(function (data) {
        data.forEach(item => {
            project = new Project(item)
            projectsData.push(project) 
        });
        dispatchProjects(projectsData, "toGallery")

    }).catch(function (err) {
        console.warn('Something went wrong with works', err)
    });
}

const createNewProject = async function (projectToCreateformData){

    let token = localStorage.getItem('token');

    let response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: new Headers({
            'Authorization' : `Bearer ${token}`,
            }),
            body: projectToCreateformData
    });

    let result = await response.json()
    return result
}

async function deleteProject(projectId){
    //TODO : gérer les erreurs
    let token = localStorage.getItem('token')

    let response = await fetch(`http://localhost:5678/api/works/${projectId}`, {

        method: 'DELETE',
        headers: new Headers({
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        })
    });
        
    let result = await response.json()
    return result
}