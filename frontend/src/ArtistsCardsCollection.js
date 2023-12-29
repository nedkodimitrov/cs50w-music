import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import UserCard from './UserCard';
import Grid from '@mui/material/Grid';
import styles from './styles/CardsCollection.css';

export default function ArtistsCardsCollection({ artists }) {
  return (
    <Container sx={{ py: 4, mb: 4, mt: 4 }}  maxWidth="xl" className='cards-collection-container'>
      <Typography variant="h5" align="center" color="text.primary" paragraph>
        Artists
      </Typography>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {Object.entries(artists).map(([artistId, username]) => (
            <Grid item key={artistId} xs={6} sm={6} md={4} lg={3}>
              <UserCard user={{ id: artistId, username: username }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}
