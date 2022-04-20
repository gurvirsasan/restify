import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate, useParams} from "react-router-dom";
import { useState } from 'react';


const Image = (props) => {
    const navigate = useNavigate();
    
    const { id } = props;

    const [imageForm, setimageForm] = useState({
        name: "",
        image: ""
    });

    // handle image upload
    const handleImageUpload = (e) => {
        const target = e.target
        setimageForm({ ...imageForm, image: (target.files)[0] });
    };

    const handleSubmit = (e) => {

        // Prevent reload
        e.preventDefault();
        
        let formData = new FormData();  //formdata object
        
        formData.append('name', imageForm.name);   //append the values with key, value pair
        formData.append('image', imageForm.image);

        // Make API calls here. 
        fetch(`http://localhost:8000/restaurants/${id}/add-img/`, {
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
            if (data.status === 200) {
                alert("Image has been added!");
            }
            if (data.status === 400){
                alert("Bad Request");
            }
        })
        .then(res => {
            window.location.reload();
        })
        .catch((error) => console.error('Error:', error));
        }

    return(
        <>
            <Box sx={{ position: 'absolute', width: '100vw' }}>
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
                                ADD NEW IMAGE
                            </h3>
                        </Grid>
                        <Grid sm={12} xs={12}>
                        <TextField
                            style={{'marginTop': '1rem', 'marginLeft': '1rem'}}
                            label='Upload Image'
                            type='file'
                            variant='outlined'
                            fullWidth
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
export default Image;