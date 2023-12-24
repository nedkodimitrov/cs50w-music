import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import UserCard from './UserCard';
import Grid from '@mui/material/Grid';

export default function ArtistsCardsCollection({ artists }) {
  return (
    <>
      <Typography variant="h5" align="center" color="text.primary" paragraph>
        Artists
      </Typography>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {Object.entries(artists).map(([artistId, username]) => (
            <Grid item key={artistId} xs={6} sm={4} md={3} lg={2}>
              <UserCard user={{ id: artistId, username: username }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
