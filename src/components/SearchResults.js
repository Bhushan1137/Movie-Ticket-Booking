import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const API_KEY = "0fcca2e2fe45bcbd5968ebfe0d897505";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("query");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${SEARCH_URL}?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        🎬 Search Results for: "{query}"
      </Typography>

      {movies.length === 0 ? (
        <Typography>No results found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/movie/${movie.id}`)}>
                <CardMedia component="img" height="300" image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SearchResults;
