import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate, useParams} from "react-router-dom";
import { useState } from 'react';


const Menu = (props) => {
    const { id } = props;
    const navigate = useNavigate();

    const [menuForm, setMenuForm] = useState({
        name: "",
        price: 0.0,
        description: "",
        item_image: ""
    });

    const [menuFormErrors, setMenuFormErrors] = useState({
        name: "",
        price: "",
        description: "",
        item_image: ""
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setMenuFormErrors({...menuFormErrors, [e.target.name]: errMsg})
        } else {
            setMenuFormErrors({...menuFormErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
        setMenuFormErrors({ ...menuFormErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const handleImageUpload = (e) => {
        const target = e.target
        setMenuForm({ ...menuForm, item_image: (target.files)[0] });
    };

    const handleSubmit = (e) => {

        // Prevent reload
        e.preventDefault();
        
        let formData = new FormData();    //formdata object

        formData.append('name', menuForm.name.toLowerCase());   //append the values with key, value pair
        formData.append('price', menuForm.price); 
        formData.append('description', menuForm.description); 
        if (menuForm.item_image){
            formData.append('item_image', menuForm.item_image); 
        }

        // Make API calls here. 
        fetch(`http://localhost:8000/restaurants/${id}/menu/add/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                'Accept': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: formData
        })
        .then(data => {
            if (data.status === 403){
                alert("You do not own this restaurant and thus you can not add items to it");
            }
            if (data.status === 400){
                alert("Bad Request");
            }
        })
        .catch((error) => console.error('Error:', error));
    
        alert("The menu item has been created!");
        // Send the user to the restaurant page 
        // navigate(`/restaurant/${id}`);
        window.location.reload();
    }

    return(
        <>
            <Box 
                // display='flex'
                // justifyContent='center'
                sx={{ position: 'absolute', width: '100vw' }}
            >
                <Box 
                    display='flex'
                    justifyContent='center'
                    sx={{ width: '30%'}} 
                    component='form'
                    onSubmit={handleSubmit}
                >
                    <Grid 
                        container
                        spacing={2}
                        style={{"margin": '1rem', 'color': 'green'}}
                    >
                        <Grid item sm={12}>
                            <h3 style={{"marginLeft": "2rem"}} >
                                CREATE MENU ITEM
                            </h3>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                // InputProps={{style: {fontSize: 10}}} // font size of input text
                                // InputLabelProps={{style: {fontSize: 20}}} // font size of input label
                                name='name'
                                label='Item type'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|\w{4,}$/,
                                        menuForm.name,
                                        e,
                                        'Please enter a valid type'
                                    )
                                }
                                error={menuFormErrors.name !== ''}
                                helperText={menuFormErrors.name}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name='price'
                                label='price in $'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|\d{0,8}(\.\d{1,4})?$/,
                                        menuForm.price,
                                        e,
                                        'Please input a valid price'
                                    )
                                }
                                error={menuFormErrors.price !== ''}
                                helperText={menuFormErrors.price}
                            />
                        </Grid>
                        
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name='description'
                                label='Item name'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|\w{4,}$/,
                                        menuForm.description,
                                        e,
                                        'Please write a longer description'
                                    )
                                }
                                error={menuFormErrors.description !== ''}
                                helperText={menuFormErrors.description}
                            />
                        </Grid>                     
                        <Grid sm={12} xs={12}>
                        
                            <TextField
                                style={{'marginTop': '1rem', 'marginLeft': '1rem'}}
                                label='Upload Image'
                                type='file'
                                variant='outlined'
                                size='small'
                                InputLabelProps={{ shrink: true}}
                                onChange={handleImageUpload}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Button
                                type='submit'
                                variant='contained'
                                fullWidth
                            >
                            CREATE
                            </Button>
                        </Grid>

                    </Grid> 
                </Box>

            </Box>
        </>
    )
}
export default Menu;