import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  CardMedia,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BASE_URL = process.env.REACT_APP_MOVIE_BASE_URL;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendedMovie, setRecommendedMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log("Fetching movie details for ID:", id);

        const response = await fetch(
          `${BASE_URL}/${id}?api_key=${API_KEY}`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (!data || data.success === false) {
          throw new Error("Movie data not found");
        }

        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/${id}/recommendations?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (!data || data.success === false) {
          throw new Error("Movie data not found");
        }
        setRecommendedMovie(data.results || []);
      } catch (error) {
        console.log("Error Fetchin the Recommended Movies:", error);
      }
    };
    fetchRecommendedMovies();
  }, [id]);

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${
          movie.backdrop_path || ""
        })`,
        backgroundSize: "cover",
        backgroundPosition: "fixed",
        backgroundAttachment: "fixed",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 0",
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/no-image.jpg"
              }
              alt={movie.title}
              sx={{ borderRadius: 2, width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </Typography>

            <Typography variant="h6" color="gray">
              {movie.genres?.map((genre) => genre.name).join(", ")}
            </Typography>

            <Typography variant="h5" sx={{ mt: 1, fontStyle: "italic" }}>
              ⭐ {movie.vote_average} / 10
            </Typography>

            <Typography variant="body1" sx={{ mt: 2, fontSize: "1.1rem" }}>
              {movie.overview || "No overview available."}
            </Typography>

            <Typography variant="subtitle1" color="gray" sx={{ mt: 2 }}>
              Release Date: {formatDate(movie.release_date)}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/seat-selection/${id}`)}
              >
                🎟 Book Ticket
              </Button>
            </Box>
          </Grid>
          <Grid
            container
            spacing={3}
            sx={{
              mt: 4,
              mb: 3,
            }}
          >
            {recommendedMovie.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    cursor: "pointer",
                    padding: 1,
                    borderRadius: "15px",
                    backgroundColor: "rgba(255, 255, 255, 0.26)",
                    boxShadow:"0 10px 20px rgba(204, 199, 199, 0.47) "
                  }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    sx={{borderRadius:"15px", }}
                  />
                  <CardContent>
                    <Typography variant="h6">{movie.title}</Typography>
                    <Typography variant="body2">
                      Release Date: {formatDate(movie.release_date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MovieDetails;
