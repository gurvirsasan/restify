import { Grid, Box, StepConnector } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import { useState } from 'react';

const Layout = () => {
    const navigate = useNavigate()
    return (
    <div>
        <Grid 
            container
            display={"flex"}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid item sm={12} >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginY: '-20px'
                }}>
                    <h1>RESTIFY</h1>
                </Box>
            </Grid>
            <Grid item sm={12} >
                
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <nav>
                        <Button variant="outlined" onClick={() => navigate("/")}>Feed</Button>
                        <Button variant="outlined" onClick={() => navigate("/restaurants")}>All Restaurants</Button>
                        <Button variant="outlined" onClick={() => navigate("/profile")}>Profile</Button>
                        <Button variant="outlined" onClick={() => navigate("/signup")}>Sign Up</Button>
                        {localStorage.getItem('token') && <Button variant="outlined" onClick={() => {
                                                    localStorage.removeItem('token')
                                                    // setLoggedIn(!loggedIn)
                                                    navigate("/signin")
                                                }}>Sign Out</Button>}
                        {!localStorage.getItem('token') && <Button variant="outlined" onClick={() => {
                            // setLoggedIn(!loggedIn)
                            navigate("/signin")
                        }}>Sign In</Button>}
                    </nav>
                </Box>
            </Grid>
        </Grid>
        
        <StepConnector/>

        <Outlet />
    </div>)
}

export default Layout