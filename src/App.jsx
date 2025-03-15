import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box, Paper, Grid } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Define metaphor patterns
  const metaphorPatterns = {
    similes: /\b(like|as)\s+(?:a|an|the)\s+([\w\s]+?)(?=[,.])/gi,
    personification: /\b(time|death|life|love|nature|city|sea|wind|sun|moon)\s+(?:is|was|were|had|has|will|would|could|can)\s+(?:\w+(?:ing|ed|s)\b)/gi,
    water: /\b(flood|stream|river|ocean|sea|wave)\s+of\s+([\w\s]+?)(?=[,.])/gi,
    light: /\b(shine|glow|flash|spark|beam|ray)\s+of\s+([\w\s]+?)(?=[,.])/gi,
    journey: /\b(path|road|journey|voyage|walk)\s+(?:of|to|through)\s+([\w\s]+?)(?=[,.])/gi
  };

  useEffect(() => {
    async function analyzeText() {
      try {
        console.log("Starting analysis...");
        const response = await fetch("/texts/ulysses.txt");
        const text = await response.text();
        
        // Extract the main content
        const mainContent = text.split("*** START OF THE PROJECT GUTENBERG EBOOK")[1]
          .split("*** END OF THE PROJECT GUTENBERG EBOOK")[0]
          .trim();

        // Find the opening line
        const openingLine = mainContent.match(/Stately,[^.]*\./)?.[0] || "";
        
        // Find metaphors
        const metaphors = {};
        Object.entries(metaphorPatterns).forEach(([type, pattern]) => {
          const matches = [...mainContent.matchAll(pattern)];
          metaphors[type] = matches.map(match => match[0].trim()).slice(0, 5); // Get top 5 of each type
        });
        
        setAnalysis({
          textPreview: openingLine,
          metaphors: metaphors,
          totalWords: mainContent.split(/\s+/).length,
          uniqueWords: new Set(mainContent.toLowerCase().split(/\s+/)).size
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
                Opening Line
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
                Metaphors & Similes
              </Typography>
              {Object.entries(analysis.metaphors).map(([type, examples]) => (
                <Box key={type} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}:
                  </Typography>
                  {examples.length > 0 ? (
                    examples.map((example, index) => (
                      <Typography key={index} variant="body1" sx={{ ml: 2 }}>
                        • {example}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ ml: 2, fontStyle: "italic" }}>
                      No examples found
                    </Typography>
                  )}
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default App;