const apiKey = 'c97fb0e18017e64531ce14839b78a6e4';
const movieId = 550; // Example movie ID
var base_url=`https://api.themoviedb.org/3/movie/`;
var Links = document.querySelectorAll(".links a");
console.log(Links);
var apiUrl = 'now_playing';
getApi();

var selectedValue = null;

// Add click event listener to each link
Links.forEach(function(link) {
    link.addEventListener("click", function(event) {
        selectedValue = this.getAttribute("id");
        if(selectedValue!=="contact"){
            event.preventDefault(); 
            apiUrl=selectedValue;
            // console.log("Selected value:", selectedValue); // Log the selected value
            getApi(apiUrl);
        }
    });
});

var Movies;
var forMovies=document.getElementById('forMovies');
function getApi(apiUrl)
{
    if (!apiUrl) {
        apiUrl = getLastSelectedApiUrl();
        if (!apiUrl) {
            console.error('No API URL provided and no last selected URL found.');
            return;
        }
    } else {
        saveLastSelectedApiUrl(apiUrl);
    }
    fetch(`${base_url}${apiUrl}?api_key=${apiKey}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
        Movies=data.results;
    if (Movies && Movies.length > 0) {
        // console.log(`${base_url}${apiUrl}?api_key=${apiKey}&language=en-US&page=1`);
        document.querySelector(".carousel-control-prev").classList.replace("d-none","d-block");
        document.querySelector(".carousel-control-next").classList.replace("d-none","d-block");
        NowPlayingMovies();
    }else{
        str=`<div class="alert alert-primary" role="alert">
            there is no list
            </div>`
        document.querySelector(".carousel-control-prev").classList.replace("d-block","d-none");
        document.querySelector(".carousel-control-next").classList.replace("d-block","d-none");
        forMovies.innerHTML = str;
    }
    console.log(Movies)
    })
    .catch(error => {
    console.error('Error fetching latest movies:', error);
    });
}
function saveLastSelectedApiUrl(apiUrl) {
    localStorage.setItem('lastSelectedApiUrl', apiUrl);
}
function getLastSelectedApiUrl() {
    return localStorage.getItem('lastSelectedApiUrl');
}

function NowPlayingMovies() {
        // console.log(`${base_url}${apiUrl}?api_key=${apiKey}&language=en-US&page=1`);
    var str = '';
    for (let i = 0; i < Movies.length; i++) {
        if (i % 4 === 0) {
            if (i === 0) {
                str += '<div class="carousel-item active "><div class="row g-2">';
            } else {
                str += '</div></div><div class="carousel-item"><div class="row g-2">';
            }
        }
        str += `
            <div class="col-md-3 p-3 ">
                <img class="img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${Movies[i].poster_path}" alt="poster" onclick="movieDetails(${i})">
            </div>
        `;
    }
    str += '</div></div>'; // Close the last carousel-item and row
    forMovies.innerHTML = str;
}

function movieDetails(i){
    
}

function openNav() {
    if(document.getElementById("mySidebar").style.width == "0px"){
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.querySelector("#main button").innerHTML="&times";
        // console.log(document.querySelector("#main button").innerHTML)
    }else{
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.querySelector("#main button").innerHTML="☰";
    }
}
