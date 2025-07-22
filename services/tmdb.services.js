  // Simple in-memory cache 
const cache = {}; 
const cacheTimers = {}; 
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds 
const setCache = (key, data) => { 
    cache[key] = data; 
    console.log("Cache updated:", cache);
 
    // Clear existing timer if any 
    if (cacheTimers[key]) { 
        clearTimeout(cacheTimers[key]); 
    } 
 
    // Set expiration timer 
    cacheTimers[key] = setTimeout(() => { 
        delete cache[key]; 
        delete cacheTimers[key]; 
    }, CACHE_DURATION); 
}; 
 
const getCache = (key) => { 
    return cache[key]; 
}; 
 
// Helper functions 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 
const headers = {
    accept: 'application/json',
    // api key
    Authorization: `Bearer ${process.env.TMDB_KEY} `
};
const imageBASEURL = "https://image.tmdb.org/t/p/original/";
const tmdbBASEURL = "https://api.themoviedb.org/3/";
// ahmarae backend yah data leke aayega 
const TMDB_ENDPOINT = {
    //discover
    fetchNowPlaying: "/movie/now_playing",
    fetchTrending: `/trending/all/week`,
    fetchPopular: `/trending/all/week`,
    fetchUpcoming: `/movie/upcoming?include_video=true`,
    fetchTopRated: `/movie/top_rated?include_video=true`,

    // Movies
    fetchActionMovies: `/discover/movie?language=en-US&with_genres=28`,
    fetchComedyMovies: `/discover/movie?language=en-US&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?language=en-US&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?language=en-US&with_genres=10749`,
    fetchAnimeMovies: '/discover/movie?language=en-US&with_genres=16',
    fetchMovieVideos: (id) => `/movie/${id}/videos`,
    fetchMovieDetails: (id) => `/movie/${id}`,

    // Tv Shows
    fetchActionTvShows: `/discover/tv?language=en-US&with_genres=10759`,
    fetchComedyTvShows: `/discover/tv?language=en-US&with_genres=35`,
    fetchMysteryTvShows: `/discover/tv?language=en-US&with_genres=9648`,
    fetchDramaTvShows: `/discover/tv?language=en-US&with_genres=18`,
    fetchCrimeTvShows: `/discover/tv?language=en-US&with_genres=80`,
    fetchTvShowVideos: (id) => `/tv/${id}/videos`,
    fetchTvShowDetails: (id) => `/tv/${id}`,
};


const tmdbApi = { 
    get: async (endpoint) => { 
        const cacheKey = `tmdb_${endpoint}`; 
 
        // Check cache first 
        const cachedData = getCache(cacheKey); 
        if (cachedData) { 
            console.log(`Cache hit for: ${endpoint}`); 
            return cachedData; 
        } 
 
        console.log(`Cache miss for: ${endpoint}`); 
 
        const url = tmdbBASEURL + endpoint; 
        let lastError; 
 
        // Retry mechanism - 3 attempts 
        for (let attempt = 1; attempt <= 5; attempt++) { 
            try { 
                console.log(`Attempt ${attempt} for ${endpoint}`);
                const response = await fetch(url, { method: 'GET', headers: headers }); 
 
                if (!response.ok) { 
                    throw new Error(`HTTP error! status: ${response.status}`); 
                } 
 
                const data = await response.json(); 
 
                // Cache the successful response 
                setCache(cacheKey, data); 
                console.log(`Data cached for: ${endpoint}`); 
 
                return data; 
 
            } catch (error) { 
                lastError = error; 
                console.log(`Attempt ${attempt} failed:`, error.message); 
 
                // Don't wait after the last attempt 
                if (attempt < 5) { 
                    // Wait before retry: 100ms, then 200ms 
                    const waitTime = attempt * 100; 
                    console.log(`Waiting ${waitTime}ms before retry...`); 
                    await sleep(waitTime); 
                } 
            } 
        } 
 
        // All attempts failed 
        console.error(`All 3 attempts failed for ${endpoint}`); 
        throw lastError; 
    } 
    } 

module.exports={
    tmdbApi, TMDB_ENDPOINT, 
}
