import React, { useState, useEffect } from 'react';

import { TextField, Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {

    const navigate = useNavigate();

    // const [userInfo, setUserInfo] = useState({
    //     username: "",
    //     first_name: "",
    //     last_name: "",
    //     email: "",
    //     avatar: "",
    //     restaurants_owned: [],
    //     restaurants_followed: [],
    //     comments: []
    // });

    const [editForm, setEditForm] = useState({
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar: null,
    });

    useEffect(() => {
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
            setEditForm({
                username: res['user'].username,
                password: '',
                password2: 'something',
                first_name: res['user'].first_name,
                last_name: res['user'].last_name,
                email: res['user'].email,
                // avatar: res['user'].avatar,
            })
        })
        .catch((error) => console.error('Error:', error));
    }, []);


    const [editFormErrors, setEditFormErrors] = useState({
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar: null,
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setEditFormErrors({...editFormErrors, [e.target.name]: errMsg})
        } else {
            setEditFormErrors({...editFormErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
        setEditFormErrors({ ...editFormErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const handleImageUpload = (e) => {
        const target = e.target
        setEditForm({ ...editForm, avatar: (target.files)[0] });
    };

    // On submit function!
    const handleSubmit = (e) => {
        // Prevent reload
        e.preventDefault();
        
        let formData = new FormData();    //formdata object

        formData.append('username', editForm.username);   //append the values with key, value pair
        formData.append('password', editForm.password); 
        formData.append('password2', editForm.password2); 
        formData.append('first_name', editForm.first_name); 
        formData.append('last_name', editForm.last_name); 
        formData.append('email', editForm.email); 
        if (editForm.avatar){
            formData.append('avatar', editForm.avatar); 
        }

        // Make API calls here. 
        fetch('http://localhost:8000/accounts/update/', {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Accept': 'application/json'
                // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },
            referrerPolicy: 'no-referrer',
            // body: JSON.stringify(editForm)
            body: formData
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
    
        // 2. send user to the signin page
        navigate('/');
    }

    // authenticate!
    if (!localStorage.getItem('token')){
        navigate('/signin')
        return
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
                            EDIT PROFILE
                        </h1>
                    </Grid>
                    <Grid item sm={12}>
                        <h3> Username: {editForm.username.toUpperCase()}</h3>
                        <p style={{
                            'color':'red', 
                            'fontStyle': "italic",
                            'fontSize': 11,
                            'marginTop': -10
                            }}>
                            Cannot change Username
                        </p>
                    </Grid>
                    <Grid item sm={12}>
                        <TextField
                            name='password'
                            label='new password'
                            type={'password'}
                            size='small'
                            required
                            variant='standard'
                            fullWidth
                            onChange={handleInputHooks}
                            onBlur={(e) =>
                                onBlurValidation(
                                    /^$|^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}/,
                                    editForm.password,
                                    e,
                                    'Please enter a valid password'
                                )
                            }
                            error={editFormErrors.password !== ''}
                            helperText={editFormErrors.password}
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
                            defaultValue={editForm.last_name}
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
                                    editForm.email,
                                    e,
                                    'Please enter a valid email'
                                )
                            }
                            error={editFormErrors.email !== ''}
                            helperText={editFormErrors.email}
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
                    <Grid item sm={3}>
                        <Button 
                            variant='contained' 
                            style={{'marginTop': '1.5em'}}
                            onClick={() => navigate('/profile')}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item sm={5}>
                        <Button
                            type='submit'
                            variant='contained'
                            fullWidth
                            style={{'marginTop': '1.5em',  'backgroundColor': 'green'}}
                        >
                        Update
                        </Button>
                    </Grid>
    
                </Grid> 
            </Box>
    
        </Box>
        )
}
export default ProfileEdit