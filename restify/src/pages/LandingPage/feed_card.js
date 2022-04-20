import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function OutlinedCard({ restaurant_name, title, description, id}) {
  const navigate = useNavigate();
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
        <Button size="medium" onClick={() => navigate(`/restaurants/${id}`)}>{restaurant_name}</Button>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {restaurant_name}
        </Typography> */}
        <Typography variant="h5" component="div">
            {title}
        </Typography>
        <Typography variant="body2">
            {description}
        </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OutlinedCard
