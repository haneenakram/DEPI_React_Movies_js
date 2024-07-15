const apiKey = 'c97fb0e18017e64531ce14839b78a6e4';
const movieId = 550; // Example movie ID
var base_url=`https://api.themoviedb.org/3/movie/`;
var search_url="https://api.themoviedb.org/3/search/keyword";
var Links = document.querySelectorAll(".links a");
var Movies;
var forMovies=document.getElementById('forMovies');
var apiUrl = 'now_playing';
var selectedValue = null;
var title =document.getElementById("categoryTitle");

getApi(apiUrl,"home");
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
    title.innerHTML=`<span class="text-light fs-5 "> The results about: </span>${query} `

    } else {
        alert('Please enter more than 3 characters.');
    }
}

function back(){
    location.href='index.html';
    document.getElementById("search-results").classList.replace("d-flex","d-none");
}

async function searchMovie(query) {
    // const resultsDiv = document.getElementById('results');
    // resultsDiv.innerHTML = '<div class="d-flex justify-content-center my-5"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>';

    try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        await displayResults(data.results);
    } else {
        document.getElementById("search-results").classList.replace("d-none", "d-flex");
        forMovies.innerHTML = `
        <div class="alert alert-dark text-light text-center" role="alert">
            No movies found
        </div>
        `;
    }
    } catch (error) {
    document.getElementById("search-results").classList.replace("d-none", "d-flex");
    console.error('Error:', error);
    forMovies.innerHTML = `
        <div class="alert alert-dark text-light text-center" role="alert">
            No movies found 
        </div>
    `;
    }
}

function displayResults(searchMovies) {
    document.getElementById("search-results").classList.replace("d-none", "d-flex");
    // var resultsDiv = document.getElementById('results');
    var str = '';
    for (let i = 0; i < searchMovies.length; i++) {
        if (searchMovies[i].poster_path) {
            console.log(searchMovies[i])
            str += `
            <div class="col-md-3 p-3">
                <div class="movieBox position-relative" onclick="getApi(${searchMovies[i].id},'movie details')">
                    <img class="main-img img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${searchMovies[i].poster_path}" alt="poster" >
                    <div class="p-0 m-0 movieDetails position-absolute d-flex flex-column justify-content-around">
                        <img src="https://image.tmdb.org/t/p/w500${searchMovies[i].backdrop_path}" class='w-100 h-100 position-absolute'> 
                        <div class="content w-100 h-100 p-2">
                            <h5 class="text-center d-flex flex-nowrap">${searchMovies[i].original_title}</h5>
                            <span class="me-3">${searchMovies[i].vote_average}</span>
                            <span>${searchMovies[i].release_date}</span>
                            <p w-inherit>${searchMovies[i].overview}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            console.log(`Skipping movie ${searchMovies[i].title} due to missing or invalid poster_path.`);
        }
    }
    forMovies.innerHTML = str; 
    // document.querySelectorAll('#results .col-md-3 img').forEach(img => {
    //     img.addEventListener('click', function() {
    //         movieDetails(this.dataset.movie);
    //     });
    // });
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
            title.innerHTML=selectedValue
            // console.log("Selected value:", selectedValue); // Log the selected value
            getApi(apiUrl,"home");
        }
    });
});

// ----------------------------------------API----------------------------------------

function getApi(apiUrl,destination)
{
    // console.log(`${base_url}${apiUrl}?api_key=${apiKey}&language=en-US&page=1`)
    // console.log(destination)
    // console.log("fel getapi")

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
        // console.log(data);
        // if (Movies && Movies.length > 0) {
        if(destination=="home")
            {
            Movies=data.results;
            NowPlayingMovies();
            console.log("gowa home")
        }
        else if(destination =="movie details"){
            // console.log("gowa movie details")
            movieDetails(data);
        }
    // }
    else{
        str=`<div class="alert alert-primary" role="alert">
            No movies found
            </div>`;
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
    var str = '';
    for (let i = 0; i < Movies.length; i++) {
        //data-movie="${encodeURIComponent(JSON.stringify(Movies[i]))}""
        // console.log(`${base_url}${Movies[i].id}?api_key=${apiKey}&language=en-US&page=1`)
        // console.log(Movies[i].id);
        str += `
            <div class="col-md-3 p-3">
                <div class="movieBox position-relative" onclick="getApi(${Movies[i].id},'movie details')">
                    <img class="main-img img-fluid object-fit-fill w-100 object-fit-cover" src="https://image.tmdb.org/t/p/w500${Movies[i].poster_path}" alt="poster" >
                    <div class="p-0 m-0 movieDetails position-absolute d-flex flex-column justify-content-around">
                        <img src="https://image.tmdb.org/t/p/w500${Movies[i].backdrop_path}" class='w-100 h-100 position-absolute'> 
                        <div class="content w-100 h-100 p-2">
                            <h5 class="text-center d-flex flex-nowrap">${Movies[i].original_title}</h5>
                            <span class="me-3">${Movies[i].vote_average}</span>
                            <span>${Movies[i].release_date}</span>
                            <p w-inherit>${Movies[i].overview}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    forMovies.innerHTML = str;
    // console.log(document.querySelectorAll('.movieBox'))
    
        // document.querySelectorAll('.movieBox ').forEach((item) => {
        //     // console.log('Adding event listener to:', item);
        //     item.onclick=()=>{
        //         console.log(item)
        //         // console.log(item.dataset);
        //         //item.dataset.movie

        //         // getApi(item.dataset.movie,"movie details")
        //     }
        // });
}

var movieDetailsBox = document.querySelector('#movie-details-container')
function movieDetails(data){
    // console.log("clicked");
    // item = JSON.parse(decodeURIComponent(item)); // Decode the URI component
    // console.log(data);
    movieDetailsBox.classList.replace('d-none', 'd-flex');
    let genres = data.genres.map((genre) => genre.name).join(", ");
    let productionCompanies = data.production_companies
        .map((company) => company.name)
        .join(", ");
        let str = `
        <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card bg-dark text-white border-0">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h2>${data.title}</h2>
                <i class="fa-regular fa-circle-xmark" id="close-icon" onclick="closewindow()"></i>
            </div>
            <div class="card-body">
                <div class="row">
                <div class="col-md-4">
                    <img
                    src="https://image.tmdb.org/t/p/w500${data.poster_path}"
                    alt="${data.title}"
                    class="img-fluid rounded"
                    />
                </div>
                <div class="col-md-8">
                    <p class="text-muted">${data.tagline}</p>
                    <p><strong>Overview:</strong> ${data.overview}</p>
                    <p><strong>Genres:</strong> ${genres}</p>
                    <p><strong>Release Date:</strong> ${data.release_date}</p>
                    <p><strong>Runtime:</strong> ${data.runtime} minutes</p>
                    <p><strong>Rating:</strong> ${
                    data.vote_average
                    } <i class="fas fa-star text-warning"></i> (${
        data.vote_count
    } votes)</p>
                    <p><strong>Production Companies:</strong> ${productionCompanies}</p>
                    <p><strong>Budget:</strong> $${data.budget.toLocaleString()}</p>
                    <p><strong>Revenue:</strong> $${data.revenue.toLocaleString()}</p>
                    <a href="${
                    data.homepage
                    }" class="btn btn-primary">Official Website</a>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `;
    movieDetailsBox.innerHTML = str;
}

function closewindow(){
    movieDetailsBox.classList.replace('d-flex', 'd-none')
}


// ----------------------------------------validation----------------------------------------

/*Contact Validation*/
let praintAlert = (id, msg, show=true)=>{
  if(show){
    $(id).html(`
      <div class="alert alert-danger" role="alert">
        ${msg}
      </div>`
    );
  }else{
    $(id).html(``);
  }
}
let addValidationClass = (elem, valid=true)=>{
    if(valid){
      $(elem).removeClass('is-invalid')
      $(elem).addClass('is-valid')
    }else{
      $(elem).addClass('is-invalid')
      $(elem).removeClass('is-valid')
    }
}

/*Validate User Name*/
const username = document.getElementById('username')
username.addEventListener('input', function(e){
  e.preventDefault();
  usernameValidation(this.value)
  removeDisabled()
})

let usernameValidation = (value)=>{
    let RegExp = /^[\w\s_\.@]{4,20}$/;
    if(value != undefined){
        if(!RegExp.test(value)){
        addValidationClass(username, false)
        if(value == '' || value.length == 0){
            praintAlert('#alertName', '', false)
        }
        else if(value.length < 4){
            praintAlert('#alertName', 'Your name should be 4 characters at less')
        }else if(value.length > 20){
            praintAlert('#alertName', 'Your name should\'nt more than 20 characters')
        }else{
            praintAlert('#alertName', 'You can use letters, numbers, spaces and [@ . _]')
        }
        return false;
        }else{
        addValidationClass(username)
        praintAlert('#alertName', '', false)
        return true
        }
    }else{
        return false
    }
}

/*Validate Email*/
const userEmail = document.getElementById('userEmail');
userEmail.addEventListener('input', function(e){
    e.preventDefault();
    userEmailValidation(userEmail.value)
    removeDisabled()
});

let userEmailValidation = (value)=>{
    let RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if( value != undefined){
        if(!RegExp.test(value)){
        addValidationClass(userEmail, false)
        if(value == '' || value.length == 0){
            praintAlert('#alertEmail', '', false)
        }
        else{
            praintAlert('#alertEmail', 'Please Inter Correct Email')
        }
        return false
        }else{
        addValidationClass(userEmail)
        praintAlert('#alertEmail', '', false)
        return true
        }
    }else{
        return false
    }
} 

/*Validate Phone*/
const userPhone = document.getElementById('userPhone')
userPhone.addEventListener('input', function(e){
    e.preventDefault();
    userPhonelValidation(this.value)
    removeDisabled();
})

let userPhonelValidation = (value)=>{
    let RegExp = /^01[0125][0-9]{8}$/
    if(value != undefined){
        if(!RegExp.test(value.trim())){
        addValidationClass(userPhone, false)
        if(value == '' || value.length == 0){
            praintAlert('#alertPhone', '', false)
        }
        else{
            praintAlert('#alertPhone', 'Please Enter Correct Phone Number')
        }
        return false
        }else{
        addValidationClass(userPhone)
        praintAlert('#alertPhone', '', false)
        return true
        }
    }else{
        return false
    }
    
} 
/*Validate Age*/
const userAge = document.getElementById('userAge')
userAge.addEventListener('input', function(e){
    e.preventDefault();
    userAgelValidation(this.value)
    removeDisabled()
})

let userAgelValidation = (value)=>{
    let RegExp = /^([1-8][0-9]|90)$/
    if(value != undefined){
        if(!RegExp.test(value.trim())){
        addValidationClass(userAge, false)
        if(value == '' || value.length == 0){
            praintAlert('#alertAge', '', false)
        }
        else{
            praintAlert('#alertAge', 'Please Inter Correct Age')
        }
        return false
        }else{
            addValidationClass(userAge)
            praintAlert('#alertAge', '', false)
        return true
        }
    }else{
        return false
    }
} 
/*Validate Pass*/
const userPass = document.getElementById('userPass')
userPass.addEventListener('input', function(e){
    e.preventDefault();
    userPassValidation(this.value)
    removeDisabled()
})

let userPassValidation = (value)=>{
    let RegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    if( value != undefined){
        if(!RegExp.test(value.trim())){
        addValidationClass(userPass, false)
        if(value == '' || value.length == 0){
            praintAlert('#alertPass', '', false)
        }else if(value.length < 8){
            praintAlert('#alertPass', 'Your password have to 8 characters at less')
        }
        else if(value.length > 16){
            praintAlert('#alertPass', 'Your password should\'nt be more than 16 characters')
        }
        else{
            praintAlert('#alertPass', 'Your password have to contain a number at less and a sympol Like [!@#$%^&*], and letters')
        }
        return false
        }else{
        addValidationClass(userPass)
        praintAlert('#alertPass', '', false)
        return true
        }
    }else{
        return false
    }
} 
const userVPass = document.getElementById('userVPass')
userVPass.addEventListener('input', function(e){
  e.preventDefault();
  userPassMatch(this.value)
  removeDisabled()
})

let userPassMatch = (value)=>{
if(value != undefined){
  if(value != userPass.value){
    addValidationClass(userVPass, false)
    praintAlert('#alertVPass', 'Your password not match, please check your password above') 
    return false
  }else{
      addValidationClass(userVPass)
      praintAlert('#alertVPass', '', false)
      return true
   }
}else{
  return false
}
} 


let removeDisabled =()=>{
  if(usernameValidation(username.value) &&
    userEmailValidation(userEmail.value) &&
    userPhonelValidation(userPhone.value) &&
    userAgelValidation(userAge.value) &&
    userPassValidation(userPass.value) &&
    userPassMatch(userVPass.value)){
      console.log('it\'s ready')
      $('#submitBtn').attr('disabled', false)
    }else{
      $('#submitBtn').attr('disabled', true)
    }
}

// document.getElementById("showPass")
function showpass(){
if($(userPass).attr('type') === 'password'){
    $(userPass).attr('type', 'text')
    $(userVPass).attr('type', 'text')
    $(this).removeClass('fa-eye')
    $(this).addClass('fa-eye-slash')
}else{
    $(userPass).attr('type', 'password')
    $(userVPass).attr('type', 'password')
    $(this).removeClass('fa-eye-slash')
    $(this).addClass('fa-eye')
}
}


// $(window).scroll(function(){
//   if($(window).scrollTop() > 1000){
//       $('#btn-up').fadeIn(500)
//   }else{
//       $('#btn-up').fadeOut(500)
//   }
// })
// $('#btn-up').click(function(){
//   $('html,body').animate({scrollTop: 0}, 1000);
// })
// $('#menu a').click(function(){
//    $('body,html').animate({scrollTop: $($(this).attr('href')).offset().top}, 1000)
// })

// new WOW().init();