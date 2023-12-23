/*
* Song player that displays information about a song
* and an audio player for that song's audio file
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


const defaultTheme = createTheme();

export default function PlaySong() {
  const { id } = useParams();
  const [songDetails, setSongDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch details about a specific song
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
          {error && <p>Error loading song details. Error: {error.message}.</p>}
          {Object.keys(songDetails).length > 0 && (
          <>
            <Container sx={{ py: 8 }} maxWidth="xl">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Song cover image or default image for songs */}
                <img
                  src={songDetails.cover_image || 'https://wallpapers.com/images/featured/music-notes-zpmz2slc377qu3wd.jpg'}
                  alt="Song Cover"
                  style={{ maxWidth: '50%' }}
                />

                {/* Some information about the song like title, release_date, ...*/}
                <Typography variant="h6" color="text.primary" paragraph>
                  {songDetails.title}
                  {songDetails.release_date}
                  {songDetails.genre}
                  {songDetails.album}
                </Typography>

                {/* Audio player for the song audio file*/}
                <audio controls>
                  <source src={songDetails.audio_file} type="audio/mp3" />
                  Your browser does not support the audio tag.
                </audio>
              </Box>
            </Container>

            {/* Artists related to the song */}
            <ArtistsCardsCollection artists={songDetails.artists} />
          </>
        )}
      </main>
    </ThemeProvider>
  );
};