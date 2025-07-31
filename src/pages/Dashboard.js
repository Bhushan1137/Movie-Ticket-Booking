import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Card, CardContent, Grid, CircularProgress, Box, Paper } from "@mui/material";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userAuth = auth.currentUser;
      if (!userAuth) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user details
        const userDoc = await getDoc(doc(db, "users", userAuth.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }

        // Fetch booking details in real-time
        const unsubscribe = onSnapshot(doc(db, "bookings", userAuth.uid), (snapshot) => {
          if (snapshot.exists()) {
            setBookings(snapshot.data().bookings || []);
          } else {
            setBookings([]);
          }
          setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const cancelBooking = async (movieId) => {
    try {
      const updatedBookings = bookings.filter((booking) => booking.movieId !== movieId);
      await setDoc(doc(db, "bookings", auth.currentUser.uid), { bookings: updatedBookings });
      setBookings(updatedBookings);
      alert("Booking canceled successfully!");
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          🎟️ User Dashboard
        </Typography>

        {user && (
          <Box sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h5">👤 Personal Details</Typography>
            <Typography><strong>Username:</strong> {user.username}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Phone:</strong> {user.phone}</Typography>
          </Box>
        )}

        <Button
          onClick={handleLogout}
          variant="contained"
          color="secondary"
          sx={{ mb: 3, display: "block", mx: "auto" }}
        >
          Logout
        </Button>

        <Typography variant="h5">🎬 Your Bookings</Typography>
        {bookings.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {bookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking.movieId}>
                <Card sx={{ bgcolor: "#e3f2fd", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{booking.movieName}</Typography>
                    <Typography>Seats: {booking.seats.join(", ")}</Typography>
                    <Typography>Total Price: ₹{booking.totalPrice}</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => cancelBooking(booking.movieId)}
                      sx={{ mt: 2 }}
                    >
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ mt: 2 }}>No bookings found.</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Dashboard;



// import { auth, db } from "../firebase";
// import { signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Typography, Container } from "@mui/material";

// function Dashboard() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userAuth = auth.currentUser;
//       if (userAuth) {
//         const userDoc = await getDoc(doc(db, "users", userAuth.uid));
//         if (userDoc.exists()) {
//           setUser(userDoc.data()); // Fetching user data from Firestore
//         }
//       } else {
//         navigate("/login");
//       }
//     };
//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <Container sx={{ mt: 5, textAlign: "center" }}>
//       {user ? (
//         <>
//           <Typography variant="h4">Welcome, {user.username} 👋</Typography>
//           <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ mt: 2 }}>
//             Logout
//           </Button>
//         </>
//       ) : (
//         <Typography variant="h5">Loading...</Typography>
//       )}
//     </Container>
//   );
// }

// export default Dashboard;
