import React, { useState } from 'react';

import { TextField, Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar: undefined,
    });
    const [signupErrors, setSignupErrors] = useState({
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar: undefined,
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setSignupErrors({...signupErrors, [e.target.name]: errMsg})
        } else {
            setSignupErrors({...signupErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
        setSignupErrors({ ...signupErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const confirmRepeatPassword = (e) => {
        if (signupForm.password !== signupForm.password2)
            setSignupErrors({...signupErrors, [e.target.name]: "Passwords don't match"})
        else
            setSignupErrors({...signupErrors, [e.target.name]: ''})
    }

    const handleImageUpload = (e) => {
        const target = e.target
        setSignupForm({ ...signupForm, avatar: (target.files)[0] });
    };

    // On submit function!
    const handleSubmit = (e) => {
        // Prevent reload
        e.preventDefault();

        let formData = new FormData();    //formdata object

        formData.append('username', signupForm.username);   //append the values with key, value pair
        formData.append('password', signupForm.password); 
        formData.append('password2', signupForm.password2); 
        formData.append('first_name', signupForm.first_name); 
        formData.append('last_name', signupForm.last_name); 
        formData.append('email', signupForm.email); 
        if (signupForm.avatar){
            formData.append('avatar', signupForm.avatar); 
        }

        // Make API calls here. 
        fetch('http://localhost:8000/accounts/signup/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
                // 'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: formData
        })
        .then(data => data.json())
        .then(res => {
            if (localStorage.getItem('token')){
                localStorage.removeItem('token')
            }
            navigate('/signin');
            return
        })
        .catch((error) => console.error('Error:', error));
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
                    {localStorage.getItem('token') && <h3 style={{color: "green"}}>Creating a new account will log you out of the current account!</h3>}
                </Grid>
                <Grid item sm={12}>
                    <h1>
                        SIGN UP
                    </h1>

                    {
                        signupErrors.password !== "" && 
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
                <Grid item sm={12}>
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
                                signupForm.username,
                                e,
                                'Please enter a valid username'
                            )
                        }
                        error={signupErrors.username !== ''}
                        helperText={signupErrors.username}
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
                                signupForm.password,
                                e,
                                'Please enter a valid password'
                            )
                        }
                        error={signupErrors.password !== ''}
                        helperText={signupErrors.password}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='password2'
                        label='repeat password'
                        type={'password'}
                        size='small'
                        variant='standard'
                        fullWidth
                        required
                        onChange={handleInputHooks}
                        onBlur={(e) => confirmRepeatPassword(e)}
                        error={signupErrors.password2 !== ''}
                        helperText={signupErrors.password2}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='first_name'
                        label='first name'
                        size='small'
                        variant='standard'
                        fullWidth
                        onChange={handleInputHooks}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='last_name'
                        label='last name'
                        size='small'
                        variant='standard'
                        fullWidth
                        onChange={handleInputHooks}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='email'
                        label='email'
                        size='small'
                        variant='standard'
                        fullWidth
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^$|^.*@.*\..*$/,
                                signupForm.email,
                                e,
                                'Please enter a valid email'
                            )
                        }
                        error={signupErrors.email !== ''}
                        helperText={signupErrors.email}
                    />
                </Grid>

                {/* Image upload */}
                <Grid sm={12}>
                    <TextField
                        style={{'marginTop': '1em'}}
                        label='Upload avatar'
                        type='file'
                        fullWidth
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        onChange={handleImageUpload}
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
                                signupErrors.username === '' &&
                                signupErrors.password === '' 
                            )
                        }
                    >
                    Sign Up
                    </Button>
                </Grid>

            </Grid> 
        </Box>

    </Box>
    )
}

export default SignUp

// regex from: https://tinyurl.com/rbzzcbyh, https://tinyurl.com/4hpuy8ub 