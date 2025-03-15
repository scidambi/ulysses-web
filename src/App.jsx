import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box, Paper, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const findNonLiteralExpressions = (text) => {
    const potentialMetaphors = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach(sentence => {
      const hasComparison = /\b(like|as)\b/i.test(sentence);
      const hasAbstractConcrete = /\b(life|death|time|love|fear|hope)\b.*\b(flows|burns|grows|flies|dances|sings)\b/i.test(sentence);
      const hasPersonification = /\b(sun|moon|wind|sea|city|night)\b.*\b(laughs|weeps|whispers|speaks|watches|sleeps)\b/i.test(sentence);
      const hasUnusualPairing = /\b(heart|soul|mind)\b.*\b(ocean|fire|storm|garden|desert)\b/i.test(sentence);
      
      if (hasComparison || hasAbstractConcrete || hasPersonification || hasUnusualPairing) {
        potentialMetaphors.push({
          sentence: sentence.trim(),
          type: hasComparison ? "comparison" :
                hasAbstractConcrete ? "abstract-concrete" :
                hasPersonification ? "personification" :
                "unusual-pairing"
        });
      }
    });

    const categorizedMetaphors = potentialMetaphors.reduce((acc, metaphor) => {
      const concepts = metaphor.sentence.match(/\b(life|death|time|love|fear|hope|sun|moon|wind|sea|city|night|heart|soul|mind|ocean|fire|storm|garden|desert)\b/gi) || [];
      concepts.forEach(concept => {
        const category = concept.toLowerCase();
        if (!acc[category]) acc[category] = [];
        if (!acc[category].includes(metaphor.sentence)) {
          acc[category].push(metaphor.sentence);
        }
      });
      return acc;
    }, {});

    return categorizedMetaphors;
  };

  useEffect(() => {
    async function analyzeText() {
      try {
        const response = await fetch("/texts/ulysses.txt");
        const text = await response.text();
        
        const mainContent = text
          .split("*** START OF THE PROJECT GUTENBERG EBOOK")[1]
          .split("*** END OF THE PROJECT GUTENBERG EBOOK")[0]
          .trim();

        const openingLine = mainContent.match(/Stately,[^.]*\./) || "";
        const metaphors = findNonLiteralExpressions(mainContent);
        
        setAnalysis({
          textPreview: openingLine,
          metaphors: metaphors
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
            Analyzing metaphors...
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
          
          {Object.entries(analysis.metaphors).map(([category, sentences]) => (
            <Grid item xs={12} md={6} key={category}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ textTransform: "capitalize" }}>
                    {category} Metaphors
                  </Typography>
                  {sentences.slice(0, 2).map((sentence, index) => (
                    <Typography key={index} variant="body1" paragraph>
                      {index + 1}. {sentence}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default App;