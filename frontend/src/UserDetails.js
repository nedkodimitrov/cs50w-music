/*
* User profile including user details
* and songs and albums released by that user
*/
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CardsCollection from './CardsCollection';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import styles from './styles/UserDetails.css'

const defaultTheme = createTheme();

export default function UserDetails() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch the details of a specific user
    const fetchUserDetails = async () => {
      setError(null);

      try {
        const response = await axiosInstance.get(`/users/${id}/`);
        setUserDetails(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserDetails();
  }, [id]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
        <main>
          {error && <p>Error loading user details. Error: {error.message}.</p>}
          {Object.keys(userDetails).length > 0 && (
            <>
            {/* Information about the user */}
            <Box className='user-details'>
              <Container sx={{ py: 8 }} maxWidth="xl">
                <Typography variant="h5" color="text.primary">
                  User: {userDetails.username}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  Name: {`${userDetails.first_name} ${userDetails.last_name}`}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  Country: {userDetails.country}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  Birth date: {userDetails.birth_date}
                </Typography>
              </Container>

              {parseInt(userId) === userDetails.id && 
                <Button 
                  variant="contained" 
                  color="primary" 
                  href={`/edit-profile`}
                >
                  Edit your profile
                </Button> 
              }
            </Box>

            {/* Songs and Albums by the user */}
            <CardsCollection url={`/songs/?artists__id=${userDetails.id}`} />
            <CardsCollection url={`/albums/?artists__id=${userDetails.id}`} />
          </>
        )}
      </main>
    </ThemeProvider>
  );
};