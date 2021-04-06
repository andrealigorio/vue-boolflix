Vue.config.devtools = true;
var app = new Vue({
    el: '#app',
    data: {
        apiKey: "1e6535bad1b40a48d42727d1fd3d7131",
        language: "it-IT",
        searchText: "",
        movies: [],
        tv: [],
        search: false,
        posterSize: "w342/"
    },
    methods: {
        searchMovie() {
            if(this.searchText != "") {
                axios
                    .get("https://api.themoviedb.org/3/search/movie?api_key=" + this.apiKey + "&language=" + this.language + "&query=" + this.searchText)
                    .then(response => {
                        this.movies = response.data.results;
                        this.search = true;
                });
                axios
                    .get("https://api.themoviedb.org/3/search/tv?api_key=" + this.apiKey + "&language=" + this.language + "&query=" + this.searchText)
                    .then(response => {
                        this.tv = response.data.results;
                        this.search = true;
                    });
            } else {
                this.movies = [];
                this.tv = [];
            }
            this.search = false;
        },
        printFlag(array) {
            let languageLink = "https://lipis.github.io/flag-icon-css/flags/4x3/"
            if(array.original_language != "en") {  //Perchè lingua EN equivale alla bandiera della GB
                languageLink = languageLink + array.original_language + ".svg";
            } else {
                languageLink = languageLink + "gb.svg";
            }
            return languageLink;
        },
        printStars(number) {
            let vote = Math.ceil(number/2);
            var fullStars = vote;
            return fullStars;
        }
    }
});