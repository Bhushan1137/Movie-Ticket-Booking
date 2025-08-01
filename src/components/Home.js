import { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners"; 

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BASE_URL = process.env.REACT_APP_MOVIE_BASE_URL;

const categories = [
  { label: "Popular", endpoint: "popular" },
  { label: "Now Playing", endpoint: "now_playing" },
  { label: "Top Rated", endpoint: "top_rated" },
  { label: "Upcoming", endpoint: "upcoming" },
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch movies from the API
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/${selectedCategory}?api_key=${API_KEY}&page=${page}`
      );
      const data = await response.json();
      setMovies((prev) => [...prev, ...(data.results || [])]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  }, [selectedCategory, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading]);

  return (
    <Box sx={{ minHeight: "100vh", pb: 5 }}>
      <Container sx={{ pt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          🎬 Browse Movies
        </Typography>

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ mb: 4, minWidth: 200, backgroundColor: "#fff" }}
        >
          {categories.map((category) => (
            <MenuItem key={category.endpoint} value={category.endpoint}>
              {category.label}
            </MenuItem>
          ))}
        </Select>

        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                    padding: 1,
                    borderRadius: "15px",
                    backgroundColor: "rgba(40, 40, 40, 0.31)",
                    boxShadow:"0px 10px 20px rgba(59, 59, 59, 0.91) ",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                title={movie.title}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  sx={{ borderRadius: "10px" }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2">
                    Release Date: {movie.release_date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <MoonLoader color="#ff3d00" size={60} />
          </Box>
        )}

        <div ref={observerRef} />
      </Container>
    </Box>
  );
}

export default Home;
