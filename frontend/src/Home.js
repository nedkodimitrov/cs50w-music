import React from 'react';
import ReleaseCardsAlbum from './ReleaseCardsAlbum';
import Button from '@mui/material/Button';

const Home = () => {
  return (
    <>
      <ReleaseCardsAlbum url={"/songs/"}/>
      <Button variant="contained" color="primary" href="/songs" id="all-songs-link">
        View All Songs
      </Button>
      
      <ReleaseCardsAlbum url={"/albums/"}/>
      <Button variant="contained" color="primary" href="/albums" id="all-albums-link">
        View All Albums
      </Button>
    </>
  );
};

export default Home;
