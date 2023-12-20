import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import PlaySong from './PlaySong';
import CardsCollection from './CardsCollection';
import Navbar from './Navbar';
import AlbumDetails from './AlbumDetails';
import UserDetails from './UserDetails';

const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    document.title = 'CS50wMusic';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<SignIn setIsAuth={setIsAuth} />} />
        <Route path='/register' element={<SignUp setIsAuth={setIsAuth} />} />
        <Route
          path='/*'
          element={
            <Layout isAuth={isAuth} setIsAuth={setIsAuth}>
              <Routes>
                <Route index element={<Home />} />
                <Route path='/songs' element={<CardsCollection url={"/songs/"} infiniteScroll={true} />} />
                <Route path='/songs/:id' element={<PlaySong />} />
                <Route path='/albums' element={<CardsCollection url={"/albums/"} infiniteScroll={true} />} />
                <Route path='/albums/:id' element={<AlbumDetails />} />
                <Route path='/users' element={<CardsCollection url={"/users/"} infiniteScroll={true} />} />
                <Route path='/users/:id' element={<UserDetails />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const Layout = ({ isAuth, setIsAuth, children }) => (
  <>
    <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
    {children}
  </>
);

export default App;
