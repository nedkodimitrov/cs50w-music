/*
* Fetch and display details about an album
* and songs that are featured as part of it
*/
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import ArtistsCardsCollection from './ArtistsCardsCollection';
import Button from '@mui/material/Button';
import ConfirmButton from './ConfirmButton';
import CardsCollection from './CardsCollection';
import Grid from '@mui/material/Grid';
import './styles/ReleaseDetails.css';

const defaultTheme = createTheme();

export default function AlbumDetails() {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState({});
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      setError(null);

      try {
        const response = await axiosInstance.get(`/albums/${id}/`);
        setAlbumDetails(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {error && <p className='load-error'>Error loading album details. Error: {error.message}.</p>}
        {Object.keys(albumDetails).length > 0 && (
          <Container sx={{ py: 8 }} maxWidth='xl'>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <img
                  src={albumDetails.cover_image || 'https://wallpapers.com/images/featured/music-notes-zpmz2slc377qu3wd.jpg'}
                  alt="Album Cover"
                  style={{ width: '100%', borderRadius: '8px' }}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className='release-details'>
                  <Typography variant="h5" color="primary" paragraph>
                    {albumDetails.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    Release date: {albumDetails.release_date}
                  </Typography>
                  <Box className="edit-button">
                    {parseInt(userId) in albumDetails.artists && (
                      <Button
                        variant="contained"
                        color="primary"
                        href={`/albums/${id}/edit/`}
                      >
                        Edit Album
                      </Button>
                    )}

                    {albumDetails.requested_artists && parseInt(userId) in albumDetails.requested_artists && (
                      <ConfirmButton releaseType="albums" id={id} />
                    )}
                  </Box>
                </Box>
                
                {/* Artists related to the album */}
                <ArtistsCardsCollection artists={albumDetails.artists} />
              </Grid>
            </Grid>
          </Container>
        )}

        {/* Songs featured in the album */}
        {albumDetails.id && <CardsCollection url={`/songs/?album__id=${albumDetails.id}`} infiniteScroll={true}/>}

      </main>
    </ThemeProvider>
  );
};
