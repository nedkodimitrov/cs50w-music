/*
* Fetch and display a collection of user/song/album cards depending on the provided url
* Supports infinite scroll by fetching data from the next url
*/
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
import UserCard from './UserCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useSearchParams } from 'react-router-dom';


const defaultTheme = createTheme();

export default function CardsCollection({url, infiniteScroll = false, setNum = (number) => {}}) {
  const [entities, setEntities] = useState([]);  // A list of users/songs/albums that will be displayed
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);
  const entityType = url.match(/\/(\w+)\//)?.[1] || 'Invalid URL format';  // Entity can be a user/song/album

  // I didn't manage to find a way to pass the search params as part of the url when I link a Route from App.js
  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [nextUrl, setNextUrl] = useState(url.includes(searchParamsString) ? url : `${url}?${searchParamsString}`);

  // Fetch data and retry if response status is 429 Too many requests. Set nextUrl for follow up calls to the function.
  const fetchData = async () => {
    setError(null);

    try {
      const response = await axiosInstance.get(nextUrl);
      setEntities((prevEntities) => [...prevEntities, ...response.data.results]);
      setNextUrl(response.data.next);
      setNum(response.data.count);  // total number of entities among all response pages
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
    // Inital data fetch
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchData();
    }
  }, [searchParamsString]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Some info about the collection */}
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
          <Container maxWidth="sm">
            <Typography variant="h5" align="center" color="text.primary" paragraph>
              {entityType}
            </Typography>
          </Container>
        </Box>
        
        <Container sx={{ py: 8 }} maxWidth="xl">
          {/* Infinite scroll calls fetchdata when the user scrolls to the bottom of the page */}
          <InfiniteScroll
            dataLength={entities.length}
            next={(nextUrl) => fetchData(nextUrl)}
            hasMore={!!nextUrl && infiniteScroll}
            loader={<CircularProgress size={24} style={{ margin: '24px auto' }} />}
            endMessage={infiniteScroll && <p>No more {entityType} to load.</p>}
          >
            <Grid container spacing={4}>
              {entities.map((entity) => (
                <Grid item key={entity.id} xs={6} sm={4} md={3} lg={2}>
                  {/*depending on the type of the entity display either a user card or a release card that contains song/album */}
                  {entityType === "users" && <UserCard user={entity}/>}
                  {["songs", "albums"].includes(entityType) && <ReleaseCard release={entity} releaseType={entityType} />}
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
          {error && <Alert severity="error">Error loading {entityType}. {error}</Alert>}
        </Container>
      </main>
    </ThemeProvider>
  );
}