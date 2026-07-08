import { Box, Paper, Typography } from '@mui/material';
import { themeTokens } from '@/common/components/sistema/theme';

export const AdminDashboardScreen: React.FC = () => {
  return (
    <Box>
      <Typography
        sx={{
          color: themeTokens.colors.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          mb: 2,
        }}
      >
        Panel docente {'>'} Dashboard
      </Typography>

      <Paper
        elevation={0}
        sx={{
          minHeight: '70vh',
          border: `1px solid ${themeTokens.colors.border}`,
          backgroundColor: themeTokens.colors.background,
          borderRadius: 2,
        }}
      />
    </Box>
  );
};
