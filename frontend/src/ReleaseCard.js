/*
* A card that shows some brief information about a song/album and links to it
*/

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


export default function ReleaseCard({release, releaseType}) {
    return (
        <Link href={`/${releaseType}/${release.id}`} underline="none">
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Cover image or default image*/}
                <CardMedia
                component="div"
                sx={{
                    // 16:9
                    pt: '56.25%',
                }}
                image={
                    release.cover_image ||
                    (releaseType === "songs"
                      ? 'https://wallpapers.com/images/featured/music-notes-zpmz2slc377qu3wd.jpg'
                      : 'https://wallpapers.com/images/featured/the-beauty-of-minimalist-music-0y4974i4hkly0qjv.jpg')
                  }                  
                />
                {/* title */}
                <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {release.title}
                </Typography>

                {/* Artists relateded to the song/album */}
                <Typography>
                    {Object.entries(release.artists_usernames).map(([artistId, username], index, array) => (
                    <React.Fragment key={artistId}>
                        <Link href={`/users/${artistId}/`} variant="body2">
                            {username}
                        </Link>
                        {index < array.length - 1 && ', '}
                    </React.Fragment>
                    ))}
                </Typography>

                </CardContent>
            </Card>
        </Link>
    );
}