import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import PlaySong from './PlaySong';
import ReleaseCardsAlbum from './ReleaseCardsAlbum';
import Navbar from './Navbar';


const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}><Home /></Layout>} />
        <Route path='/login' element={<SignIn setIsAuth={setIsAuth}/>}/>
        <Route path='/register' element={<SignUp setIsAuth={setIsAuth}/>}/>
        <Route path='/songs' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <ReleaseCardsAlbum url={"/songs/"} infiniteScroll={true}/> </Layout>} />
        <Route path='/albums' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <ReleaseCardsAlbum url={"/albums/"} infiniteScroll={true}/> </Layout>} />
        <Route path='/songs/:id' element={<Layout isAuth={isAuth} setIsAuth={setIsAuth}> <PlaySong /> </Layout>} />
      </Routes>
    </Router>
  );
};

const Layout = ({ isAuth, setIsAuth, children }) => (
  <>
    <Navbar isAuth={isAuth} setIsAuth={setIsAuth}/>
    {children}
  </>
);

export default App;
