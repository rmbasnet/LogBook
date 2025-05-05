
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css"

function Home() {
    const [searchQuery, setSearchQuery] = useState("") //helps update the state
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies..")
            } finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault(); //prevents the search bar from resetting

        if (!searchQuery.trim()) return; //if string empty just return
        if (loading) return;

        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search for the movie...")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="search for moives..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}//updates the value of the search bar words every time a letter is typed
                />
            <button type="submit" className="search-button" onClick={handleSearch}>Search</button>
            </form>


            {error && <div className="error-message"> {error} </div>}

            {loading ? (<div className="loadingMessage"> Loading Screen... </div>) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        movie.title.toLowerCase().startsWith(searchQuery) && //if movie title matches with search query, display the movie card. 
                        (<MovieCard movie={movie} key={movie.id} />)
                    ))}
                </div>
            )}

        </div>
    );
}

export default Home
