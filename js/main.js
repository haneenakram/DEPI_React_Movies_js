const apiKey = 'c97fb0e18017e64531ce14839b78a6e4';
const movieId = 550; // Example movie ID
var base_url=`https://api.themoviedb.org/3/movie/`;
var Links = document.querySelectorAll(".links a");
console.log(Links);
var apiUrl = 'now_playing';
getApi(apiUrl);

var selectedValue = null;

// Add click event listener to each link
Links.forEach(function(link) {
    link.addEventListener("click", function(event) {
        selectedValue = this.getAttribute("id");
        if(selectedValue!=="contact"){
            event.preventDefault(); 
            apiUrl=selectedValue;
            console.log("Selected value:", selectedValue); // Log the selected value
            getApi(apiUrl);
        }
    });
});

// async function ApiCall(request, options) {
//     const response = fetch(request, options)
//     .then((response) => response.json())
//     .then((response) => response)
//     .catch((err) => console.error(err));
//     return response;
// }
var nowplayingmovies;
function getApi(apiUrl)
{
    fetch(`${base_url}${apiUrl}?api_key=${apiKey}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
        nowplayingmovies=data.results;
    // console.log(data.results);
    if (nowplayingmovies && nowplayingmovies.length > 0) {
            NowPlayingMovies();
        }
    else{
        str=`<div class="alert alert-primary" role="alert">
            there is no list
            </div>`
        document.getElementById('carouselExampleControlsNoTouching').innerHTML = str;
    }
    console.log(nowplayingmovies)
    })
    .catch(error => {
    console.error('Error fetching latest movies:', error);
    });
}



function NowPlayingMovies() {
    var str = '';
    for (let i = 0; i < nowplayingmovies.length; i++) {
        if (i % 4 === 0) {
            if (i === 0) {
                str += '<div class="carousel-item active "><div class="row g-2">';
            } else {
                str += '</div></div><div class="carousel-item"><div class="row g-2">';
            }
        }
        str += `
            <div class="col-md-3 p-3 ">
                <img class="img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${nowplayingmovies[i].poster_path}" alt="poster">
            </div>
        `;
    }
    str += '</div></div>'; // Close the last carousel-item and row
    document.getElementById('forMovies').innerHTML = str;
}


for (let index = 0; index < array.length; index++) {
    const element = array[index];
    
}


function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    }