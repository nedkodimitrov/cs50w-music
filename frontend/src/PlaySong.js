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
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import './styles/ReleaseDetails.css';

const defaultTheme = createTheme();

export default function PlaySong() {
  const { id } = useParams();
  const [songDetails, setSongDetails] = useState({});
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSongDetails = async () => {
      setError(null);

      try {
        const response = await axiosInstance.get(`/songs/${id}/`);
        setSongDetails(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchSongDetails();
  }, [id]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {error && <p className='load-error'>Error loading song details. Error: {error.message}.</p>}
        {Object.keys(songDetails).length > 0 && (
          <Container sx={{ py: 8 }} maxWidth='xl'>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={songDetails.cover_image || 'https://wallpapers.com/images/featured/music-notes-zpmz2slc377qu3wd.jpg'}
                    alt="Song Cover"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  <audio controls className="audio-player">
                    <source src={songDetails.audio_file} type="audio/mp3" />
                    Your browser does not support the audio tag.
                  </audio>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className='release-details'>
                  <Typography variant="h5" color="primary" paragraph>
                    {songDetails.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    Release date: {songDetails.release_date}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    Genre: {songDetails.genre}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    Album:{' '}
                    <Link href={`/albums/${songDetails.album}`}>
                      {songDetails.album_title}
                    </Link>
                  </Typography>
                  <Box className="edit-button">
                    {parseInt(userId) in songDetails.artists && (
                      <Button
                        variant="contained"
                        color="primary"
                        href={`/songs/${id}/edit/`}
                      >
                        Edit Song
                      </Button>
                    )}

                    {songDetails.requested_artists && parseInt(userId) in songDetails.requested_artists && (
                      <ConfirmButton releaseType="songs" id={id} />
                    )}
                  </Box>
                </Box>

                {/* Artists related to the song */}
                <ArtistsCardsCollection artists={songDetails.artists} />
              </Grid>
            </Grid>
          </Container>
        )}
      </main>
    </ThemeProvider>
  );
};
