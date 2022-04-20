
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Grid, Box, Button } from '@mui/material';


const CreateRestaurant = () => {
    const navigate = useNavigate();

    const [restaurantForm, setRestaurantForm] = useState({
        name: "",
        general_info: "",
        location: "",
        type: "",
        postal_code: "",
        phone: "",
        icon: ""
    });

    const [restaurantFormErrors, setRestaurantFormErrors] = useState({
        name: "",
        general_info: "",
        location: "",
        type: "",
        postal_code: "",
        phone: "",
        icon: ""
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setRestaurantFormErrors({...restaurantFormErrors, [e.target.name]: errMsg})
        } else {
            setRestaurantFormErrors({...restaurantFormErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setRestaurantForm({ ...restaurantForm, [e.target.name]: e.target.value });
        setRestaurantFormErrors({ ...restaurantFormErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const handleImageUpload = (e) => {
        const target = e.target
        setRestaurantForm({ ...restaurantForm, icon: (target.files)[0] });
    };
    
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
            if (res['user']['restaurants_owned'][0] !== 'Not Applicable') {
                navigate('/profile')
            }
        })
        .catch((error) => console.error('Error:', error));

    }, [])

    // On submit function!
    const handleSubmit = (e) => {
        // Prevent reload
        e.preventDefault();

        let formData = new FormData();    //formdata object

        formData.append('name', restaurantForm.name);   //append the values with key, value pair
        formData.append('general_info', restaurantForm.general_info); 
        formData.append('location', restaurantForm.location); 
        formData.append('type', restaurantForm.type); 
        formData.append('postal_code', restaurantForm.postal_code); 
        formData.append('phone', restaurantForm.phone); 
        if (restaurantForm.icon){
            formData.append('icon', restaurantForm.icon); 
        }

        // Make API calls here. 
        fetch('http://localhost:8000/restaurants/create/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Accept': 'application/json',
            },
            referrerPolicy: 'no-referrer',
            body: formData
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
    
        // send the user to the profile page
        navigate('/profile');
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
                        CREATE RESTAURANT
                    </h1>
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='name'
                        label='name'
                        size='small'
                        variant='standard'
                        fullWidth
                        required
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /\w{4,}/,
                                restaurantForm.name,
                                e,
                                'Please enter a valid name'
                            )
                        }
                        error={restaurantFormErrors.name !== ''}
                        helperText={restaurantFormErrors.name}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name='general_info'
                        label='description'
                        size='small'
                        variant='standard'
                        fullWidth
                        required
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^.{10,}$/,
                                restaurantForm.general_info,
                                e,
                                'Please write a longer description'
                            )
                        }
                        error={restaurantFormErrors.general_info !== ''}
                        helperText={restaurantFormErrors.general_info}
                    />
                </Grid>

                <Grid item sm={12}>
                    <TextField
                        name='location'
                        label= 'location'
                        size='small'
                        variant='standard'
                        required
                        placeholder="239, Burberry Street, Toronto ON"
                        fullWidth
                        onChange={handleInputHooks}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField 
                        name='type'
                        label='Type'
                        size='small'
                        placeholder="Indian"
                        variant='standard'
                        required
                        fullWidth
                        onChange={handleInputHooks}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField 
                        name='postal_code'
                        placeholder="L7A4J8"
                        label='postal code'
                        size='small'
                        variant='standard'
                        fullWidth
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^$|^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] [0-9][ABCEGHJ-NPRSTV-Z][0-9]$/,
                                restaurantForm.postal_code,
                                e,
                                'Ensure postal code is proper form - example: L7A 2K4'
                            )
                        }
                        error={restaurantFormErrors.postal_code !== ''}
                        helperText={restaurantFormErrors.postal_code}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField 
                        name='phone'
                        label='phone'
                        size='small'
                        variant='standard'
                        fullWidth
                        placeholder="(xxx) xxx-xxxx"
                        onChange={handleInputHooks}
                        onBlur={(e) =>
                            onBlurValidation(
                                /^$|\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                                restaurantForm.phone,
                                e,
                                'Please provide a valid phone number'
                            )
                        }
                        error={restaurantFormErrors.phone !== ''}
                        helperText={restaurantFormErrors.phone}
                    />
                </Grid>
                <Grid sm={12}>
                    <TextField
                        style={{'marginTop': '1em'}}
                        label='Upload icon'
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
                        disabled={
                            !(
                                restaurantFormErrors.name === '' &&
                                restaurantFormErrors.general_info === '' &&
                                restaurantFormErrors.location === '' &&
                                restaurantFormErrors.type === '' &&
                                restaurantFormErrors.postal_code === '' &&
                                restaurantFormErrors.phone === '' &&
                                restaurantFormErrors.icon === ''
                            )
                        }
                    >
                    CREATE
                    </Button>
                </Grid>

            </Grid> 
        </Box>

    </Box>
    )
}

export default CreateRestaurant

// regex from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number