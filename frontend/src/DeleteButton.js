/*
Button for deleting a song/album 
Asks for confirmation
*/

import React from 'react';
import Button from '@mui/material/Button';
import axiosInstance from './axiosInstance';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const DeleteButton = ({id, releaseType }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Call the API to delete a song/album
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/${releaseType}s/${id}/`);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* the delete button */}
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleOpen}
      >
        Delete
      </Button>

      {/* Dialog that asks for confirmation */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
