// Variable Declaration

/* DELETE THIS */ KEY = "CAlVNchmiB7bFLzxzpZ97ZXKwHKn1_ijwniyRSHKJxE";
var posts = localStorage.length + 1;

var image;
var title;
var location;
var description;

const postsDiv = document.querySelector("#posts-content");
const submitEntryBtn = document.querySelector("#btn-submit");

const accessKey = KEY;

// Event Listeners
onload = () => { loadLocalStorage() };

submitEntryBtn.addEventListener('click', () => {
    title = document.querySelector("#destination").value;
    document.querySelector("#destination").value = "";

    dest_location = document.querySelector("#location").value;
    document.querySelector("#location").value = "";

    description = document.querySelector("#description").value;
    document.querySelector("#description").value = "";

    // validation
    if (title == "" || dest_location == "") {
        alert("Please complete all required fields.")
    }
    else {
        storePost(title, dest_location, description);
    }
})

// Business Functions
function loadLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        var cached_post = localStorage.getItem(localStorage.key(i));

        insertNewPost(cached_post.split(','));
    }
}

function storePost(title, dest_location, description) {
    localStorage.setItem(posts, [title, dest_location, description]);

    insertNewPost(localStorage.getItem(posts).split(','));

    posts += 1;
}

function insertNewPost(post, cached=false) {
    // .containers
    const containersDiv = createDiv();
    containersDiv.classList.add("containers");
    containersDiv.id = "container-" + (posts - 1);

    // .image-section
    const imageSectionDiv = createDiv();
    imageSectionDiv.classList.add("image-section");
    imageSectionDiv.id = "post-" + posts;

    // .image-info
    const imageInfo = createDiv();
    imageInfo.classList.add("image-info");

    const titleDiv = document.createElement("h1");
    titleDiv.textContent = post[0];

    const locationDiv = document.createElement("h3");
    locationDiv.textContent = post[1];

    const contentPara = document.createElement("p");
    contentPara.textContent = post[2];

    // .img-btns
    const buttonsDiv = createDiv();
    buttonsDiv.classList.add("img-btns");

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn-edit");
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn-remove");
    removeBtn.textContent = "Remove";

    // Attach Divs
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(removeBtn);

    imageInfo.appendChild(titleDiv);
    imageInfo.appendChild(locationDiv);
    imageInfo.appendChild(contentPara);
    imageInfo.appendChild(buttonsDiv);

    containersDiv.appendChild(imageSectionDiv);
    containersDiv.appendChild(imageInfo);
    
    postsDiv.appendChild(containersDiv);

    // add event listeners
    editBtn.addEventListener('click', (e) => editContents(e.target))
    removeBtn.addEventListener('click', (e) => removeEntry(e.target))

    loadImg(imageSectionDiv, title, true, cached);
}

function loadImg(obj, search, first_entry, cached=false) {
    const url = `https://api.unsplash.com/search/photos?query=${search}&per_page=30&page=1&client_id=${KEY}`;

    if (cached) {
        obj.src = cached;
        return
    }

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const randomNum = Math.floor(Math.random() * data.results.length - 1);
            
            for (let i = 0; i < data.results.length; i++) {
                if (i == randomNum) {
                    let img_result = data.results[i].urls.thumb;
                    if (first_entry) {
                        let image_element = document.createElement('img');
                        image_element.src = img_result;
                        obj.appendChild(image_element);
                    }
                    else {
                        obj.src = img_result;
                    }
                    var new_entry = localStorage.getItem(posts - 1) + obj.src;
                    localStorage.setItem(posts - 1, new_entry)
                }
            }
        })
}

function editContents(obj) {
    const obj_container = obj.parentNode.parentNode.parentNode; 
    const image_section = obj_container.children[0]; // .containers.image-section
    const image_info = obj_container.children[1];    // . containers.image-info

    const destination = prompt("Enter name of attraction");
    const dest_location = prompt("Enter location of attraction"); 
    const description = prompt("Enter description");

    if (destination) image_info.children[0].textContent = destination;
    if (dest_location) image_info.children[1].textContent = dest_location; 
    if (description) image_info.children[2].textContent = description;

    loadImg(image_section.firstChild, destination);
}

function removeEntry(obj) {
    parent_node = obj.parentNode.parentNode.parentNode;
    parent_node.remove(); // parent container of post
    
    console.log(parent_node.id.split('-')[1]);
    localStorage.removeItem(parent_node.id.split('-')[1]);
    console.log(localStorage);
}

// Helper Functions
function createDiv() {
    return document.createElement("div");
}