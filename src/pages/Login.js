import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/home"); // Redirecting to home instead of dashboard
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h5">Login</Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="email" as={TextField} label="Email" fullWidth margin="normal" />
              <ErrorMessage name="email" component="div" style={{ color: "red" }} />

              <Field name="password" as={TextField} type="password" label="Password" fullWidth margin="normal" />
              <ErrorMessage name="password" component="div" style={{ color: "red" }} />

              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                Login
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account? <Link href="/">Register here</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Login;
