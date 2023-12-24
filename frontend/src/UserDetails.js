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
import CompactCardsCollection from './CompactCardsCollection';
import Button from '@mui/material/Button';

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
            <Container sx={{ py: 8 }} maxWidth="xl">
                <div>
                  {/* Information about the user */}
                  <Typography variant="h6" color="text.primary" paragraph>
                    {userDetails.username}
                    {userDetails.first_name}
                    {userDetails.last_name}
                    {userDetails.country}
                    {userDetails.birth_date}
                  </Typography>
                </div>
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

            {/* Songs and Albums by the user */}
            <CompactCardsCollection url={`/songs/?artists__id=${userDetails.id}`} />
            <CompactCardsCollection url={`/albums/?artists__id=${userDetails.id}`} />
          </>
        )}
      </main>
    </ThemeProvider>
  );
};