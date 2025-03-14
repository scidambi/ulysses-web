import { useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
    </Container>
  );
}

export default App;
