import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Divider,
  Fade,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BASE_URL = process.env.REACT_APP_MOVIE_BASE_URL;
const timeSlots = ["7:00 AM", "10:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"];

const generateNextFiveDates = () => {
  const today = dayjs();
  return Array.from({ length: 6 }, (_, i) => today.add(i, "day"));
};

function DateTimeSelection() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [movieData, setMovieData] = useState("");

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/${movieId}?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (!data || data.success === false) throw new Error("Movie Not Found");
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMoviesData();
  }, [movieId]);

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    navigate(`/seat-selection/${movieId}`, {
      state: {
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime,
        movieId,
      },
    });
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "md" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {movieData.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {movieData.genres?.map((genre) => (
                <Typography
                  key={genre.id}
                  variant="body2"
                  color="text.secondary"
                >
                  {genre.name}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Divider flexItem sx={{ my: 2 }} />

          {/* Date Selection */}
          <Grid item width="100%">
            <Typography variant="h6" gutterBottom>
              Choose a Date
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={selectedDate}
              onChange={(_, newDate) => setSelectedDate(newDate)}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {generateNextFiveDates().map((date) => (
                <ToggleButton
                  key={date}
                  value={date}
                  size="small"
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "0.8rem",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor:
                      selectedDate?.format("YYYY-MM-DD") ===
                      date.format("YYYY-MM-DD")
                        ? "secondary.main"
                        : "grey.300",
                    bgcolor:
                      selectedDate?.format("YYYY-MM-DD") ===
                      date.format("YYYY-MM-DD")
                        ? "secondary.light"
                        : "background.paper",
                    color:
                      selectedDate?.format("YYYY-MM-DD") ===
                      date.format("YYYY-MM-DD")
                        ? "secondary.contrastText"
                        : "text.primary",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "secondary.main",
                      bgcolor: "secondary.light",
                      color:'secondary.contrastText'
                    },
                  }}
                >
                  {date.format("ddd, MMM D")}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* Time Slot Selection */}
          <Grid item width="100%" sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose a Time Slot
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={selectedTime}
              onChange={(_, newTime) => setSelectedTime(newTime)}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {timeSlots.map((slot) => (
                <ToggleButton
                  key={slot}
                  value={slot}
                  size="small"
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "0.8rem",
                    borderRadius: 2,
                    color:'text.primary',
                    "&.Mui-selected": {
                      borderColor: "secondary.main",
                      backgroundColor: "secondary.light",
                      color: "secondary.contrastText",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "secondary.main",
                    },
                    "&:hover": {
                      borderColor: "secondary.main",
                      backgroundColor: "secondary.light",
                      color: "secondary.contrastText",
                    },
                  }}
                >
                  {slot}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* Summary Box */}
          {selectedDate && selectedTime && (
            <Fade in={true}>
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {selectedDate.format("YYYY-MM-DD")}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {selectedTime}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Continue Button */}
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ mt: 4 }}
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
          >
            Continue to Seat Selection
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DateTimeSelection;
