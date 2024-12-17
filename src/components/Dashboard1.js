import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Dashboard1 = () => {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">Dashboard 1</Typography>
      <Typography>Welcome to the first dashboard page!z</Typography>
    </Box>
  );
};

export default Dashboard1;
