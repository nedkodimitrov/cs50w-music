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

const defaultTheme = createTheme();

export default function UserDetails() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);

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
        <Container sx={{ py: 8 }} maxWidth="xl">
          {error && <p>Error loading user details. Error: {error.message}.</p>}
          {Object.keys(userDetails).length > 0 && (
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
          )}
        </Container>

        {/* Songs and Albums by the user */}
        <CompactCardsCollection url={`/songs/?artists__id=${id}`} />
        <CompactCardsCollection url={`/albums/?artists__id=${id}`} />
      </main>
    </ThemeProvider>
  );
};