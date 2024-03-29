/* Menu item that includes Sign out link and handles sign out. */
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const SignOutMenuItem = ({setIsAuth}) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
    axiosInstance.post('logout/')
        .then(() => {
            // Remove token and user id from the local storage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setIsAuth(false);
            navigate('/login');
        })
        .catch(error => {
            console.error('Error during sign-out:', error);
        });
    };

    return (
        <MenuItem onClick={handleSignOut}>
            Sign out
        </MenuItem>
    );
};

export default SignOutMenuItem;