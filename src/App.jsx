import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    async function fetchText() {
      try {
        console.log("Starting fetch...");
        const response = await fetch("https://www.gutenberg.org/files/4300/4300-0.txt");
        console.log("Response status:", response.status);
        const text = await response.text();
        console.log("Text received, length:", text.length);
        setDebugInfo({ status: response.status, textLength: text.length, preview: text.substring(0, 100) });
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchText();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>Ulysses Literary Analysis</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Fetching text... Check console (F12)</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 4, p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
          <Typography color="error" variant="h6">Error: {error}</Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Debug Information:</Typography>
          <Typography component="pre" sx={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(debugInfo, null, 2)}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;