import CountryList from 'react-select-country-list';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';

const defaultTheme = createTheme();

export default function SignUp({setIsAuth}) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const countryOptions = CountryList().getData();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('register/', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      setIsAuth(true)
      navigate('/');
    } catch (error) {
      handleErrors(error);
      setIsLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data) {
      setErrors({});
      Object.keys(error.response.data).forEach((key) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: error.response.data[key].join('\n'),
        }));
      });
    } else {
      setErrors({ "message": error.message });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  inputProps={{ minLength: 8 }}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  inputProps={{ minLength: 8 }}
                  error={Boolean(errors.password_confirmation)}
                  helperText={errors.password_confirmation}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  fullWidth
                  id="first-name"
                  label="First Name"
                  error={Boolean(errors.first_name)}
                  helperText={errors.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="family-name"
                  name="last_name"
                  fullWidth
                  id="last-name"
                  label="Last Name"
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="birth_date"
                  label="Birthdate"
                  name="birth_date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0], // Set max date to today
                  }}
                  error={Boolean(errors.birth_date)}
                  helperText={errors.birth_date}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Select Country"
                  name="country"
                  id="country"
                  error={Boolean(errors.country)}
                  helperText={errors.country}
                  variant="outlined"
                >
                  {countryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="body2" color="error">
              {errors.non_field_errors}
              {errors.message}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Grid container direction="column">
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign in"}
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
    </ThemeProvider>
  );
}
