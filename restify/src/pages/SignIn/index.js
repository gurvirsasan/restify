import React, { useState } from 'react';

import { TextField, Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { textAlign } from '@mui/system';

const SignIn = () => {
    const navigate = useNavigate();
    const [signinForm, setSigninForm] = useState({
        username: '',
        password: '',
    });
    const [signinErrors, setSigninErrors] = useState({
        username: '',
        password: '',
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setSigninErrors({...signinErrors, [e.target.name]: errMsg})
        } else {
            setSigninErrors({...signinErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setSigninForm({ ...signinForm, [e.target.name]: e.target.value });
        setSigninErrors({ ...signinErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    // On submit function!
    const handleSubmit = (e) => {
        // Prevent reload
        e.preventDefault();
        // Make API calls here. 
        fetch('http://localhost:8000/accounts/signin/', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(signinForm)
        })
        .then(data => data.json())
        .then(res => {
            if (res.access){ 
                localStorage.setItem("token", res.access);
            } else {
                localStorage.removeItem('token')
            }
            navigate('/');
            window.location.reload();
        })
        .catch((error) => console.error('Error:', error));
    
        // 2. send user to the signin page
    }

    if ( localStorage.getItem('token') ){
        return (<h2 style={{'marginLeft':'10px'}}>You're already logged in!</h2>)
    }

    return (
    <Box
        display='flex'
        justifyContent='center'
        sx={{ position: 'absolute', width: '100vw' }}
    >
        <Box 
            display='flex'
            justifyContent='center'
            sx={{ width: '40%' }} 
            component='form'
            onSubmit={handleSubmit}
        >
            <Grid 
                container
                spacing={2}
                style={{"margin":"10px"}}
            >
                <Grid item sm={12}>
                    <h1>
                        SIGN IN
                    </h1>
                    {
                        signinErrors.password !== "" && 
                        <>
                            <h4 style={{color: "red"}}> Your password should have:</h4>
                            <ul style={{color: "red"}}>
                                <li> Have at least 8 characters </li>
                                <li> Have at least one capital letter </li>
                                <li> Have at least one lower case letter</li>
                                <li> Have a number </li>
                                <li> Have a special character</li>
                            </ul>
                        </>
                    }
                </Grid>
                <Grid item sm={12} marginY='5px'>
                    <TextField
                        name='username'
                        label='username'
                        size='small'
                        variant='standard'
                        fullWidth
                        required
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^\w{6,}$/,
                                signinForm.username,
                                e,
                                'Please enter a valid username'
                            )
                        }
                        error={signinErrors.username !== ''}
                        helperText={signinErrors.username}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='password'
                        label='password'
                        type={'password'}
                        size='small'
                        variant='standard'
                        fullWidth
                        required
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}/,
                                signinForm.password,
                                e,
                                'Please enter a valid password'
                            )
                        }
                        error={signinErrors.password !== ''}
                        helperText={signinErrors.password}
                    />
                </Grid>
                <Grid item sm={5}>
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                        style={{'marginTop': '1.5em'}}
                        disabled={
                            !(
                                signinErrors.username === '' &&
                                signinErrors.password === '' 
                            )
                        }
                    >
                    Sign In
                    </Button>
                </Grid>

            </Grid> 
        </Box>

    </Box>
    )
}

export default SignIn