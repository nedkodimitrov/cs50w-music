/*
* Routes in the React application
*/
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
        <Route path='/login' element={<SignIn setIsAuth={setIsAuth}/>}/>
        <Route path='/register' element={<SignUp setIsAuth={setIsAuth}/>}/>
        <Route path='/' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}><Home /></Layout>} />
        <Route path='/songs' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <CardsCollection url={"/songs/"} infiniteScroll={true}/> </Layout>} />
        <Route path='/songs/:id' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <PlaySong /> </Layout>} />
        <Route path='/albums' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <CardsCollection url={"/albums/"} infiniteScroll={true}/> </Layout>} />
        <Route path='/albums/:id' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <AlbumDetails /> </Layout>} />
        <Route path='/users' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <CardsCollection url={"/users/"} infiniteScroll={true}/> </Layout>} />
        <Route path='/users/:id' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <UserDetails /> </Layout>} />
      </Routes>
    </BrowserRouter>
  );
};

const Layout = ({ isAuth, setIsAuth, children }) => (
  <>
    <Navbar isAuth={isAuth} setIsAuth={setIsAuth}/>
    {children}
  </>
);

export default App;
