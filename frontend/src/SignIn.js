/* page for logging in a user */

import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const SignIn = ({ setIsAuth }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // make an api call to login with the form data and save token and user id in the local storage
  // saving token in local storage might be vulnerable to cross-site-scripting attacks
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('login/', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      setIsAuth(true)
      navigate('/');
    } catch (error) {
      // Set non-fields errors (like invalid credentials)
      setError(error.response?.data?.non_field_errors !== undefined ? error.response.data.non_field_errors : error.message);
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* locked out icon */}
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {/* Form for logging in a user - username, password */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputProps={{ minLength: 8 }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          {/* submit button for logging in a user */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* links to register and home page */}
          <Grid container direction="column">
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/" variant="body2">
                Continue without registration
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
