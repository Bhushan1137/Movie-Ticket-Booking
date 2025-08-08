import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Link,
} from "@mui/material";
import backgroundImage from "../assets/login.jpg";
// import { BorderColor } from "@mui/icons-material";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be a valid phone number")
    .max(10)
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: values.username,
        email: values.email,
        phone: values.phone,
      });
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{
        width: "100vw",
        height: "90.5vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            p: 4,
            borderRadius: "15px",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            color: "#fff",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
          <Formik
            initialValues={{
              username: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Fields */}
                <Field
                  name="username"
                  as={TextField}
                  label="Username"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  style={{ color: "#ff7b7b" }}
                />

                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "#ff7b7b" }}
                />

                <Field
                  name="phone"
                  as={TextField}
                  label="Phone Number"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  style={{ color: "#ff7b7b" }}
                />

                <Field
                  name="password"
                  as={TextField}
                  type="password"
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "#ff7b7b" }}
                />

                <Field
                  name="confirmPassword"
                  as={TextField}
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={{ color: "#ff7b7b" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>

                <Typography variant="body2" sx={{ mt: 2 }}>
                  Already have an account?{" "}
                  <Link href="/login" underline="hover" color="secondary">
                    Login here
                  </Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Grid>
  );
}

export default Register;
