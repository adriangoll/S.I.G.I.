import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

export const PublicLayout: React.FC = () => {
  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container maxWidth="sm">
        <Box className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};
