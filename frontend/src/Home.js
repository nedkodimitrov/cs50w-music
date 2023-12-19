import React, {useState} from 'react';
import ReleaseCardsAlbum from './ReleaseCardsAlbum';
import Button from '@mui/material/Button';
import { useSearchParams } from 'react-router-dom';


const Home = () => {
  const [queryParams] = useSearchParams();
  const queryParamsString = queryParams.toString();
  const [numSongs, setNumSongs] = useState(0);
  const [numAlbums, setNumAlbums] = useState(0);

  return (
    <div key={queryParamsString}> {/* re-render when query params change */}
      {/*ReleaseCardsAlbum parses the query params*/}
      <ReleaseCardsAlbum url={`/songs/`} setNum={setNumSongs}/>
      { numSongs > 10 && 
        <Button 
          variant="contained" 
          color="primary" 
          href={!!queryParamsString? `/songs/?${queryParamsString}`: "/songs/"} 
          id="all-songs-link">
          View All {numSongs} Songs
        </Button> 
      }
      
      <ReleaseCardsAlbum url={`/albums/`} setNum={setNumAlbums}/>
      { numAlbums > 10 &&
        <Button 
          variant="contained" 
          color="primary" 
          href={!!queryParamsString? `/albums/?${queryParamsString}`: "/albums/"} 
          id="all-albums-link">
          View All {numAlbums} Albums
        </Button>
      }
    </div>
  );
};

export default Home;
