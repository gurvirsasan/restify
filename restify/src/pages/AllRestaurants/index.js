import { Box } from '@mui/material';
import { useEffect, useState, useMemo} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RestaurantCard from '../../components/AllRestaurants';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';

const AllRestaurants = () => {
    const navigate = useNavigate();
    const [allRestData, setAllRestData] = useState([])
    const [next_url, nextUrl] = useState('http://localhost:8000/restaurants/all/'); 
    const [prev_url, prevUrl] = useState(null); 

    useEffect(() => {
        if (!localStorage.getItem('token')){
            navigate('/signin')
            return 
        }
        fetch(next_url, {
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
            prevUrl(res.previous);
            nextUrl(res.next);
            setAllRestData(res.results)
        })
        .catch((error) => console.error('Error:', error));
    }, [])

    const loadNextRest = () => {
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
            .then(res => { 
                setAllRestData(res.results)
                prevUrl(res.previous);
                nextUrl(res.next);
        })
        .catch(error => console.log(error));
    };

    const loadPrevRest = () => {
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
                setAllRestData(data.results)
                prevUrl(data.previous);
                nextUrl(data.next);
        })
        .catch(error => console.log(error));
    };

    const allRestComponents = []
    for (var i = 0; i < allRestData.length; i++) {
        if (allRestData[i]) {
            allRestComponents.push(
                <RestaurantCard 
                    id={allRestData[i].id}
                    name={allRestData[i].name}
                    general_info={allRestData[i].general_info}
                    followers={allRestData[i].fans}
                    location={allRestData[i].location}
                    postal_code={allRestData[i].postal_code}
                    icon={allRestData[i].icon}
                    followerNumber={allRestData[i].fans.length}
                />
            )
        }
    }

    return (<>
        <Box sx={{textAlign: 'center', color: 'green', marginBottom:'-20px'}}>
            <h1>All Restaurants</h1>
        </Box>
        <div>{allRestComponents}</div>
        <Box
                margin={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                // minHeight="100vh"
            >
            <Stack direction="row" spacing={2}>
                {prev_url && <Button onClick={loadPrevRest} variant="outlined">Previous</Button>}
                {next_url && <Button onClick={loadNextRest} variant="outlined">Next</Button>}
            </Stack>
            </Box>
    </>)

}
export default AllRestaurants;