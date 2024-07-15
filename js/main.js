const apiKey = 'c97fb0e18017e64531ce14839b78a6e4';
const movieId = 550; // Example movie ID
var base_url=`https://api.themoviedb.org/3/movie/`;
var search_url="https://api.themoviedb.org/3/search/keyword";
var Links = document.querySelectorAll(".links a");
var Movies;
var forMovies=document.getElementById('forMovies');
var apiUrl = 'now_playing';
var selectedValue = null;
getApi();
// ----------------------------------------search----------------------------------------

document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        console.log('Enter key pressed!');
        getQuery();
    }
});
function getQuery(){
    const query = document.querySelector('.form-control').value;
        if (query.length >= 3) {
        searchMovie(query);
    } else {
        alert('Please enter more than 3 characters.');
    }
}

function back(){
    location.href='index.html';
    document.getElementById("search-results").classList.replace("d-flex","d-none");
}
// function searchMovie(query) {
//     var str='';
//     var resultsDiv = document.getElementById('results');
//     fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.results && data.results.length > 0) {
//                 displayResults(data.results);
//             } else {
//                 str=`<div class="alert alert-primary" role="alert">
//             No movies found
//             </div>`
//             }
//         })
//         .catch(error => console.error('Error:', error));
//         resultsDiv.innerHTML = str;
// }
async function searchMovie(query) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="d-flex justify-content-center my-5"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';

    try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        await displayResults(data.results);
    } else {
        resultsDiv.innerHTML = `
        <div class="alert alert-primary" role="alert">
            No movies found
        </div>
        `;
    }
    } catch (error) {
    console.error('Error:', error);
    resultsDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
        An error occurred while searching for movies.
        </div>
    `;
    }
}

function displayResults(searchMovies) {
    document.getElementById("carouselExampleControlsNoTouching").classList.replace("d-flex", "d-none");
    document.getElementById("search-results").classList.replace("d-none", "d-flex");
    var resultsDiv = document.getElementById('results');
    var str = '';
    for (let i = 0; i < searchMovies.length; i++) {
        // Check if the poster_path is valid before adding the image
        if (searchMovies[i].poster_path) {
            str += `
            <div class="col-md-3 p-3">
                <img class="img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${searchMovies[i].poster_path}" alt="${searchMovies[i].title}" data-movie="${encodeURIComponent(JSON.stringify(searchMovies[i]))}">
            </div>
            `;
        } else {
            console.log(`Skipping movie ${searchMovies[i].title} due to missing or invalid poster_path.`);
        }
    }
    resultsDiv.innerHTML = str; 
    // console.log(resultsDiv);

// dataset is a property of the DOM element that provides access to all the custom data attributes (attributes starting with data-) on the element.
// dataset.movie specifically refers to the value of the data-movie attribute of the current <img> element.
    document.querySelectorAll('#results .col-md-3 img').forEach(img => {
        img.addEventListener('click', function() {
            movieDetails(this.dataset.movie);
        });
    });
}

// ----------------------------------------sidebar links----------------------------------------

function openNav() {
    if(document.getElementById("mySidebar").style.width == "0px"){
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.querySelector("#main button").innerHTML="&times";
    }else{
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.querySelector("#main button").innerHTML="☰";
    }
}

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

// ----------------------------------------API----------------------------------------

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
        document.querySelector(".carousel-control-prev").classList.replace("d-none","d-block");
        document.querySelector(".carousel-control-next").classList.replace("d-none","d-block");
        NowPlayingMovies();
    }else{
        str=`<div class="alert alert-primary" role="alert">
            No movies found
            </div>`
        document.querySelector(".carousel-control-prev").classList.replace("d-block","d-none");
        document.querySelector(".carousel-control-next").classList.replace("d-block","d-none");
        forMovies.innerHTML = str;
    }
    // console.log(Movies)
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

// ----------------------------------------Home----------------------------------------

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
            <div class="col-md-3 p-3">
                <img class="img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${Movies[i].poster_path}" alt="poster" data-movie="${encodeURIComponent(JSON.stringify(Movies[i]))}">
            </div>
        `;
        // console.log(Movies[i]);
    }
    str += '</div></div>'; // Close the last carousel-item and row
    forMovies.innerHTML = str;
    // Add click event listener to the images
    document.querySelectorAll('#forMovies .col-md-3 img').forEach(img => {
        img.addEventListener('click', function() {
            movieDetails(this.dataset.movie);
        });
    });
}

var movieDetailsBox = document.querySelector('#movie-details-container')
function movieDetails(item){
    console.log("clicked");
    item = JSON.parse(decodeURIComponent(item)); // Decode the URI component
    console.log(item);
    movieDetailsBox.classList.replace('d-none', 'd-flex')
    document.getElementById("movie-box-img").src=`https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
    document.getElementById("movie-title").innerHTML=`${item.original_title}`;
    document.getElementById("lang").innerHTML=`Language : ${item.original_language}`;
    document.getElementById("avg-votes").innerHTML=`Votes : ${item.vote_average}`;
    document.getElementById("release-date").innerHTML=`Release date : ${item.release_date}`;
    document.getElementById("overview").innerHTML=`${item.overview}`;
}

function closewindow(){
    movieDetailsBox.classList.replace('d-flex', 'd-none')
}

//  {
//       "adult": false,
//       "backdrop_path": "/fDmci71SMkfZM8RnCuXJVDPaSdE.jpg",
//       "genre_ids": [
//         16,
//         10751,
//         35,
//         28
//       ],
//       "id": 519182,
//       "original_language": "en",
//       "original_title": "Despicable Me 4",
//       "overview": "Gru and Lucy and their girls — Margo, Edith and Agnes — welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Meanwhile, Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, forcing the family to go on the run.",
//       "poster_path": "/3w84hCFJATpiCO5g8hpdWVPBbmq.jpg",
//       "release_date": "2024-06-20",
//       "title": "Despicable Me 4",
//       "vote_average": 7.512,
//       "vote_count": 241
//     },


// ----------------------------------------validation----------------------------------------
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the form field values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var age = document.getElementById('age').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    // Define the regular expressions for validation
    var nameRegex = /^[a-zA-Z\s]+$/;
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
    var ageRegex = /^\d+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate the form fields
    if (!nameRegex.test(name)) {
        alert('Please enter a valid name.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number.');
        return;
    }

    if (!ageRegex.test(age) || parseInt(age) < 18) {
        alert('Please enter a valid age (18 or above).');
        return;
    }

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Password and Confirm Password must match.');
        return;
    }

    // If all validations pass, submit the form
    alert('Form submitted successfully!');
    this.submit();
});