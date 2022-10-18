const KEY = "wtq3TnpbUIM1zklxhd2X6mpOZViWnD-5FrORsZgivWQ";

// Starter Function
displayCachedPosts();

// Event Listeners
document.querySelector("#btn-submit").addEventListener('click', () => {
    const post_id = localStorage.getItem('entries');
    const title = document.querySelector("#destination").value;
    const dest_location = document.querySelector("#location").value;
    const description = document.querySelector("#description").value;

    // validation
    if (title == "" || dest_location == "") {
        alert("Please complete all required fields.")
    }
    else {
        document.querySelector("#destination").value = "";
        document.querySelector("#location").value = "";
        document.querySelector("#description").value = "";

        add_post(post_id, title, dest_location, description)
    }
})

// Business Functions
function add_post(post_id, title, dest_location, description ) {
    storePost(post_id, title, dest_location, description);
    displayPost(localStorage.getItem(post_id));

    let entry = parseInt(post_id) + 1;
    localStorage.setItem('entries', entry); // Increase entries id by 1
}

function storePost(post_id, title, dest_location, description) {
    const new_entry = JSON.stringify({
        'title': title,
        'dest_location': dest_location,
        'description': description,
        'post_id': post_id
    });

    localStorage.setItem(post_id, new_entry);
}

function displayLocalStorage() { 
    for (var i = 0; i < localStorage.getItem('entries'); i++) {
        if (localStorage.getItem(i) === null) continue;

        var cached_post = localStorage.getItem(i);
        
        displayPost(cached_post); 
    }
}

function displayPost(postObj) { // cached is tracking whether 
    // declare variables
    const post = JSON.parse(postObj);
    const postsDiv = document.querySelector("#posts-content");
    const containersDiv = createDiv();
    const imageSectionDiv = createDiv();
    const imageInfo = createDiv();
    const titleDiv = document.createElement("h1");
    const locationDiv = document.createElement("h3");
    const contentPara = document.createElement("p");
    const buttonsDiv = createDiv();
    const editBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    // add class
    containersDiv.classList.add("containers");
    imageSectionDiv.classList.add("image-section");
    imageInfo.classList.add("image-info");
    buttonsDiv.classList.add("img-btns");
    editBtn.classList.add("btn-edit");
    removeBtn.classList.add("btn-remove");
            
    // change textContent
    titleDiv.textContent = post.title;
    locationDiv.textContent = post.dest_location;
    contentPara.textContent = post.description;
    editBtn.textContent = "Edit";
    removeBtn.textContent = "Remove";

    // add id
    containersDiv.id = "container-" + post.post_id;

    // appendChild
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(removeBtn);
    imageInfo.appendChild(titleDiv);
    imageInfo.appendChild(locationDiv);
    imageInfo.appendChild(contentPara);
    imageInfo.appendChild(buttonsDiv);
    containersDiv.appendChild(imageSectionDiv);
    containersDiv.appendChild(imageInfo);
    postsDiv.appendChild(containersDiv);

    // add eventListener
    editBtn.addEventListener('click', (e) => editContents(e.target))
    removeBtn.addEventListener('click', (e) => removeEntry(e.target))

    // function calls
    loadImg(imageSectionDiv, post.title, true);
}

function loadImg(obj, search, new_post) {
    // const url = `https://api.unsplash.com/photos/random?query=${search}&per_page=50&page=1&client_id=${KEY}`;
    const url = "";

    unsplashAPICall(url).then(data => {
        let img_result = data.urls.thumb;
            if (new_post) {
                let image_element = document.createElement('img');
                image_element.src = img_result;
                obj.appendChild(image_element);
            }
            else { // if user is editing post - doesn't need new img element
                obj.src = img_result;
            }
        })
}

async function unsplashAPICall(url) {
    const request = await fetch(url);
    const data = await request.json();
    return data;
}

function editContents(obj) {
    // const declaration
    const obj_container = obj.parentNode.parentNode.parentNode; 
    const image_section = obj_container.children[0]; // .containers.image-section
    const image_info = obj_container.children[1];    // . containers.image-info
    const destination = prompt("Enter name of attraction");
    const dest_location = prompt("Enter location of attraction"); 
    const description = prompt("Enter description");

    
    image_info.children[0].textContent = destination
    image_info.children[1].textContent = dest_location; 
    image_info.children[2].textContent = description;

    loadImg(image_section.firstChild, destination, false);
    storePost(obj_container.id.split('-')[1], destination, dest_location, description);
}

function removeEntry(obj) {
    const parent_node = obj.parentNode.parentNode.parentNode;
    parent_node.remove(); // parent container of post
    
    localStorage.removeItem(parent_node.id.split('-')[1]);
    let new_num = parseInt(localStorage.getItem('entries')) - 1;
    localStorage.setItem('entries',  new_num);
}

// Helper Functions
function displayCachedPosts() {
    if (localStorage.length === 0) { localStorage.setItem("entries", "0") }
    else onload = () => { displayLocalStorage() }
}

function createDiv() {
    return document.createElement("div");
}