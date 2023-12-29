/*
* Home page showing the 20 newest songs and albums and the first 20 users alphabetically
* and buttons that link to all songs/albums/users
*/
import React from 'react';
import CardsCollection from './CardsCollection';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();

  const generateUrl = (path) => `${path}${searchParamsString ? `?${searchParamsString}` : ''}`;

  return (
    <div key={searchParamsString}>
      <CardsCollection url={generateUrl('/songs/')} />
      <CardsCollection url={generateUrl('/albums/')} />
      <CardsCollection url={generateUrl('/users/')} />
    </div>
  );
};

export default Home;
