// Variable Declaration

/* DELETE THIS */ KEY = "CAlVNchmiB7bFLzxzpZ97ZXKwHKn1_ijwniyRSHKJxE";

const accessKey = KEY;

// Starter Function
displayCachedPosts();

// Event Listeners
document.querySelector("#btn-submit").addEventListener('click', () => {
    const post_id = localStorage.getItem('entries');
    const title = document.querySelector("#destination").value;
    const dest_location = document.querySelector("#location").value;
    const description = document.querySelector("#description").value;

    document.querySelector("#destination").value = "";
    document.querySelector("#location").value = "";
    document.querySelector("#description").value = "";

    // validation
    if (title == "" || dest_location == "") {
        alert("Please complete all required fields.")
    }
    else {
        add_post(title, dest_location, description, post_id)
    }
})

// Business Functions
function add_post(title, dest_location, description, post_id) {
    storePost(title, dest_location, description, post_id);
    displayPost(localStorage.getItem(post_id));

    localStorage.setItem('entries', parseInt(post_id) + 1);
}

function storePost(title, dest_location, description, post_id) {
    localStorage.setItem(post_id, [title, dest_location, description, post_id]);
}

function displayLocalStorage(cached=true) { 
    for (var i = 0; i < parseInt(localStorage.entries); i++) {
        if (localStorage.getItem(i) === null) continue;

        var cached_post = localStorage.getItem(i);
        
        displayPost(cached_post, cached); // JSON.parse() can be used here instead
    }
}

function displayPost(post_string, cached) { // cached is tracking whether 
    // declare variables
    const post = post_string.split(',');
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
    titleDiv.textContent = post[0];
    locationDiv.textContent = post[1];
    contentPara.textContent = post[2];
    editBtn.textContent = "Edit";
    removeBtn.textContent = "Remove";

    // add id
    containersDiv.id = "container-" + post[3];

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
    loadImg(imageSectionDiv, post[0], true, cached);
}

function loadImg(obj, search, new_post, cached=false) {
    // if (cached) {
    //     obj.src = obj.src;
    //     console.log(obj);
    //     return;
    // }

    const url = `https://api.unsplash.com/search/photos?query=${search}&per_page=50&page=1&client_id=${KEY}`;
    const latest_post_id = String(parseInt(localStorage.getItem('entries'))); //
    const latest_post = localStorage.getItem(latest_post_id);

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const randomNum = Math.floor(Math.random() * data.results.length - 1);
            
            for (let i = 0; i < data.results.length; i++) {
                if (i == randomNum) {
                    let img_result = data.results[i].urls.thumb;
                    if (new_post) {
                        let image_element = document.createElement('img');
                        image_element.src = img_result;
                        obj.appendChild(image_element);
                    }
                    else { // if user is editing post and calling for new photo
                        obj.src = img_result;
                    }
                    //var new_entry = latest_post + "," + String(obj.src);
                    //localStorage.setItem(latest_post_id, new_entry);
                    localStorage.setItem(latest_post_id, latest_post);
                }
            }
        })
}

function editContents(obj) {
    // const declaration
    const obj_container = obj.parentNode.parentNode.parentNode; 
    const image_section = obj_container.children[0]; // .containers.image-section
    const image_info = obj_container.children[1];    // . containers.image-info
    const destination = prompt("Enter name of attraction");
    const dest_location = prompt("Enter location of attraction"); 
    const description = prompt("Enter description");

    // conditionals
    if (destination) {
        image_info.children[0].textContent = destination
        loadImg(image_section.firstChild, destination, false);
    }
    if (dest_location) image_info.children[1].textContent = dest_location; 
    if (description) image_info.children[2].textContent = description;

}

function removeEntry(obj) {
    parent_node = obj.parentNode.parentNode.parentNode;
    parent_node.remove(); // parent container of post
    
    localStorage.removeItem(parent_node.id.split('-')[1]);
}

// Helper Functions
function displayCachedPosts() {
    if (localStorage.length === 0) { localStorage.setItem("entries", '0') }
    else onload = () => { displayLocalStorage() }
}

function createDiv() {
    return document.createElement("div");
}