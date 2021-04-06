Vue.config.devtools = true;
var app = new Vue({
    el: '#app',
    data: {
        apiKey: "1e6535bad1b40a48d42727d1fd3d7131",
        language: "it-IT",
        searchText: "",
        movies: [],
        search: false
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
            } else {
                this.movies = [];
            }
            this.search = false;
        }
    }
});