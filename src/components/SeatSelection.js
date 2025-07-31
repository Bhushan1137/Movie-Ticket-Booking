import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Container, Button, Typography, Grid, Box } from "@mui/material";

const SEAT_ROWS = 5;
const SEAT_COLS = 9;
const TICKET_PRICE = 200;

function SeatSelection() {
  const { id } = useParams(); // Movie ID
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!auth.currentUser) return;
      const bookingRef = doc(db, "bookings", `${auth.currentUser.uid}_${id}`);
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) {
        setBookedSeats(bookingSnap.data().seats);
      }
    };
    fetchBookedSeats();
  }, [id]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // Prevent selection of already booked seats
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (!auth.currentUser) {
      alert("Please log in to book tickets");
      navigate("/login");
      return;
    }
  
    try {
      const bookingRef = doc(db, "bookings", auth.currentUser.uid);
      const userBookings = await getDoc(bookingRef);
  
      const newBooking = {
        movieId: id,
        movieName: "Some Movie", 
        seats: selectedSeats,
        totalPrice: selectedSeats.length * TICKET_PRICE,
      };
  
      const updatedBookings = userBookings.exists()
        ? [...userBookings.data().bookings, newBooking]
        : [newBooking];
  
      await setDoc(bookingRef, { bookings: updatedBookings });
  
      alert("Booking confirmed!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error booking tickets:", error);
    }
  };
  

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4">Select Your Seats</Typography>

      {/* Seat Layout */}
      <Box sx={{ display: "grid", gap: 2, mt: 4 }}>
        {[...Array(SEAT_ROWS)].map((_, row) => (
          <Grid container justifyContent="center" key={row}>
            {[...Array(SEAT_COLS)].map((_, col) => {
              const seat = `${row}${col+1}`;
              const isBooked = bookedSeats.includes(seat);
              return (
                <Button
                  key={seat}
                  variant={selectedSeats.includes(seat) ? "contained" : "outlined"}
                  color={isBooked ? "error" : "primary"}
                  sx={{ m: 0.5, minWidth: "40px" }}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                >
                  {seat}
                </Button>
              );
            })}
          </Grid>
        ))}
      </Box>

      {/* Booking Details */}
      <Typography sx={{ mt: 3 }}>
        Selected Seats: {selectedSeats.join(", ") || "None"}
      </Typography>
      <Typography>Total Price: ₹{selectedSeats.length * TICKET_PRICE}</Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleBooking}
        sx={{ mt: 3 }}
        disabled={selectedSeats.length === 0}
      >
        Confirm Booking
      </Button>
    </Container>
  );
}

export default SeatSelection;
