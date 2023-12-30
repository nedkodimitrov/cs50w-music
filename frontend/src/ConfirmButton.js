/* Button for users to confirm to be added as an artist of a song/album when they have been requested. */

import React from 'react';
import Button from '@mui/material/Button';
import axiosInstance from './axiosInstance';

const ConfirmButton = ({ releaseType, id }) => {
  // Call the API to confirm
  const handleSubmitConfirmRequest = async () => {
    try {
      const response = await axiosInstance.post(`${releaseType}/${id}/confirm_current_user_as_artist/`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      onClick={handleSubmitConfirmRequest}
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      Confirm Request to be added as an Artist
    </Button>
  );
};

export default ConfirmButton;
