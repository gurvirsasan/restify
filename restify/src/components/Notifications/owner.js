import { Button } from "@mui/material";
import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import NotifCard from './card';

const OwnerNotifs = () => {
    const [notifs, setNotifs] = useState({}); 
    const [next_url, setNextUrl] = useState('http://localhost:8000/notifications/owner/'); 
    const [prev_url, setPrevUrl] = useState(null); 

    const loadNextNotifs = () => {
        fetch(next_url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                referrerPolicy: 'no-referrer'
            })
            .then(response => response.json())
            .then(data => { 
                if (data.count != 0) {
                setNotifs({...data.results});
                setPrevUrl(data.previous);
                setNextUrl(data.next);
                }
                else {
                    setNextUrl(null);
                    setNotifs({0: {message: "No notifications", date: ""}});
                }
        })
        .catch(error => console.log(error));
    };

    const loadPrevNotifs = () => {
        fetch(prev_url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                referrerPolicy: 'no-referrer'
            })
            .then(response => response.json())
            .then(data => { 
                if (data.count != 0) {
                    setNotifs({...data.results});
                    setPrevUrl(data.previous);
                    setNextUrl(data.next);
                    }
                else {
                    setNotifs({0: {message: "No notifications", date: ""}});
                }
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {loadNextNotifs();}
        }, []);

    return (
        <div>
            {localStorage.getItem('token') && Object.entries(notifs).map(([key, value]) => (
            <NotifCard
                key={value.date}
                date={value.date}
                message={value.message}
            />
            ))}
            <Box
                margin={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
            <Stack direction="row" spacing={2}>
                {prev_url && <Button onClick={loadPrevNotifs} variant="outlined">Previous</Button>}
                {next_url && <Button onClick={loadNextNotifs} variant="outlined">Next</Button>}
            </Stack>
            </Box>
        </div>
    )
};

export default OwnerNotifs