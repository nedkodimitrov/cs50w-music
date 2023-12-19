import React, { useEffect, useState, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axiosInstance from './axiosInstance';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReleaseCard from './ReleaseCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useSearchParams } from 'react-router-dom';



const defaultTheme = createTheme();

export default function ReleaseCardsCollection({url, infiniteScroll = false, setNum = (number) => {}}) {
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);
  const releaseType = url.startsWith("/songs") ? "song" : "album";
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [nextUrl, setNextUrl] = useState(`${url}${searchQuery ? `?search=${searchQuery}` : ''}`);

  // Fetch data and retry if response status is 429 Too many requests
  const fetchData = async () => {
    setError(null);

    try {
      const response = await axiosInstance.get(nextUrl);
      console.log(nextUrl);
      setReleases((prevReleases) => [...prevReleases, ...response.data.results]);
      setNextUrl(response.data.next);
      setNum(response.data.count);
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("Rate limit exceeded. Retrying after a short delay.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData();
      } else {
        setError(error);
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchData();
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
      <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
          <Container maxWidth="sm">
            <Typography variant="h5" align="center" color="text.primary" paragraph>
              {releaseType}s
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="xl">
        <InfiniteScroll
            dataLength={releases.length}
            next={(nextUrl) => fetchData(nextUrl)}
            hasMore={!!nextUrl && infiniteScroll}
            loader={<CircularProgress size={24} style={{ margin: '24px auto' }} />}
            endMessage={infiniteScroll && <p>No more {releaseType}s to load.</p>}
          >
            <Grid container spacing={4}>
              {releases.map((release) => (
                <Grid item key={release.id} xs={6} sm={4} md={3} lg={2}>
                  <ReleaseCard release={release} releaseType={releaseType} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
          {error && <Alert severity="error">Error loading {releaseType}s. {error}</Alert>}
        </Container>
      </main>
    </ThemeProvider>
  );
}
