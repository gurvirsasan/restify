import { Button } from "@mui/material";
import OutlinedCard from "./feed_card";
import { useEffect, useState } from 'react'
// import _ from 'lodash';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const LandingPage = () => {
    const navigate = useNavigate()
    const [hasBlogs, setHasBlogs] = useState(false);
    const [blogs, setBlogs] = useState({}); 
    const [next_url, nextUrl] = useState('http://localhost:8000/restaurants/feed/'); 
    const [prev_url, prevUrl] = useState(null); 

    const loadNextBlogs = () => {
        fetch(next_url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                referrerPolicy: 'no-referrer'
            })
            .then(response => response.json())
            .then(data => { 
                if (data.results.length !== 0) {
                    setHasBlogs(true)
                }
                setBlogs({...data.results});
                prevUrl(data.previous);
                nextUrl(data.next);
        })
        .catch(error => console.log(error));
    };

    const loadPrevBlogs = () => {
        fetch(prev_url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                referrerPolicy: 'no-referrer'
            })
            .then(response => response.json())
            .then(data => { 
                if (data.results.length !== 0) {
                    setHasBlogs(true)
                } 
                setBlogs({...data.results});
                prevUrl(data.previous);
                nextUrl(data.next);
        })
        .catch(error => console.log(error));
    };

    const likeBlog = (rest_id, blog_id) => {
        let url = `http://localhost:8000/restaurants/${rest_id}/blog/${blog_id}/like/`;
        fetch(url,
            {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                referrerPolicy: 'no-referrer'
            })
            .then(response => response.json())
            .then(() => window.location.reload())
            .catch(error => console.log(error));
    }

    
    useEffect(() => {
        if (localStorage.getItem('token')) {loadNextBlogs();}
        else {
            navigate("/signin")
        }
    }, []);

    return (
        <div>
            {localStorage.getItem('token') && Object.entries(blogs).map(([key, value]) => (
            <>
            <Card 
                key={value.id}
                sx={{ 
                margin: '2em',  
                borderStyle: 'ridge',
                }}>
                <CardContent>
                    <Button style={{'fontWeight': 'bold', 'padding': "0"}} size="medium" onClick={() => navigate(`/restaurants/${value.restaurant_id}`)}>{value.restaurant_name}</Button>
                    <Typography style={{'fontWeight': 'bold'}} gutterBottom variant="h6" component="div">
                        {value.title}
                        <hr></hr>
                    </Typography>
                    <CardMedia sx={{maxWidth: 95}} component="img" image={value.image} />
                    <Typography>
                        {value.description}
                    </Typography>

                    <Box sx={{marginTop:"1em"}}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Likes: {value.likes}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Posted: {value.created_at.substring(0, 10)}
                        </Typography>
                    </Box>

                    <IconButton 
                        color="primary" 
                        fontSize="large"
                        sx={{marginTop:"1em"}} 
                        onClick={() => {
                            value.likes += 1;            
                            likeBlog(value.restaurant_id, value.id)
                            window.location.reload()
                        }}>
                        <ThumbUpIcon color="primary" fontSize="large"/>
                    </IconButton>

                </CardContent>       
            </Card> 
            </>
            ))}

            {!hasBlogs && 
            <Typography style={{margin: '2em', fontSize: '50px', fontWeight: 'bold'}}>
                Follow more restaurants for a feed!
            </Typography>}

            <Box
                margin={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
            <Stack direction="row" spacing={2}>
                {prev_url && <Button onClick={loadPrevBlogs} variant="outlined">Previous</Button>}
                {next_url && <Button onClick={loadNextBlogs} variant="outlined">Next</Button>}
            </Stack>
            </Box>
        </div>
    )
};

export default LandingPage
