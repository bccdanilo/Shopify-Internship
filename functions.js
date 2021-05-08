
let myquery;
let count = 0;
let searchTitle = null,
  movielist = null,
  mylist = null,
  innerPanel,
  displayQuery = null,
  modalDisplay = null,
  loading = null,
  nomination = null,
  modalContent = null;
let pagecount = 1;
let myMovieList = [];
let Movies = [];
let animationClass = '';

window.addEventListener("load", () => {
  mapElements();
});

function mapElements() {
  searchTitle = document.querySelector("#searchTitle");
  movielist = document.querySelector("#movielist");
  mylist = document.querySelector("#mylist");
  displayQuery = document.querySelector("#displayQuery");
  innerPanel = document.querySelector("#innerPanel");
  innerList = document.querySelector("#innerList");
  modalDisplay = document.querySelector(".modal");
  modalContent = document.querySelector(".myContent");
  loading = document.querySelector(".hidden");
  next = document.querySelector(".next");
  prev = document.querySelector(".prev");
  nomination = document.querySelector(".title");

  nomination.addEventListener('click', () => {
    renderModal();
  })
  next.addEventListener("click", () => {
    nextPage();
  });
  prev.addEventListener("click", () => {
    prevPage();
  });
  searchTitle.addEventListener("input", async () => {
    myquery = searchTitle.value;
    await fetchData(myquery);
  });
}

async function fetchData(myquery) {
  let temp = [];
  let counter = 0;

  if (searchTitle.value.length < 1) {
    displayQuery.innerHTML = "<h5>Search Titles</h5>";
    innerPanel.innerHTML = "";
    Movies = [];
  } else {
    displayQuery.innerHTML = '<h5>Results for "' + myquery + '"</h5>';
  }

  const result = await fetch(
    "http://www.omdbapi.com/?type=movie&r=json&s=" +
    myquery +
    "&page=" +
    pagecount +
    "&apikey=6293a0c8"
  );

  const jsondata = await result.json();

  if (jsondata.Response == "True") {
    loading.classList.add("hidden");
    temp = jsondata.Search.map((movie) => {
      counter ++;
      return {
        id: movie.imdbID,
        Title: movie.Title + " (" + movie.Year + ")",
        Poster: movie.Poster,
      };
    });
    Movies = temp;

    renderMovies();
  } else {
    if (searchTitle.value.length < 1) {
      loading.classList.add("hidden");
      prev.classList.add("prev");
      next.classList.add("next");
    } else {
      loading.classList.remove("hidden");
    }
    innerPanel.innerHTML = "";
  }

  if(pagecount >1){
    prev.classList.remove("prev");
  }else{
    prev.classList.add("prev");
  }

  if(counter>= 10){
    next.classList.remove("next");
  }else{
    next.classList.add("next");
  }





}

function renderMovies() {
  innerPanel.innerHTML = "";
  let button = "";
  const ul = document.createElement("ul");

  Movies.forEach((movie) => {
    const li = document.createElement("li");
    let tempMovie = "";

    if (movie.Poster != "N/A") {
      tempMovie =
        "<p><i class='material-icons tiny'>find_in_page</i>" +
        movie.Title +
        "<span><img src='" +
        movie.Poster +
        "' alt='poster' height='200' /></span></p>";
    } else {
      tempMovie = "<p>" + movie.Title + "</p>";
    }

    if (myMovieList.some((mymovie) => mymovie.id === movie.id)) {
      button =
        "<button id='" +
        movie.id +
        "' class='btn disabled'> Nominate </button>";
    } else {
      button =
        "<button id='" +
        movie.id +
        "' class='waves-effect waves-light btn'>  Nominate </button>";
    }

    let movieData =
      "<div class = 'itens'>" +
      "<div>" +
      tempMovie +
      "</div>" +
      "<div>" +
      button +
      "</div></div> ";

    li.innerHTML = movieData;
    ul.appendChild(li);
  });

  innerPanel.appendChild(ul);
  handleNominate();
}

function renderMylist() {
  innerList.innerHTML = "";
  let tempid = "";
  const ol = document.createElement("ol");
  myMovieList.forEach((movie) => {

    const li = document.createElement("li");
    li.className = movie.id+"removed";
    let tempMovie = "";

    if (movie.Poster != "N/A") {
      tempMovie =
        "<p> <i class='material-icons tiny'>find_in_page</i>" +
        movie.Title +
        "<span><img src='" +
        movie.Poster +
        "' alt='poster' height='200' /></span></p>";
    } else {
      tempMovie = "<p>" + movie.Title + "</p>";
    }

    let movieData =
      "<div class = 'itens'>" +
      "<div>" +
      tempMovie +
      "</div>" +
      "<div class='buttonArea'> <button id='" +
      movie.id +
      "'" +
      " class='waves-effect waves-light btn red darken-4'>Remove</button> </div>" +
      "</div>        ";

    li.innerHTML = movieData;
    ol.appendChild(li);
    tempid = movie.id;
  
  });

  innerList.appendChild(ol);

  if(tempid !=''){
    const temp = document.querySelector('.'+tempid+'removed');
    temp.classList.add('animate__animated',animationClass);
  }


  
  handleRemoved();
}

function handleNominate() {
  const nominateButton = Array.from(movielist.querySelectorAll(".btn"));
  nominateButton.forEach((button) => {
    button.addEventListener("click", () => addNominate(button.id));
  });
}

function handleRemoved() {
  const removeNominated = Array.from(mylist.querySelectorAll(".btn"));
  removeNominated.forEach((button) => {
    button.addEventListener("click", () => removeMylist(button.id));
  });
}

function addNominate(id) {
  animationClass = 'animate__fadeIn';
  const MovietoAdd = Movies.find((movie) => movie.id === id);
  if (count < 5) {
    count++;
    myMovieList = [...myMovieList, MovietoAdd];
    let temp = "The Movie "+MovietoAdd.Title+" was added!";
    M.toast({html: temp, classes: 'blue rounded', displayLength: 1000});
  }

  
  renderModal();
  renderMovies();
  renderMylist();
}

function removeMylist(id) {
  animationClass='a';
  const temp = document.querySelector('.'+id+'removed');
  
  nomination.classList.remove('bluetext');
  count--;
  myMovieList = myMovieList.filter((movie) => {
    if( movie.id != id){
      return movie;
    }else{
      let temp = "The Movie "+movie.Title+" was removed!";
      M.toast({html: temp, classes: 'red rounded', displayLength: 1000});
    }
  });
  
  temp.classList.add('animate__animated','animate__fadeOut');
  temp.addEventListener('animationend', () =>{
    renderMylist();
    renderMovies();
  });
  
}

function renderModal() {
  if(count == 5 ){
  nomination.classList.add('bluetext');
  modalContent.innerHTML = "";
  const instance = M.Modal.init(modalDisplay, { dismissible: false });
  instance.open();

  const ul = document.createElement("ul");
  myMovieList.forEach((movie) => {
    const li = document.createElement("li");
    let tempMovie = "";

    if (movie.Poster != "N/A") {
      tempMovie =
        "<p> <i class='material-icons tiny'>find_in_page</i>" +
        movie.Title +
        "<span><img src='" +
        movie.Poster +
        "' alt='poster' height='200' /></span></p>";
    } else {
      tempMovie = "<p>" + movie.Title + "</p>";
    }

    let movieData =
      "<div class = 'itens'>" +
      "<div>" +
      tempMovie +
      "</div>" +
      "<div class='buttonArea'> <button id='" +
      movie.id +
      "'";

    li.innerHTML = movieData;
    ul.appendChild(li);
  });

  modalContent.appendChild(ul);
  }
}

async function nextPage() {
  pagecount++;
  await fetchData(myquery);
}

async function prevPage() {
  pagecount--;
  await fetchData(myquery);
}
