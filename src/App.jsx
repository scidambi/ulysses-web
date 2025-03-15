import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box, Paper, Grid } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function analyzeText() {
      try {
        console.log("Starting analysis...");
        const response = await fetch("/texts/ulysses.txt");
        const text = await response.text();
        
        // Clean up the text
        const cleanText = text
          .replace(/\r\n/g, " ")  // Replace Windows line endings
          .replace(/\n/g, " ")    // Replace Unix line endings
          .replace(/\s+/g, " ")   // Normalize spaces
          .toLowerCase();
        
        // Get word frequencies
        const words = cleanText.split(" ");
        const wordFreq = {};
        words.forEach(word => {
          // Clean the word and check if its valid
          const cleanWord = word.replace(/[^a-z]/g, "");
          if (cleanWord.length > 3) {  // Only count words longer than 3 letters
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
          }
        });
        
        // Get top 20 words
        const topWords = Object.entries(wordFreq)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 20);
        
        setAnalysis({
          totalWords: words.length,
          uniqueWords: Object.keys(wordFreq).length,
          topWords: topWords,
          textPreview: text.split("*** START OF THE PROJECT GUTENBERG EBOOK")[1]
            .split("*** END OF THE PROJECT GUTENBERG EBOOK")[0]
            .trim()
            .substring(0, 200) + "..."
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err.toString());
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Analyzing text...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 4, p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
          <Typography color="error" variant="h6">
            Error: {error}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Typography variant="h6" gutterBottom>
                Text Preview
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                {analysis.textPreview}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Typography variant="body1">
                Total Words: {analysis.totalWords.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Unique Words: {analysis.uniqueWords.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Typography variant="h6" gutterBottom>
                Most Common Words
              </Typography>
              <Grid container spacing={1}>
                {analysis.topWords.map(([word, count], index) => (
                  <Grid item xs={6} sm={4} key={word}>
                    <Typography variant="body1">
                      {index + 1}. {word} ({count})
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default App;