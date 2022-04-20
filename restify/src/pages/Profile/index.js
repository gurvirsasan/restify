import { Button, Paper, Card, Grid, StepConnector, List } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import RestaurantEdit from '../RestaurantPage/RestaurantEdit';
import DeletePopUp from '../../components/Profile/DeletePopUp';
import AddMenuItem from "../../components/Menu"
import AddBlog from "../../components/Blog"

const Profile = () => {
    const navigate = useNavigate();

    // for the delete pop up
    const [openPopUp, setOpenPopUp] = useState(false)
    const [openRestPopUp, setOpenRestPopUp] = useState(false)

    const [toggleRestEdit, setToggleRestEdit] = useState(false);

    const [restaurantInfo, setRestaurantInfo] = useState({
        followers: 0,
        general_info: "",
        icon: "",
        id: 0,
        location: "",
        menu_id: 1,
        name: "",
        owner_id: 1,
        phone: null,
        postal_code: null,
        timestamp: "",
        type: "",
        updated: "",
    })

    const [userInfo, setUserInfo] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        avatar: "",
        restaurants_owned: [],
        restaurants_followed: [],
        comments: []
    });

    const handleDeleteAccount = () => {
        // call the delete account endpoint
        fetch('http://localhost:8000/accounts/delete/', {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            },
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
        // log the user out
        localStorage.removeItem('token');
        // send user to the signin page
        navigate('/signin');
    }

    const handleDeleteRestaurant = () => {
        const id = restaurantInfo.id;

        // call the delete restaurant endpoint
        fetch(`http://localhost:8000/restaurants/${id}/delete/`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            },
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
        window.location.reload(); 
    }

    useEffect(() => {
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
            setRestaurantInfo(res['user']['restaurants_owned'][0]);
            setUserInfo(res['user'])
        })
        .catch((error) => console.error('Error:', error));
    }, [])

    if (!localStorage.getItem('token')){
        navigate('/signin')
        return 
    }

    const hasRest = restaurantInfo !== 'Not Applicable';

    return (
        <>
        <Box style={{'margin':'1em'}}>
            <h3 style={{'marginLeft': '2em', color: '#6D1526'}}>
                {userInfo.username.toLocaleUpperCase()}'S PROFILE DATA
            </h3>
            <StepConnector/>
            <Box style={{'margin':'1em', 'padding': '1em', 'outline-style': 'inset'}}>

                <Grid container>
                    <Grid item xs={6}>
                        <p><b>Username:</b> {userInfo.username}</p>
                        <p><b>First name:</b> {userInfo.first_name}</p>
                        <p><b>Last name:</b> {userInfo.last_name}</p>
                        <p><b>Email:</b> {userInfo.email}</p>
                        <p><a href={userInfo.avatar}><b>Avatar</b></a></p>
                        {/* <p style={{'color': 'blue'}}><b>Avatar:</b> {userInfo.avatar}</p> */}
                        <img src={userInfo.avatar} alt="avatar" style={{'width': 150, 'height': 150, 'marginLeft': '1rem'}}></img>
                    </Grid>
                    <Grid item xs={6}>
                        <p>Restaurants Following:</p>

                        <Paper style={{maxHeight: 100, overflow: 'auto'}}>
                        <List>
                        {
                            userInfo.restaurants_followed.map((restaurant) =>  
                                <Button onClick={() => navigate(`/restaurants/${restaurant.id}`)}>{restaurant.name}</Button>
                            )
                        } 
                        


                        </List>
                        </Paper>
                        {!userInfo.restaurants_followed && <p>You're not follwoing any restaurants</p>}
                    </Grid>
                </Grid>
            </Box>
            
            <Button 
                style={{'marginLeft': '2em'}} 
                variant='contained' 
                onClick={() => navigate('/profile/edit')}
            >Edit
            </Button>

            <Button 
                style={{'marginLeft': '2em', 'backgroundColor': 'red', 'color': 'white'}} 
                variant='outlined' 
                onClick={() => setOpenPopUp(true)}
            >Delete User
            </Button>

            <DeletePopUp 
                openPopUp={openPopUp}
                handleClose={() => setOpenPopUp(false)}
                deleteAction={handleDeleteAccount}
            />

        </Box>

        {
            !hasRest && <Button style={{'marginLeft': '3em'}} variant='contained' onClick={() => navigate('create/restaurant')}>Create Restaurant</Button>
        }
        
        {
            hasRest && 
            
            <Box style={{'margin':'1em', 'paddingTop': '1em'}}>
                <h3 style={{'marginLeft': '2em', color: '#6D1526'}}>
                    {userInfo.username.toLocaleUpperCase()}'S RESTAURANT DATA
                </h3>
                <StepConnector/>
                <Box style={{'margin':'1em', 'padding': '1em', 'outline-style': 'inset'}}>
                    <p style={{'color': '#6D1526'}}><b>ID:</b> {restaurantInfo.id}</p>
                    <p><b>Name:</b> {restaurantInfo.name}</p>
                    <p><b>Description:</b> {restaurantInfo.general_info}</p>
                    <p><b>Followers:</b> {restaurantInfo.followers}</p>
                    <p><a href={restaurantInfo.icon}><b>Avatar</b></a></p>
                    <img src={restaurantInfo.icon} alt="icon" style={{'width': 150, 'height': 150, 'marginLeft': '1rem'}}></img>
                    <hr></hr>
                    <Button 
                        style={{'marginLeft': '2em'}} 
                        variant='contained' 
                        onClick={() => navigate(`/restaurants/${restaurantInfo.id}`)}
                    >View Detailed Page</Button> 
                </Box>


                {/* If restaurant edit component is rendered, show close button, otherwise Edit button */}
                {!toggleRestEdit ? 
                
                <Button 
                    style={{'marginLeft': '2em'}} 
                    variant='contained' 
                    onClick={() => 
                        setToggleRestEdit(!toggleRestEdit)}
                >Edit</Button> 
                : 
                <Button 
                    style={{'marginLeft': '2em'}} 
                    variant='contained' 
                    onClick={() => setToggleRestEdit(!toggleRestEdit)}>
                Close</Button>}
                
                { toggleRestEdit && 
                    <RestaurantEdit props={restaurantInfo}/> 
                }

                {/* Delete Restaurant Button */}
                <Button 
                    style={{'marginLeft': '2em', 'backgroundColor': 'red', 'color': 'white'}} 
                    variant='contained' 
                    onClick={() => setOpenRestPopUp(true)}
                >Delete Restaurant</Button>
                
                <DeletePopUp
                    openPopUp={openRestPopUp}
                    handleClose={() => setOpenRestPopUp(false)}
                    deleteAction={handleDeleteRestaurant}
                    title={"Delete Account Permanently"}
                    objectToDelete={"account"}
                />                

            </Box>

            /* && <RestaurantEdit/> */
        }
        
        </>
    )
}

export default Profile