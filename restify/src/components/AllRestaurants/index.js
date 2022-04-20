import { Button, Card, CardContent, CardActions, CardMedia, Typography, Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurant_default_icon from "../../restaurant_default_icon.png"



const RestaurantCard = (props) => {
    const navigate = useNavigate()
    const {id, name, general_info, followers, location, postal_code, icon, followerNumber} = props

    const [userFollowsThisRest, setUserFollowsThisRest] = useState(false)
    const [followersToDisplay, setFollowersToDisplay] = useState(followerNumber)


    const followRestaurant = (id) => {
        fetch(`http://localhost:8000/restaurants/${id}/follow/`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token')
                },
        })
        .then(data => data.json())
        .then(() => {
            setUserFollowsThisRest(!userFollowsThisRest);
        })
        .catch((error) => console.error('Error:', error));
    }


    useEffect(() => {
        // make a get request for the given user
        if (!localStorage.getItem('token')){
            navigate('/signin')
            return 
        }
        fetch('http://localhost:8000/accounts/profile/', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
        })
        .then(data => data.json())
        .then(res => {
            let isFollowing = false
            for (const restaurant of res['user']['restaurants_followed']) {
                if (restaurant.id == id) {
                    setUserFollowsThisRest(true);
                    isFollowing = true
                }
            }
            if (!isFollowing) {
                setUserFollowsThisRest(false)
            }
        })
        .catch((error) => console.error('Error:', error));

    }, [])

    return (<>
    <Card sx={{ 
        margin: '2em',  
        borderStyle: 'ridge',
    }}>
        <CardMedia
            component="img"
            height="300"
            image={icon ? icon: restaurant_default_icon}
            alt="green iguana"
        />
        <CardContent>
            <Grid container>

                {/* The left side */}
                <Grid item xs={9} paddingRight={"30px"}>
                    <Typography gutterBottom 
                        variant="h5" 
                        component="div" 
                        sx={{fontWeight: 'bold'}}
                        >
                        {name.toUpperCase()}
                    </Typography>
                    <Typography variant="body" color="text.secondary">
                        {general_info}
                    </Typography>
                </Grid>

                {/* The right side */}
                <Grid item xs={3}>
                    <Box sx={{marginTop:"1em"}}>
                        <p><b>Followers:</b> {followersToDisplay}</p>
                        <p><b>Location: </b>{location}</p>
                        {postal_code && <p><b>Postal Code: </b> {postal_code} </p>}
                    </Box>
                </Grid>

            </Grid>
        </CardContent>
        <CardActions>
            <Button 
                size="small"
                variant='outlined'
                onClick={() => navigate(`/restaurants/${id}`)
            }>Read More</Button>
            <Button 
                size="small"
                variant='outlined'
                onClick={() => followRestaurant(id)}
                sx={{backgroundColor: 'green', color: 'white'}}
            >Follow / Unfollow</Button>
        </CardActions>
    </Card>
    </>)

}
export default RestaurantCard;