import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';
import RequesedArtistsCardsCollection from './RequesedArtistsCardsCollection';

const defaultTheme = createTheme();

export default function EditRelease({ releaseType = "song" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { id } = useParams();
  const genreOptions = ["rap", "pop", "rock"].map(option => ({ value: option, label: option }));
  const isInitialMount = useRef(true);
  const [potentialArtists, setPotentialArtists] = useState([]);
  const [potentialArtistsSearchTerm, setPotentialArtistsSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    audio_file: '',
    cover_image: '',
    release_date: '',
    album: '',
    genre: '',
    artists: {},
    requested_artists: {}
  });

  useEffect(() => {
    // Fetch artists based on the search term
    const fetchArtists = async () => {
      try {
        const response = await axiosInstance.get(`/users/?search=${potentialArtistsSearchTerm}`);
        setPotentialArtists(response.data.results);

      } catch (error) {
        console.error("Error fetching artists.", error);
      }
    };

    fetchArtists();
  }, [releaseType, potentialArtistsSearchTerm]);

  useEffect(() => {
    // Fetch albums based on user ID
    const fetchAlbums = async () => {
      try {
        let nextUrl = `/albums/?artists__id=${userId}`;
        let allAlbums = [];
  
        while (nextUrl) {
          try {
            const response = await axiosInstance.get(nextUrl);
            const { results, next } = response.data;
            allAlbums = [...allAlbums, ...results];
            nextUrl = next;
          } catch (error) {
            if (error.response?.status === 429) {
              console.warn("Rate limit exceeded. Retrying after a short delay.");
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
  
        setAlbums(allAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };
  
    // Inital data fetch
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchAlbums();
    }
  }, [releaseType, userId]);

  useEffect(() => {
    const fetchReleaseData = async () => {
      try {
        const response = await axiosInstance.get(`/${releaseType}s/${id}/`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching release data:', error);
      }
    };

    if (id) {
      fetchReleaseData();
    }
  }, [id, releaseType]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const newFormData = new FormData(form);

    const filteredFormData = new FormData();
    for (const [key, value] of newFormData.entries()) {
      if (value !== '' && value?.name !== '') {
        filteredFormData.append(key, value);
      }
    }
  
    try {
      setIsLoading(true);

      const response = await axiosInstance.patch(`/${releaseType}s/${id}/`, filteredFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/${releaseType}s/${id}`);
    } catch (error) {
      handleErrors(error);
      setIsLoading(false);
    }
  };
  
  const handleErrors = (error) => {
    if (error.response?.data) {
      setErrors({});
      Object.keys(error.response.data).forEach((key) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: error.response.data[key].join('\n'),
        }));
      });
    } else {
      setErrors({ message: error.message });
    }
  };

  const handleSubmitRequestArtist = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/${releaseType}s/${id}/manage_requested_artists/`, form);
      window.location.reload();
    } catch (error) {
      handleErrors(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
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
            <EditIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit {releaseType}
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="title"
                      name="title"
                      fullWidth
                      id="title"
                      label={`${releaseType.charAt(0).toUpperCase() + releaseType.slice(1)} Title`}
                      error={Boolean(errors.title)}
                      helperText={errors.title}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </Grid>
                  {releaseType === "song" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="audio_file"
                        label="Audio File"
                        name="audio_file"
                        type="file"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => setFormData({ ...formData, audio_file: e.target.files[0] })}
                        error={Boolean(errors.audio_file)}
                        helperText={errors.audio_file}
                      />
                    </Grid>
                  )}
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
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.files[0] })}
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
                      value={formData.release_date}
                      onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    />
                  </Grid>
                  {releaseType === "song" && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Select album"
                          name="album"
                          id="album"  
                          error={Boolean(errors.album)}
                          helperText={errors.album}
                          variant="outlined"
                          value={formData.album || ""}
                          onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                          InputLabelProps={{
                            shrink: Boolean(formData.album),
                          }}
                        >
                        {albums.map((album) => (
                          <MenuItem key={album.id} value={album.id}>
                            {album.title}
                          </MenuItem>
                        ))}
                      </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Select Genre"
                          name="genre"
                          id="genre"
                          value={formData.genre || ""}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                          error={Boolean(errors.genre)}
                          helperText={errors.genre}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: Boolean(formData.genre),
                          }}
                        >
                          {genreOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </>
                  )}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Editing...' : `Edit ${releaseType}`}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box component="form" onSubmit={handleSubmitRequestArtist} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <Select
                    required
                    options={potentialArtists
                      .filter((artist) => 
                        !Object.keys(formData.requested_artists).includes(artist.id.toString()) && 
                        !Object.keys(formData.artists).includes(artist.id.toString())
                      )
                      .map((artist) => ({ value: artist.id, label: artist.username }))
                    }
                    placeholder="Request an artist"
                    name="artist_id"
                    id="request-artist"
                    onInputChange={(value) => setPotentialArtistsSearchTerm(value)}
                    isSearchable
                    error={Boolean(errors.album)}
                    helperText={errors.album}
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Requesting...' : `Request`}
                </Button>
              </Box>

              <RequesedArtistsCardsCollection requestedArtists={formData.requested_artists} url={`/${releaseType}s/${id}/manage_requested_artists/`}/>
            </Grid>
          </Grid>

          <Link href={`/${releaseType}s/${id}`} variant="body2">
            Cancel
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
