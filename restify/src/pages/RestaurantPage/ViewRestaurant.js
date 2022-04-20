import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardActions, CardMedia, Typography, Box, Grid, Menu } from '@mui/material';
import RestaurantCard from '../../components/AllRestaurants';
import MenuItem from '../../components/Menu';
import ImageItem from '../../components/AddImage';
import BlogItem from '../../components/Blog';
import CommentItem from '../../components/Comment';
import { IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const ViewRestaurant = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [restaurantPage, setRestaurantPage] = useState({
        name: '',
        general_info: '',
        location: '',
        type: '',
        postal_code: '',
        phone: '',
        icon: "",
        followers: "",
        timestamp: "",
        updated: "",
        owner: {},
        menu: {},
        fans: [],
        likes: [],
        gallery: [],
        comments: [],
        blogs: []
    });

    const [userOwnsRest, setUserOwnsRest] = useState(false)

    const [userFollowsThisRest, setUserFollowsThisRest] = useState(false)
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

    const likeRestaurant = (id) => {
        fetch(`http://localhost:8000/restaurants/${id}/like/`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token')
                },
        })
        .then(data => data.json())
        .then(() => {
            window.location.reload()
        })
        .catch((error) => console.error('Error:', error));
    }

    // like comment
    const [commentLiked, setCommentLiked] = useState(false);
    const likeComment = (id, commentid) => {
        fetch(`http://localhost:8000/restaurants/${id}/comment/${commentid}/like/`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
        })
        .then(data => data.json())
        .then(res => {
            setCommentLiked(!commentLiked)
        })
        .catch((error) => console.error('Error:', error));
    }
    
    const [blogLiked, setBlogLiked] = useState(false);
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
            .then(res => {
                setBlogLiked(!blogLiked)
            })
            .catch(error => console.log(error));
    }

    const deleteMenuItem = (id, itemId) => {
        fetch(`http://localhost:8000/restaurants/${id}/menu/${itemId}/delete/`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            referrerPolicy: 'no-referrer',
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
        window.location.reload()
    }

    const deleteBlog = (id, blogId) => {
        fetch(`http://localhost:8000/restaurants/${id}/blog/${blogId}/delete/`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            referrerPolicy: 'no-referrer',
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
        window.location.reload()
    }

    useEffect(() => {
        if (!localStorage.getItem('token')){
            navigate('/signin')
            return 
        }
        
        fetch(`http://localhost:8000/restaurants/${id}/`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Accept': 'application/json'
            },
            referrerPolicy: 'no-referrer',
        })
        .then(data => data.json())
        .then(res => {
            setRestaurantPage(res); 
        })
        .catch((error) => console.error('Error:', error));

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
            if (res['user']['restaurants_owned'][0] !== 'Not Applicable') {
                if (res['user']['restaurants_owned'][0].id == id) {
                    setUserOwnsRest(true)
                }
                
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
            }
        })
        .catch((error) => console.error('Error:', error));


    }, [commentLiked, blogLiked, userFollowsThisRest])

    const allMenuItems = {};
    const fullMenu = [];

    if (restaurantPage.menu.items !== []){
        for (const key in restaurantPage.menu.items){
            const item = restaurantPage.menu.items[key];
            var name = item.name;
            allMenuItems[name] = [];
        }
        
        for (const key in restaurantPage.menu.items){
            const item = restaurantPage.menu.items[key];
            var name = item.name;

            allMenuItems[name].push(
                <>
                    <Card sx={{ 
                        margin: '2em',  
                        borderStyle: 'ridge',
                    }}>
                        <CardContent>
                            <CardMedia sx={{ maxWidth: 95 }} component="img" image={item.item_image} />
                            <Typography variant="subtitle1" color="green">
                                ${item.price}
                            </Typography>
                            <Box sx={{marginTop:"1em"}}>
                                <Typography style={{'fontStyle': 'italic'}} variant="subtitle2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </Box>
                            {userOwnsRest && 
                            <Grid container>
                                <Grid item xs={9}> </Grid>
                                <Grid item xs={3}>
                                    <Button 
                                    style={{'marginLeft': '2em', 'backgroundColor': 'red', 'color': 'white'}} 
                                    variant='contained' 
                                    onClick={() => deleteMenuItem(id, item.id)}
                                >Delete</Button>
                                </Grid>
                            </Grid>
                            }
                        </CardContent>       
                    </Card>
                </>
            )
        }

        for (const firstKey in allMenuItems){
            fullMenu.push(
                <Typography  style={{"margin": '2rem', 'color': 'green', 'fontWeight': 'bold'}}  gutterBottom variant="h6" component="div">
                    {firstKey.toUpperCase()}
                </Typography>
            )
            for (const secondKey in allMenuItems[firstKey]){
                fullMenu.push(allMenuItems[firstKey][secondKey]);
            }
        }
    }

    const allBlogs = [];
    if (restaurantPage.blogs !== []){
        for (const key in restaurantPage.blogs){
            const blog = restaurantPage.blogs[key];
            allBlogs.push(
                <>
            <Card sx={{ 
                margin: '2em',  
                borderStyle: 'ridge',
            }}>
                <CardContent>
                <Typography style={{'fontWeight': 'bold'}} gutterBottom variant="h6" component="div">
                            {blog.title}
                            <hr></hr>
                        </Typography>
                        <CardMedia sx={{maxWidth: 95}} component="img" image={blog.image} />
                        <Typography style={{'fontStyle': 'italic'}} variant="subtitle1" color="text.secondary">
                            {blog.description}
                        </Typography>
                        
                        
                        {userOwnsRest && 

                            <Grid container>
                                <Grid item xs={9}>
                                    <IconButton 
                                        color="primary" 
                                        fontSize="large"
                                        sx={{marginTop:"1em"}} 
                                        onClick={() => {        
                                            likeBlog(id, blog.id)
                                        }}>
                                        <ThumbUpIcon color="primary" fontSize="large"/>
                                    </IconButton>    
                                </Grid>
                                <Grid item xs={3}>
                                    <Button 
                                    style={{'marginLeft': '2em', 'backgroundColor': 'red', 'color': 'white'}} 
                                    variant='contained' 
                                    onClick={() => deleteBlog(id, blog.id)}
                                    >Delete</Button>
                                </Grid>
                            </Grid>                            
                        }

                        <Box sx={{marginTop:"1em"}}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Likes: {blog.likes.length}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Posted: {blog.created_at.substring(0, 10)}
                            </Typography>
                        </Box>
                </CardContent>       
            </Card>
            </>
            )
        }
    };


    const allComments = [];
    for (var i = 0; i < restaurantPage.comments.length; i++) {
        const comment = restaurantPage.comments[i];
        allComments.push(
            <>
            <Card sx={{ 
                margin: '2em',  
                borderStyle: 'ridge',
            }}>
                <CardContent>


                    <Typography style={{'fontWeight': 'bold'}} gutterBottom variant="h6" component="div">
                        {comment.author.username}
                        <hr></hr>
                    </Typography>
                    <Typography style={{'fontStyle': 'italic'}} variant="subtitle1" color="text.secondary">
                        {comment.text}
                    </Typography>
    
                    <Box sx={{marginTop:"1em"}}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Likes: {comment.likes.length}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Author Email: {comment.author.email}
                        </Typography>
                    </Box>
                    <IconButton sx={{marginTop:"1em"}} onClick={() => {likeComment(id, comment.id)}}>
                        <ThumbUpIcon color="primary" fontSize="large"></ThumbUpIcon>
                    </IconButton>



                </CardContent>       
            </Card>
            </>
        )
    }

    const allImages = [];
    if (restaurantPage.gallery !== []){
        for (const key in restaurantPage.gallery){
            const image = restaurantPage.gallery[key];
            allImages.push(
                <>
                <Card sx={{ margin: '2em', borderStyle: 'ridge' }}>
                    <CardContent>
                    <Typography gutterBottom variant="subtitle2" component="div">
                                {image.name}
                                <hr></hr>
                            </Typography>
                            <CardMedia sx={{maxWidth: 200}} component="img" image={image.image} />
                    </CardContent>       
                </Card>
                </>
            )
        }
    };


    // Show blogs, show menu, show restaurant data, show create blogs, show create menu
    return(<>
        <Typography style={{'fontStyle': 'bold', 'margin': '2rem', 'fontWeight': 'bold'}} variant="h3">Restaurant</Typography>
        <Card sx={{ 
            margin: '2em',  
            borderStyle: 'ridge',
        }}>
        <Typography style={{"margin": '1rem', 'color': 'green'}} gutterBottom variant="subtitle2" component="div">
            {restaurantPage.type.toUpperCase()} RESTAURANT
        </Typography>
        <Typography style={{"margin": '1rem', 'color': 'green'}} gutterBottom variant="subtitle2" component="div">
            {restaurantPage.owner.email}
        </Typography>
            <CardContent>
            <Grid container>

                {/* The left side */}
                <Grid item xs={9} paddingRight={"10px"}>
                    <Typography style={{'fontWeight': 'bold'}} gutterBottom variant="h3" component="div">
                        {restaurantPage.name}
                    </Typography>
                    <Typography style={{'fontStyle': 'italic'}} variant="body1" color="text.secondary">
                        {restaurantPage.general_info}
                    </Typography>
                </Grid>

                {/* The right side */}
                <Grid item xs={4}>
                <CardMedia component="img" image={restaurantPage.icon} />
                    <Box sx={{marginTop:"1em"}}>
                        <Typography variant="body1">
                            Followers: {restaurantPage.followers}
                        </Typography>
                        <Typography variant="body1">
                            Likes: {restaurantPage.likes.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Location: {restaurantPage.location} {restaurantPage.postal_code ? ",": ""} {restaurantPage.postal_code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone: {restaurantPage.phone}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </CardContent>
        
        <hr/>
        <footer style={{'color': 'gray', 'fontSize': '0.8rem', 'margin': '1rem'}}>
            Updated: {restaurantPage.updated.substring(0,10)} | {restaurantPage.owner.username}'s Restaurant
        </footer>        
        </Card>
        
            <Button 
                size="small"
                variant='outlined'
                onClick={() => followRestaurant(id)}
                sx={{backgroundColor: 'green', color: 'white', marginLeft: '20px'}}
            >Follow / Unfollow</Button>

            <Button 
                size="small"
                variant='outlined'
                onClick={() => likeRestaurant(id)}
                sx={{backgroundColor: 'green', color: 'white', marginLeft: '20px'}}
            >Like / Unlike</Button>
            

        {/* menu component */}
        <hr></hr>
        <Typography style={{'fontStyle': 'bold', 'margin': '2rem', 'marginBottom': '-2rem', 'fontWeight': 'bold'}} variant="h4">Menu</Typography>
        {
            userOwnsRest &&
            <Grid container sx={{minHeight: "400px"}}>
                <Grid item xs={8}>
                    <div>{fullMenu}</div>
                </Grid>
                <Grid item xs={4}>
                    <MenuItem id={id} style={{marginTop: '-2em'}}/>
                </Grid>
            </Grid>
        }
        {
            !userOwnsRest &&
            <Grid container sx={{minHeight: "50px"}}>
                <div>{fullMenu}</div>
            </Grid>
        }
        
        
        {/* blog component */}
        <hr></hr>
        
        <Typography style={{'fontStyle': 'bold', 'margin': '2rem', 'marginBottom': '-2rem', 'fontWeight': 'bold'}} variant="h4">Blogs</Typography>
        {userOwnsRest && 
            <Grid container sx={{minHeight: "400px"}}>
            <Grid item xs={8}>
                <div style={{marginBottom: "20px"}}>{allBlogs}</div>
            </Grid>
            <Grid item xs={4}>
                <BlogItem id={id}/>
            </Grid>
        </Grid>
        }
        {
            !userOwnsRest &&
            <Grid container sx={{minHeight: "50px"}}>
                <div>{allBlogs}</div>
            </Grid>
        }
        

        {/* comment component */}
        <hr></hr>
        <Typography style={{'fontStyle': 'bold', 'margin': '2rem', 'marginBottom': '-2rem','fontWeight': 'bold'}} variant="h4">Comments</Typography>
        <Grid container sx={{minHeight: "400px"}}>
            <Grid item xs={8}>
                <div>{allComments}</div>
            </Grid>
            <Grid item xs={4}>
                <CommentItem id={id}/>
            </Grid>
        </Grid>

        {/* Image component */}
        <hr></hr>
        <Typography style={{'fontStyle': 'bold', 'margin': '2rem', 'marginBottom': '-2rem','fontWeight': 'bold'}} variant="h4">Gallery</Typography>
        <Grid container sx={{minHeight: "400px"}}>
            <Grid item xs={3}>
                <div>{allImages}</div>
            </Grid>
            <Grid item xs={4}>
                <ImageItem id={id}/>
            </Grid>
        </Grid>
        </>)

}
export default ViewRestaurant