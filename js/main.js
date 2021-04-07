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
        nullPoster: "img_not_found.jpg"
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
                            if (element.media_type == "movie" || element.media_type == "tv") {
                                this.allTvMovies.push(element);
                            }
                        });
                        this.search = true;
                });
            } else {
                this.allTvMovies = [];
            }
        },
        printFlag(array) {
            return `https://unpkg.com/language-icons/icons/${array.original_language}.svg`;
        },
        printStars(number) {
            let fullStars = Math.ceil(number/2);
            return fullStars;
        },
        printPoster(array) {
            if(array.poster_path != null) {
                return `http://image.tmdb.org/t/p/${this.posterSize}/${array.poster_path}`;
            } else {
                return `img/${this.nullPoster}`
            }
        },
        isMovie(array) {
            if(array.media_type == "movie") {
                return true;
            } else {
                return false;
            }
        },
        sameTitle(array) {
            if((array.title == array.original_title) && (array.name == array.original_name)) {
                return true;
            }
            return false;
        },
        resetSearch() {
            this.allTvMovies = [];
            this.search = false;
        }
    }
});