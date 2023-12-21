import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SignOutMenuItem from './SignOutMenuItem';
import { useNavigate } from 'react-router-dom';


export default function AccountMenu({setIsAuth}) {
  const accountMenuId = 'primary-search-account-menu';

  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const isAccountMenuOpen = Boolean(accountAnchorEl);

  const navigate = useNavigate();

  const userId = localStorage.getItem('userId')

  const handleAccountMenuOpen = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={accountMenuId}
        aria-haspopup="true"
        onClick={handleAccountMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        anchorEl={accountAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={accountMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isAccountMenuOpen}
        onClose={handleAccountMenuClose}
      >
        <MenuItem onClick={() => {navigate(`/users/${userId}`); handleAccountMenuClose()}}>Profile</MenuItem>
        <SignOutMenuItem setIsAuth={setIsAuth} />
      </Menu>
    </>
  );
}
