import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';


export default function CreateMenu() {
  const [CreateMenuAnchorEl, setCreateMenuAnchorEl] = useState(null);
  const isCreateMenuOpen = Boolean(CreateMenuAnchorEl);
  const navigate = useNavigate();

  const handleCreateMenuOpen = (event) => {
    setCreateMenuAnchorEl(event.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setCreateMenuAnchorEl(null);
  };

  const CreateMenuId = 'primary-search-main-menu';

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={handleCreateMenuOpen}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={CreateMenuAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={CreateMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isCreateMenuOpen}
        onClose={handleCreateMenuClose}
      >
        <MenuItem onClick={() => {navigate("/songs/new/"); handleCreateMenuClose();}}>New Song</MenuItem>
        <MenuItem onClick={() => {navigate("/albums/new/"); handleCreateMenuClose();}}>New Album</MenuItem>
      </Menu>
    </>
  );
}
