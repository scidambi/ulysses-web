import { useState } from "react";
import { Container, Typography, CircularProgress, Box, Paper } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Ulysses Literary Analysis
          </Typography>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="400px"
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Typography variant="body1">
              Analysis will appear here
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
