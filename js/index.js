const IMG_URL = "https://image.tmdb.org/t/p/w500";

const getMovies = async (url) => {
  $("#spinner").css("display", "block");
  const response = await fetch(url);
  const movies = await response.json();
  showMovies(movies.results);
  $("#spinner").css("display", "none");
};

const showMoviesByCast = async (url) => {
  $("#spinner").css("display", "block");
  const response = await fetch(url);
  const casts = await response.json();

  for (const cast of casts.results) {
    const movies = cast.known_for;
    for (const movie of movies) {
      console.log(movie);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
      );

      const movieData = await response.json();

      $("#movie-items").append(`
    <div class="col">
            <div class="card h-100 home-item">
                <img src=${
                  IMG_URL + movie.poster_path
                } class="card-img-top" alt=${movie.name} onclick="showDetail(${
        movie.id
      })">
                <div class="card-body">
                    <h5 class="card-title">${
                      movie.name ? movie.name : movie.title
                    }</h5>
                    <p class="card-text">Rated: ${
                      movie.vote_average
                    }/10 <img class="star-img" src="https://img.icons8.com/fluency/48/000000/star.png"/></p>
                    <p class="card-text">Duration: ${movieData.runtime} mins</p>
                </div>
                <button type="button" class="btn btn-dark" style="width: 100%" onclick="showDetail(${
                  movie.id
                })">SEE DETAIL</button>
            </div>
        </div>
  `);
    }
  }
  $("#spinner").css("display", "none");
};

const showMovies = async (movies) => {
  $("#spinner").css("display", "block");
  $("#movie-items").empty();
  if (!movies) {
    {
      $(".top-title").empty();
      $(".top-title").append("<h3>Fetching movie failed!</h3>");
    }
  } else {
    for (const movie of movies) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
      );

      const movieData = await response.json();

      $("#movie-items").append(`
        <div class="col">
            <div class="card h-100 home-item">
                <img src=${
                  IMG_URL + movie.poster_path
                } class="card-img-top" alt=${movie.title} onclick="showDetail(${
        movie.id
      })">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">Rated: ${
                      movie.vote_average
                    }/10 <img class="star-img" src="https://img.icons8.com/fluency/48/000000/star.png"/></p>
                    <p class="card-text">Duration: ${movieData.runtime} mins</p>
                </div>
                <button type="button" class="btn btn-dark" style="width: 100%" onclick="showDetail(${
                  movie.id
                })">SEE DETAIL</button>
            </div>
        </div>
    `);
    }
  }
  $("#spinner").css("display", "none");
};

const showDetail = async (movieId) => {
  $("#spinner").css("display", "block");
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
  );
  const response2 = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
  );
  const movieData = await response.json();
  const movieCredits = await response2.json();

  let genresContent = "";
  let directorContent = "";

  for (const genre of movieData.genres) {
    genresContent += genre.name + " | ";
  }

  for (const crew of movieCredits.crew) {
    crew.job === "Director" && (directorContent += crew.name);
  }

  $(".home-page").css("display", "none");
  $(".detail-page").append(`
    <div class="container-fluid">
        <div class="row justify-content-center m-5">
            <div class="col-md-7 col-lg-4 mb-5 mb-lg-0 wow fadeIn">
                <div class="card border-0 shadow">                      
                    <img src=${IMG_URL + movieData.poster_path} alt="...">
                </div>
            </div>
            <div class="col-lg-8">
                <div class="ps-lg-1-6 ps-xl-5">
                    <div class="mb-5">
                        <h1>${movieData.title.toUpperCase()}</h1>
                        <div class="text-start mb-1-6">
                            <h2 class="h2 mb-1 text-primary">Movie Information</h2>
                        </div>
                        <h5>Genres: ${genresContent}</h5>
                        <h5>Director: ${directorContent}</h5>
                        <h5>Release Year: ${
                          movieData.release_date.split("-")[0]
                        }</h5>
                        <h5>Summary: </h5>
                        <p>${movieData.overview}</p>
                    </div>
                    <div class="text-start mb-1-6">
                            <h2 class="h2 mb-1 text-primary">Cast</h2>
                        </div>
                    <div class="cast-info"></div>                     
                    </div>
                </div>
            </div>
        </div>
    </div>
  `);

  for (const cast of movieCredits.cast) {
    $(".cast-info").append(`
        <div class="cast-item">
            <img src=${
              cast.profile_path !== null
                ? IMG_URL + cast.profile_path
                : "https://previews.123rf.com/images/pe3check/pe3check1710/pe3check171000054/88673746-no-image-available-sign-internet-web-icon-to-indicate-the-absence-of-image-until-it-will-be-download.jpg"
            } onclick="showCastDetail(${cast.id})"></img>
            <p style="text-align: center">${cast.name}</p>
        </div>
      `);
  }

  const response3 = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
  );

  const data = await response3.json();
  const reviews = data.results;

  $(".detail-page").append(`
    <div class="container text-start mb-1-6">
      <h2 class="h2 mb-1 text-primary">Reviews</h2>
    </div>`);

  for (const review of reviews) {
    let imageUrl = "";
    if (review.author_details.avatar_path !== null) {
      if (review.author_details.avatar_path.includes("http")) {
        imageUrl = review.author_details.avatar_path.slice(1);
      } else imageUrl = IMG_URL + review.author_details.avatar_path;
    } else {
      imageUrl = "https://chinhnhan.vn/uploads/news/no-avata.png";
    }
    $(".detail-page").append(`
      <div class="container bcontent">
        <div class="card">
            <div class="row no-gutters">
                <div class="col-sm-2">
                    <img class="card-img" src=${imageUrl}>
                </div>
                <div class="col-md">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${review.author}</h5>
                        <p class="card-text">${review.content}</p>
                        <br>
                       <h6 class="card-text">Created at: ${review.created_at}</h6>
                       <h6 class="card-text">Last modified: ${review.updated_at}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);
  }
  $("#spinner").css("display", "none");
  //localStorage.setItem("display", $("#container").html());
};

const showCastDetail = async (castId) => {
  $("#spinner").css("display", "block");
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${castId}?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
  );

  const cast = await response.json();

  let content = "";

  for (const name of cast.also_known_as) {
    content += name + " | ";
  }

  console.log(cast);

  $(".detail-page").css("display", "none");
  $(".cast-page").append(`
    <div class="container-fluid">
        <div class="row justify-content-center m-5">
            <div class="col-md-7 col-lg-4 mb-5 mb-lg-0 wow fadeIn">
                <div class="card border-0 shadow">                      
                    <img src=${IMG_URL + cast.profile_path} alt="...">
                </div>
            </div>
            <div class="col-lg-8">
                <div class="ps-lg-1-6 ps-xl-5">
                    <div class="mb-5">
                        <h1>${cast.name}</h1>
                        <div class="text-start mb-1-6">
                            <h2 class="h2 mb-1 text-primary">Cast Information</h2>
                        </div>
                        <h5>${
                          content === "" ? "" : "Also known as: " + content
                        }</h5>
                        <h5>Gender: ${
                          cast.gender === 1 ? "Female" : "Male"
                        }</h5>
                        <h5>Birthday: ${cast.birthday}</h5>
                        <h5>Place of birth: ${cast.place_of_birth}</h5>
                        <h5>Biography:</h5>
                        <p>${cast.biography}</p>
                    </div>
                    <div class="text-start mb-1-6">
                            <h2 class="h2 mb-1 text-primary">Acted Movies</h2>
                        </div>
                    <div class="movie-info"></div>                     
                    </div>
                </div>
            </div>
        </div>
    </div>
  `);

  const response2 = await fetch(
    `https://api.themoviedb.org/3/person/${castId}/movie_credits?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67`
  );
  const credits = await response2.json();

  console.log(credits);

  for (const movie of credits.cast) {
    $(".movie-info").append(`
        <div class="movie-item">
            <img src=${
              movie.profile_path !== null
                ? IMG_URL + movie.poster_path
                : "https://previews.123rf.com/images/pe3check/pe3check1710/pe3check171000054/88673746-no-image-available-sign-internet-web-icon-to-indicate-the-absence-of-image-until-it-will-be-download.jpg"
            }></img>
            <p>${movie.title}</p>
        </div>
      `);
  }
  $("#spinner").css("display", "none");
};

const seachingHandler = () => {
  $("#search-form").on("submit", (e) => {
    const input = $("#searchText").val().toLowerCase();
    e.preventDefault();
    let searchingUrl =
      "https://api.themoviedb.org/3/search/movie?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67&query=" +
      input;
    getMovies(searchingUrl);
    searchingUrl =
      "https://api.themoviedb.org/3/search/person?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67&query=" +
      input;
    showMoviesByCast(searchingUrl);

    $(".top-title").empty();
    $(".top-title").append(
      `<h2>SEARCHING RESULT FOR '${input.toUpperCase()}'</h2>`
    );
  });
};

$().ready(() => {
  const popularMoviesUrl =
    "https://api.themoviedb.org/3/movie/popular?api_key=4fb86ac2149d2a75d14ce1fe4cddbd67";
  getMovies(popularMoviesUrl);

  //   let oldPage = localStorage.getItem("display");
  //   if (oldPage !== null) {
  //     $("#container").html(oldPage).show();
  //   }

  seachingHandler();
  $("#search-btn").on("click", seachingHandler);
});
