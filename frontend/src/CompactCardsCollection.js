/*
* A collection of max 10 users/songs/albums cards and a button that links to all
*/

import React, {useState} from 'react';
import CardsCollection from './CardsCollection';
import Button from '@mui/material/Button';


const CompactCardsCollection = ({url}) => {
  const [num, setNum] = useState(0);

  return (
    <>
      <CardsCollection url={url} setNum={setNum}/>
      { num > 10 && 
        <Button 
          variant="contained" 
          color="primary" 
          href={url} 
        >
          View All {num}
        </Button> 
      }
    </>
  );
};

export default CompactCardsCollection;