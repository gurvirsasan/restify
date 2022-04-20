import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function NotifCard({ date, message}) {
  const navigate = useNavigate();
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
        <Typography variant="body2">
            {date.substring(0, 10)}
        </Typography>
        <Typography variant="body2">
            {message}
        </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotifCard
