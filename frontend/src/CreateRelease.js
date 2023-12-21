import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from 'react-select';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function CreateRelease({releaseType="song"}) {
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    // Fetch current user's albums that can be associated with the song
    const fetchAlbums = async () => {
      try {
          const response = await axiosInstance.get(`/albums/?artists__id=${userId}`);
          setAlbums(response.data.results);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    if (releaseType === "song") {
      fetchAlbums();
    }
  }, [releaseType]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`${releaseType}s/`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        const releaseId = response.data.id;
        navigate(`/${releaseType}s/${releaseId}`);
      }
    } catch (error) {
      console.log(error);
      handleErrors(error)
      setIsLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data) {
      setErrors({});
      Object.keys(error.response.data).forEach((key) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: error.response.data[key].join('\n'),
        }));
      });
    } else {
      setErrors({ "message": error.message });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Upload {releaseType}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="title"
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label={`${releaseType.charAt(0).toUpperCase() + releaseType.slice(1)} Title`}  // Capitalize releaseType
                  autoFocus
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Grid>
              {releaseType === "song" && <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="audio_file"
                  label="Audio File"
                  name="audio_file"
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(errors.audio_file)}
                  helperText={errors.audio_file}
                />
              </Grid>}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="cover_image"
                  label="Cover Image"
                  name="cover_image"
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(errors.cover_image)}
                  helperText={errors.cover_image}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="release_date"
                  label="Release Date"
                  name="release_date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0], // Set max date to today
                  }}
                  error={Boolean(errors.release_date)}
                  helperText={errors.release_date}
                />
              </Grid>
              {releaseType === "song" && <Grid item xs={12}>
                <Select
                  options={albums.map((album) => ({ value: album.id, label: album.title }))}
                  placeholder="Select album"
                  name="album"
                  id="album"
                  error={Boolean(errors.album)}
                  helperText={errors.album}
                />
              </Grid>}
              {releaseType === "song" && <Grid item xs={12}>
                <Select
                  options={["rap", "pop", "rock"].map(option => ({ value: option, label: option }))}
                  placeholder="Select genre"
                  name="genre"
                  id="genre"
                  error={Boolean(errors.genre)}
                  helperText={errors.genre}
                />
              </Grid>}
            </Grid>

            <Typography variant="body2" color="error">
              {errors.non_field_errors}
              {errors.message}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : `Upload ${releaseType}`}
            </Button>

            <Grid container direction="column">
              <Grid item>
                <Link href="/" variant="body2">
                  Cancel
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
