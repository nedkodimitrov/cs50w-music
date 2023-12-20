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
import Link from '@mui/material/Link';
import CardsCollection from './CardsCollection';

const defaultTheme = createTheme();

export default function AlbumDetails() {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      // Fetch the details of a specific album
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
        <Container sx={{ py: 8 }} maxWidth="xl">
          {error && <p>Error loading album details. Error: {error.message}.</p>}
          {Object.keys(albumDetails).length > 0 && (
            <div>
              {/* Cover image or default image for albums */}
              <img
                src={albumDetails.cover_image || 'https://wallpapers.com/images/featured/the-beauty-of-minimalist-music-0y4974i4hkly0qjv.jpg'}
                alt="Album Cover"
                style={{ maxWidth: '50%' }}
              />

              {/* Album details like title and release date */}
              <Typography variant="h6" color="text.primary" paragraph>
                {albumDetails.title}
                {albumDetails.release_date}
              </Typography>
              
              {/* Artists related to the album */}
              {Object.entries(albumDetails.artists_usernames).map(([artistId, username], index, array) => (
                <React.Fragment key={artistId}>
                  <Link href={`/users/${artistId}/`} variant="body2">
                    {username}
                  </Link>
                  {index < array.length - 1 && ', '}
                </React.Fragment>
              ))}
            </div>
          )}
        </Container>

        {/* Songs featured in the album */}
        <CardsCollection url={`/songs/?album__id=${id}`} infiniteScroll={true}/>
      </main>
    </ThemeProvider>
  );
};