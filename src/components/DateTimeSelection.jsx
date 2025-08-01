import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [movieData, setMovieData] = useState("");

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${id}?api_key=${API_KEY}`);
        const data = await response.json();
        console.log("data: ", data);

        if (!data || data.success === false) {
          throw new Error("Movie Data Not Found");
        }
        setMovieData(data);
        console.log("movies data", movieData)
      } catch (error) {
        console.error("Error in Fetching the Movie Details:", error);
      }
    };
    fetchMoviesData();
  }, [id]);

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    navigate(`/seat-selection/${id}`, {
      state: {
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime,
      },
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">{movieData.title}</Typography>
        <Grid sx={{ display: "flex", gap: 2 }}>
  {movieData.genres?.map((genre) => (
    <Typography
      key={genre.id}
      variant="subtitle1"
      color="text.secondary"
    >
      {genre.name}
    </Typography>
  ))}
</Grid>
      </Grid>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Select Date & Time
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Choose a Date
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedDate}
          onChange={(_, newDate) => setSelectedDate(newDate)}
          sx={{ flexWrap: "wrap", gap: 2 }}
        >
          {generateNextFiveDates().map((date) => (
            <ToggleButton key={date} value={date} sx={{ p: 2 }}>
              {date.format("DD MMM YYYY")}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Choose a Time Slot
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedTime}
          onChange={(_, newTime) => setSelectedTime(newTime)}
          sx={{ flexWrap: "wrap", gap: 2 }}
        >
          {timeSlots.map((slot) => (
            <ToggleButton key={slot} value={slot} sx={{ p: 2 }}>
              {slot}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 5 }}
        disabled={!selectedDate || !selectedTime}
        onClick={handleContinue}
      >
        Continue to Seat Selection
      </Button>
    </Container>
  );
}

export default DateTimeSelection;
