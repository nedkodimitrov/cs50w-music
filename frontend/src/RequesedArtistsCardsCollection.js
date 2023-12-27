import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import UserCard from './UserCard';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axiosInstance from './axiosInstance';
import Box from '@mui/material/Box';

export default function RequestedArtistsCardsCollection({ requestedArtists, url }) {
  const handleSubmitCancelRequest = async (artistId) => {
    try {
      const response = await axiosInstance.delete(url, { data: { artist_id: artistId } });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography variant="h5" align="center" color="text.primary" paragraph>
        Requested Artists
      </Typography>

      <Container maxWidth="xl">
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(requestedArtists).map(([artistId, username]) => (
              <Grid item key={artistId} xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <UserCard user={{ id: artistId, username: username }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={() => handleSubmitCancelRequest(artistId)}
                      fullWidth
                      variant="contained"
                      color="error"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Cancel Request
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
