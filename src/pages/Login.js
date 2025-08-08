import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import backgroundImage from "../assets/login.jpg"; // 👈 import the same image

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "90vh",
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
            Login
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage name="email" component="div" style={{ color: "#ff7b7b" }} />

                <Field
                  name="password"
                  as={TextField}
                  type="password"
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputProps={{ style: { backgroundColor: "#fff" } }}
                />
                <ErrorMessage name="password" component="div" style={{ color: "#ff7b7b" }} />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>

                <Typography variant="body2" sx={{ mt: 2 }}>
                  Don't have an account?{" "}
                  <Link href="/" underline="hover" color="secondary">
                    Register here
                  </Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
