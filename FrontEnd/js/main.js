function getWorks(){
    fetch('http://localhost:5678/api/works').then(function (response) {
        return response.json();

    }).then(function (data) {
        console.log(data);
        dispatchWorks(data);

    }).catch(function (err) {
        console.warn('Something went wrong.', err);
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

getWorks();