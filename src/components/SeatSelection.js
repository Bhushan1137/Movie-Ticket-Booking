import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  Container,
  Button,
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import ChairIcon from '@mui/icons-material/Chair';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import WeekendIcon from '@mui/icons-material/Weekend';

const SEAT_ROWS = 10;
const SEAT_COLS = 10;
const TICKET_PRICE = 200;

const HIDDEN_ROWS = ['C', 'H'];

const getCategory = rowIndex => {
  if (rowIndex <= 2) return 'silver';
  if (rowIndex <= 6) return 'gold';
  return 'premium';
};

const getSeatIcon = category => {
  switch (category) {
    case 'silver': return <EventSeatIcon fontSize="small" />;
    case 'gold': return <ChairIcon fontSize="small" />;
    case 'premium': return <WeekendIcon fontSize="small" />;
    default: return <ChairIcon fontSize="small" />;
  }
};

function SeatSelection() {
  const { state } = useLocation();
  const { date, time, movieId } = state || {};
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      if (auth.currentUser) {
        const bsRef = doc(db, "bookings", `${auth.currentUser.uid}_${movieId}`);
        const bsSnap = await getDoc(bsRef);
        if (bsSnap.exists()) setBookedSeats(bsSnap.data().seats || []);
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/${movieId}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}`);
        const data = await res.json();
        setMovieTitle(data.title || '');
      } catch (e) { console.error(e); }
    };
    fetchAll();
  }, [movieId]);

  const toggleSeat = seat => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats(prev => prev.includes(seat)
      ? prev.filter(s => s !== seat)
      : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (!auth.currentUser) return navigate('/login', { replace: true });
    try {
      const bookingRef = doc(db, "bookings", `${auth.currentUser.uid}_${movieId}`);
      await setDoc(bookingRef, {
        seats: [...bookedSeats, ...selectedSeats],
        date, time, movieId, movieTitle,
      });
      const userRef = doc(db, "bookings", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const prev = userSnap.exists() ? userSnap.data().bookings || [] : [];
      const newBooking = { movieId, movieTitle, date, time, seats: selectedSeats, totalPrice: selectedSeats.length * TICKET_PRICE };
      await setDoc(userRef, { bookings: [...prev, newBooking] });
      alert('Booking confirmed!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold">{movieTitle}</Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {date} at {time}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Select Your Seats</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {[...Array(SEAT_ROWS)].map((_, ri) => {
            const rowLetter = String.fromCharCode(65 + ri); 
            if (HIDDEN_ROWS.includes(rowLetter)) {
              return null;
            }
            const category = getCategory(ri);
            return (
              <Box key={rowLetter} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ width: 16 }}>{rowLetter}</Typography>
                {[...Array(SEAT_COLS)].map((__, ci) => {
                  const seatId = `${rowLetter}${ci + 1}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const color = isBooked ? 'error' : isSelected ? 'secondary' : 'primary';

                  return (
                    <Button
                      key={seatId}
                      variant={isSelected ? 'contained' : 'outlined'}
                      color={color}
                      size="small"
                      onClick={() => toggleSeat(seatId)}
                      disabled={isBooked}
                      sx={{
                        minWidth: 32, minHeight: 32,
                        p: 0,
                        m: 0.3,
                        borderRadius: 0.5,
                        border:'none',
                      }}
                    >
                      {getSeatIcon(category)}
                    </Button>
                  );
                })}
              </Box>
            );
          })}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ width: 20 }}> </Typography>
            {[...Array(SEAT_COLS)].map((_, ci) => (
              <Typography key={ci} variant="body2" sx={{ width: 32, textAlign: 'center', m: 0.3 }}>
                {ci + 1}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Booking summary */}
        <Typography sx={{ mt: 2 }}>
          Selected Seats: {selectedSeats.join(', ') || 'None'}
        </Typography>
        <Typography>Total Price: ₹{selectedSeats.length * TICKET_PRICE}</Typography>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          disabled={!selectedSeats.length}
          onClick={handleBooking}
        >
          Confirm Booking
        </Button>
      </Paper>
    </Container>
  );
}

export default SeatSelection;
