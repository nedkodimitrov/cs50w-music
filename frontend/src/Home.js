import React from 'react';
import ReleaseCardsAlbum from './ReleaseCardsAlbum';
import Button from '@mui/material/Button';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [queryParams] = useSearchParams();
  const queryParamsString = queryParams.toString();

  return (
    <>
      {/*ReleaseCardsAlbum parses the query params*/}
      <ReleaseCardsAlbum url={`/songs/`} />
      <Button variant="contained" color="primary" href={`/songs/?${queryParamsString}`} id="all-songs-link">
        View All Songs
      </Button>
      
      <ReleaseCardsAlbum url={`/albums/`} />
      <Button variant="contained" color="primary" href={`/albums/?${queryParamsString}`} id="all-albums-link">
        View All Albums
      </Button>
    </>
  );
};

export default Home;
