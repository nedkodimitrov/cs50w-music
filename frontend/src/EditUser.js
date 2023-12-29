import CountryList from 'react-select-country-list';
import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';


const defaultTheme = createTheme();

export default function EditUser() {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const countryOptions = CountryList().getData();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    country: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}/`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(`/users/${userId}/`, form);
      navigate(`/users/${userId}`);
    } catch (error) {
      handleErrors(error);
      setIsLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.response?.data) {
      setErrors({});
      Object.keys(error.response.data).forEach((key) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: error.response.data[key].join('\n'),
        }));
      });
    } else {
      setErrors({ message: error.message });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
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
            <AccountCircleOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit your profile
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="username"
                      name="username"
                      fullWidth
                      id="username"
                      label="Username"
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
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
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Select Country"
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      error={Boolean(errors.country)}
                      helperText={errors.country}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: Boolean(formData.country),
                      }}
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
                  {isLoading ? 'Editing...' : 'Edit'}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="old_password"
                      label="Old Password"
                      name="old_password"
                      type="password"
                      autoComplete="new-password"
                      inputProps={{ minLength: 8 }}
                      error={Boolean(errors.old_password)}
                      helperText={errors.old_password}
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
                      id="password_confirmation"
                      label="Confirm Password"
                      name="password_confirmation"
                      type="password"
                      autoComplete="new-password"
                      inputProps={{ minLength: 8 }}
                      error={Boolean(errors.password_confirmation)}
                      helperText={errors.password_confirmation}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  Change password
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Link href={`/users/${userId}`} variant="body2">
            Cancel
          </Link>

        </Box>
      </Container>
    </ThemeProvider>
  );
}
