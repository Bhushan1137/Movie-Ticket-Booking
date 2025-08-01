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
  Box,
  Link,
} from "@mui/material";

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
    <Container maxWidth="sm" >
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.26)",
          boxShadow: "0 10px 20px rgba(204, 199, 199, 0.47) ",
        }}
      >
        <Typography variant="h5">Register</Typography>
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
              <Field
                name="username"
                as={TextField}
                label="Username"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="username"
                component="div"
                style={{ color: "red" }}
              />

              <Field
                name="email"
                as={TextField}
                label="Email"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: "red" }}
              />

              <Field
                name="phone"
                as={TextField}
                label="Phone Number"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="phone"
                component="div"
                style={{ color: "red" }}
              />

              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: "red" }}
              />

              <Field
                name="confirmPassword"
                as={TextField}
                type="password"
                label="Confirm Password"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                style={{ color: "red" }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                Register
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <Link href="/login">Login here</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Register;
