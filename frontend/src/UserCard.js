/*
* A card that shows some brief information about a user and links to their profile
*/

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


export default function UserCard({user}) {
    return (
        <Link href={`/users/${user.id}`} underline="none">
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Default image for user */}
                <CardMedia
                component="div"
                sx={{
                    // 16:9
                    pt: '56.25%',
                }}
                //image={user.profile_picture || 'https://wallpapers.com/images/featured/smiley-default-pfp-0ujhadx5fhnhydlb.jpg'}                  
                image={'https://wallpapers.com/images/featured/smiley-default-pfp-0ujhadx5fhnhydlb.jpg'}                  
                />

                {/*Username*/}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {user.username}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}