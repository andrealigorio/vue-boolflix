Vue.config.devtools = true;
var app = new Vue({
    el: '#app',
    data: {
        apiKey: "1e6535bad1b40a48d42727d1fd3d7131",
        language: "it-IT",
        searchText: "",
        allTvMovies: [],
        search: false,
        posterSize: "w342",
        nullPoster: "img_not_found.jpg",
        genresObj: [],
        genres: [],
        genreSelected: "All"
    },
    methods: {
        searchMovie() {
            this.resetSearch();
            if(this.searchText != "") {
                axios
                    .get("https://api.themoviedb.org/3/search/multi",
                    { params: {
                            api_key: this.apiKey,
                            language: this.language,
                            query: this.searchText
                            }
                    })
                    .then(response => {
                        response.data.results.forEach(element => {
                            if (element.media_type == "movie") {                    
                                axios
                                .get(`https://api.themoviedb.org/3/movie/${element.id}/credits`,
                                { params: {
                                    api_key: this.apiKey,
                                    language: this.language
                                    }
                                })
                                .then(response => {
                                    let cast = [];
                                    for (let i = 0; i < response.data.cast.length; i++) {
                                        if (response.data.cast[i].known_for_department == "Acting") { //In modo da avere in risposta solo gli attori
                                            cast.push(response.data.cast[i].name);
                                        }
                                    }
                                    element.cast = cast;    //aggiungo propriteà "cast" all'oggetto
                                    this.foundGenre(element);
                                    this.allTvMovies.push(element);
                                });
                            } if (element.media_type == "tv") {
                                axios
                                .get(`https://api.themoviedb.org/3/tv/${element.id}/credits`,
                                    {
                                        params: {
                                            api_key: this.apiKey,
                                            language: this.language
                                        }
                                    })
                                .then(response => {
                                    let cast = [];
                                    for (let i = 0; i < response.data.cast.length; i++) {
                                        if (response.data.cast[i].known_for_department == "Acting") {
                                            cast.push(response.data.cast[i].name);
                                        }
                                    }
                                    element.cast = cast;
                                    this.foundGenre(element);
                                    this.allTvMovies.push(element);
                                });
                            }
                        });
                        this.search = true;
                });
            } else {
                this.allTvMovies = [];
            }
        },
        printFlag(item) {
            let languageLink = "https://lipis.github.io/flag-icon-css/flags/4x3/"
            if(item.original_language == "en") {
                languageLink += "gb.svg";
            } else if (item.original_language == "ja") {
                languageLink += "jp.svg";
            } else if (item.original_language == "ko") {
                languageLink += "kr.svg";
            } else if (item.original_language == "zh") {
                languageLink += "cn.svg";
            } else if (item.original_language == "ta") {
                languageLink += "in.svg";
            } else {
                languageLink += item.original_language + ".svg";
            }
            return languageLink;
        },
        printStars(vote) {
            return Math.ceil(vote/2);
        },
        printPoster(item) {
            if(item.poster_path != null) {
                return `http://image.tmdb.org/t/p/${this.posterSize}/${item.poster_path}`;
            } else {
                return `img/${this.nullPoster}`
            }
        },
        isMovie(item) {
            if(item.media_type == "movie") {
                return true;
            } else {
                return false;
            }
        },
        sameTitle(item) {
            if((item.title == item.original_title) && (item.name == item.original_name)) {
                return true;
            }
            return false;
        },
        resetSearch() {
            this.allTvMovies = [];
            this.search = false;
        },
        tipology(item) {
            if(this.isMovie(item)) {
                return "Film";
            } else {
                return "Serie";
            }
        },
        refreshPage() {
            location.reload();
        },
        noFlag(event) {
            event.target.src = `img/noflag.jpg`
        },
        printCast(array) {
            let firstFive = [];
            for(let i = 0; i < array.length; i++) {
                firstFive.push(array[i])
                if(i == 4) {
                    return firstFive.join(", ");
                }
            }
            return firstFive.join(", ");
        },
        foundGenre(item) {
            let genreArray = [];
            for(let i = 0; i < item.genre_ids.length; i++) {
                this.genresObj.forEach(element => {
                    if(element.id == item.genre_ids[i]) {
                        if(!genreArray.includes(element.name)){
                            genreArray.push(element.name);
                            item.genre = genreArray;
                        }
                    }
                });
            }
        },
        genreFilter(item) {
            if(item.genre != undefined) {
                if (this.genreSelected == "All" || item.genre.includes(this.genreSelected)) {
                        return true;
                }
                return false;
            }
        }
    },
    mounted() {
        axios
            .get("https://api.themoviedb.org/3/genre/movie/list",
            { params: {
                api_key: this.apiKey,
                language: this.language
                }
            })
            .then(response => {
                this.genresObj = this.genresObj.concat(response.data.genres);
            });
        axios
            .get("https://api.themoviedb.org/3/genre/tv/list",
            {
                params: {
                    api_key: this.apiKey,
                    language: this.language
                }
            })
            .then(response => {
                this.genresObj = this.genresObj.concat(response.data.genres);
                this.genresObj.forEach(element => {
                    if(!this.genres.includes(element.name)) {
                        this.genres.push(element.name);
                    }
                });
            });
    }
});