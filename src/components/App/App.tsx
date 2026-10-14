import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import styles from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // -----------------------------
  // Form Action handler
  // -----------------------------
  const handleSearch = async (query: string) => {
  setMovies([]);
  setError(false);
  setLoading(true);

  try {
    const results = await fetchMovies(query);

    if (results.length === 0) {
      toast.error("No movies found for your request.");
    }

    setMovies(results);
  } catch {
    setError(true);
  } finally {
    setLoading(false);
  }
};


  // -----------------------------
  // Modal handlers
  // -----------------------------
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />

      {/* SearchBar через action */}
      <SearchBar onSubmit={handleSearch} />


      {/* Loader */}
      {loading && <Loader />}

      {/* Error message */}
      {error && <ErrorMessage />}

      {/* Movie grid */}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
