import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate, useParams} from "react-router-dom";
import { useState } from 'react';


const Comment = () => {
    const navigate = useNavigate();
    
    let { id } = useParams();

    const [commentForm, setCommentForm] = useState({
        text: "",
    });

    const [commentFormErrors, setCommentFormErrors] = useState({
        text: "",
    });

    // validate the input field with a given regex and set error messages accordingly
    const onBlurValidation = (regex, inputString, e, errMsg) => {
        if (!regex.test(inputString)) {
            setCommentFormErrors({...commentFormErrors, [e.target.name]: errMsg})
        } else {
            setCommentFormErrors({...commentFormErrors, [e.target.name]: ''})
        }
    }

    // handle subsequent hook for the input field along with it's error
    const handleInputHooks = (e) => {
        setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
        setCommentFormErrors({ ...commentFormErrors, [e.target.name]: '' }); // make error '' at each new attempt
    };

    const handleSubmit = (e) => {

        // Prevent reload
        e.preventDefault();
        
        let formData = new FormData();  //formdata object
        
        formData.append('text', commentForm.text);   //append the values with key, value pair

        // Make API calls here. 
        fetch(`http://localhost:8000/restaurants/${id}/comment/`, {
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
                alert("Comment has been added!");
            }
            if (data.status === 400){
                alert("Bad Request");
            }
        })
        .catch((error) => console.error('Error:', error));
    

        // Send the user to the restaurant page 
        // navigate(`/restaurant/${id}`);
        // window.location.reload();
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
                                ADD COMMENT
                            </h3>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                // InputProps={{style: {fontSize: 10}}} // font size of input text
                                // InputLabelProps={{style: {fontSize: 20}}} // font size of input label
                                name='text'
                                label='text'
                                size='small'
                                required
                                variant='filled'
                                fullWidth
                                onChange={handleInputHooks}
                                onBlur={(e) =>
                                    onBlurValidation(
                                        /^$|^.{10,}$/,
                                        commentForm.text,
                                        e,
                                        'Please enter a longer comment'
                                    )
                                }
                                error={commentFormErrors.text !== ''}
                                helperText={commentFormErrors.text}
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
export default Comment;