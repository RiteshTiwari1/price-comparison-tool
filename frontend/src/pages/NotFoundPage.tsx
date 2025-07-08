import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 4 }} />
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to="/"
        sx={{ mt: 2 }}
      >
        Go to Home Page
      </Button>
    </Box>
  );
};

export default NotFoundPage; 