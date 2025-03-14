import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [commonWords, setCommonWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function analyzeText() {
      console.log("Starting analysis...");
      try {
        const response = await fetch("https://gutenberg.org/cache/epub/4300/pg4300.txt");
        console.log("Fetch status:", response.status);
        const text = await response.text();
        console.log("Got text, length:", text.length);
        
        const words = text.split(/\s+/);
        setWordCount(words.length);
        
        const wordFreq = {};
        words.forEach(word => {
          word = word.toLowerCase().replace(/[^a-z]/g, "");
          if (word.length > 3) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });
        
        const topWords = Object.entries(wordFreq)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([word, count]) => `${word} (${count} times)`);
        
        console.log("Analysis complete");
        setCommonWords(topWords);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    analyzeText();
  }, []);

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
          <Typography variant="h6" sx={{ ml: 2 }}>
            Analyzing text... Check browser console (F12)
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Total Words: {wordCount.toLocaleString()}
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Most Common Words:
          </Typography>
          {commonWords.map((word, index) => (
            <Typography key={index} variant="body1" sx={{ my: 1 }}>
              {index + 1}. {word}
            </Typography>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default App;