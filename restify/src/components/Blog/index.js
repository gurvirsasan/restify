import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate, useParams} from "react-router-dom";
import { useState } from 'react';


const Blog = (props) => {
    const navigate = useNavigate();
    
    const { id } = props;

    const [blogForm, setBlogForm] = useState({
        title: "",
        image: "",
        description: ""
    });

    const [blogFormErrors, setBlogFormErrors] = useState({
        title: "",
        image: "",
        description: ""
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setBlogFormErrors({...blogFormErrors, [e.target.name]: errMsg})
        } else {
            setBlogFormErrors({...blogFormErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
        setBlogFormErrors({ ...blogFormErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const handleImageUpload = (e) => {
        const target = e.target
        setBlogForm({ ...blogForm, image: (target.files)[0] });
    };

    const handleSubmit = (e) => {

        // Prevent reload
        e.preventDefault();
        
        let formData = new FormData();    //formdata object

        formData.append('title', blogForm.title);   //append the values with key, value pair
        formData.append('description', blogForm.description); 
        if (blogForm.image){
            formData.append('image', blogForm.image); 
        }

        // Make API calls here.  
        fetch(`http://localhost:8000/restaurants/${id}/blog/`, {
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
                alert("You do not own this restaurant and thus you can not add a blog");
            }
            if (data.status === 400){
                alert("Bad Request");
            }
            if (data.status === 404){
                alert("Not Found");
            }
        })
        .catch((error) => console.error('Error:', error));
    
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
                            <h3>
                                CREATE BLOG
                            </h3>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                // InputProps={{style: {fontSize: 10}}} // font size of input text
                                // InputLabelProps={{style: {fontSize: 20}}} // font size of input label
                                name='title'
                                label='title'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                            />
                        </Grid>                        
                        <Grid item sm={12} xs={12}>
                            <TextField
                                multiline
                                rows={4}
                                name='description'
                                label='description'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^.{4,}$/,
                                        blogForm.description,
                                        e,
                                        'Please write a longer description'
                                    )
                                }
                                error={blogFormErrors.description !== ''}
                                helperText={blogFormErrors.description}
                            />
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
export default Blog;