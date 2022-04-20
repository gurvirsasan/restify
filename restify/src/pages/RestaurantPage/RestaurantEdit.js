
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { TextField, Grid, Box, Button, formHelperTextClasses } from '@mui/material';



const RestaurantEdit = (props) => {
    
    const navigate = useNavigate();

    const data = props['props'];
    const id = data.id;

    const [restaurantForm, setRestaurantForm] = useState({
        name: '',
        general_info: '',
        location: '',
        type: '',
        postal_code: '',
        phone: '',
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

    const handleImageUpload = (event) => {
        const target = event.target
        setRestaurantForm({ ...restaurantForm, icon: (target.files)[0] });
    };

    // On submit function!
    const handleSubmit = (e) => {
        // Prevent reload
        e.preventDefault();

        const submit_form = {}
        submit_form.name = data.name
        submit_form.general_info = data.general_info
        submit_form.location = data.location
        submit_form.postal_code = data.postal_code
        submit_form.type = data.type
        submit_form.phone = data.phone

        for (const [key, value] of Object.entries(restaurantForm)) {
            if (value !== "") {
                submit_form[key] = value
            }
        }

        let formData = new FormData();    //formdata object

        formData.append('name', submit_form.name);   //append the values with key, value pair
        formData.append('general_info', submit_form.general_info); 
        formData.append('location', submit_form.location); 
        formData.append('postal_code', submit_form.postal_code); 
        formData.append('type', submit_form.type); 
        formData.append('phone', submit_form.phone); 
        if (submit_form.icon){
            formData.append('icon', submit_form.icon); 
        }

        fetch(`http://localhost:8000/restaurants/${id}/update/`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Accept': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: formData
        })
        .then(data => data.json())
        .catch((error) => console.error('Error:', error));
        
        window.location.reload(); 
        // 2. send user to the signin page
        // navigate('/profile');
    }


    return (
        <>
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
                                UPDATE RESTAURANT
                            </h1>
                        </Grid>
                        <Grid item sm={12}>
                            <TextField
                                name='name'
                                label='name'
                                size='small'
                                required
                                variant='standard'
                                fullWidth
                                defaultValue={data.name}
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|\w{4,}$/,
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
                                required
                                defaultValue={data.general_info}
                                variant='standard'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|\w{4,}$/,
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
                                required
                                defaultValue={data.location}
                                variant='standard'
                                placeholder="239, Burberry Street, Toronto ON"
                                fullWidth
                                onChange={handleInputHooks}
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <TextField 
                                name='type'
                                label='type'
                                size='small'
                                required
                                defaultValue={data.type}
                                placeholder="Indian"
                                variant='standard'
                                fullWidth
                                onChange={handleInputHooks}
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <TextField 
                                name='postal_code'
                                placeholder="L7A4J8"
                                label='postal code'
                                defaultValue={data.postal_code}
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
                                defaultValue={data.phone}
                                placeholder="(xxx) xxx-xxxx"
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
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
                        <Grid item sm={5}>
                            <Button
                                type='submit'
                                variant='contained'
                                fullWidth
                                style={{'marginTop': '1.5em'}}
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
                            UPDATE
                            </Button>
                        </Grid>

                    </Grid> 
                </Box>

            </Box>
    </>
    )
}

export default RestaurantEdit

// regex from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number