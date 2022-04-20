import { Box } from '@mui/material';
import { useEffect, useState, useMemo} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RestaurantCard from '../../components/AllRestaurants';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';

const SortedRestaurants = () => {
    const [x, setx] = useState([]);

    function useQuery() {
        const { search } = useLocation();
        return useMemo(() => new URLSearchParams(search), [search]);
    }
    let query = useQuery();

    const q = query.get("query");
    const t = query.get("type");

    var url = new URL("http://localhost:8000/restaurants/search?query=x&type=y");
 
    url.searchParams.set('query', q);
    url.searchParams.set('type', t);
        
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')){
            navigate('/signin')
            return 
        }
        // fetch(url.toString(), {

        fetch(url.toString().substring(21), {
                method: 'GET',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
            })
            .then(data => data.json())
            .then(res => {
                setx(res.results);
            })
            .catch((error) => console.error('Error:', error));
    }, []);


    const buttons = [];
    x.forEach((id, x) => {
        buttons.push(
            <>
            <Button style={{'marginLeft': '2em', 'paddingBottom': '2rem'}} size='large' variant='outlined' onClick={() => navigate(`/restaurants/${id}`)} >Restaurant Found #{x+1}</Button>
            </>
        )
    });
    return (<>
        <Box sx={{textAlign: 'center', color: 'green', marginBottom:'-20px'}}>
            <h1>Queried  Restaurants</h1>
        </Box>
        <br></br>
        <div>{buttons}</div>
        <Box
                margin={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
            </Box>
    </>)

}
export default SortedRestaurants;