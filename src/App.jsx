import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box, Paper, Grid, Card, CardContent } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const analyzeMetaphors = (text) => {
    const categories = {
      religious: {
        terms: /\b(mass|priest|church|altar|chalice|host|communion|holy|sacred|divine|blessed|soul|spirit|prayer|god|jesus|christ|cross|crucified|resurrection|salvation|sin|penance|confession|eucharist|trinity|virgin mary|saints?)\b/gi,
        context: /\b(worship|ritual|ceremony|sacrifice|offering|blessing|consecration|sacrament)\b/gi
      },
      dublin: {
        terms: /\b(dublin|city|street|bridge|tower|river|liffey|martello|sandymount|howth|phoenix)\b/gi,
        context: /\b(walks?|stands?|rises?|flows?|watches?|breathes?)\b/gi
      },
      body: {
        terms: /\b(heart|soul|mind|flesh|blood|bones?|skin|eyes?|hands?)\b/gi,
        context: /\b(of|in|through) (the|a|an) (world|city|time|life|death|spirit)\b/gi
      },
      time: {
        terms: /\b(time|moment|hour|day|night|eternity|past|future|memory)\b/gi,
        context: /\b(flows?|moves?|stands?|returns?|remembers?|forgets?)\b/gi
      }
    };

    const metaphors = {};
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());

    sentences.forEach(sentence => {
      Object.entries(categories).forEach(([category, patterns]) => {
        const hasTerms = patterns.terms.test(sentence);
        const hasContext = patterns.context.test(sentence);

        if (hasTerms && hasContext) {
          if (!metaphors[category]) metaphors[category] = [];
          metaphors[category].push({
            text: sentence.trim(),
            terms: sentence.match(patterns.terms) || []
          });
        }
      });
    });

    return metaphors;
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
        const metaphors = analyzeMetaphors(mainContent);
        
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

  const BoldTerms = ({ text, terms }) => {
    if (!terms || terms.length === 0) return <span>{text}</span>;
    
    const parts = text.split(new RegExp(`(${terms.join("|")})`, "gi"));
    return (
      <>
        {parts.map((part, i) => {
          const isTerm = terms.some(term => 
            part.toLowerCase() === term.toLowerCase()
          );
          return isTerm ? (
            <Box component="span" key={i} sx={{ fontWeight: 800, backgroundColor: "#fff3e0", padding: "0 2px", borderRadius: "2px" }}>
              {part}
            </Box>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </>
    );
  };

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
          
          {Object.entries(analysis.metaphors).map(([category, examples]) => (
            <Grid item xs={12} md={6} key={category}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ textTransform: "capitalize" }}>
                    {category.replace(/_/g, " ")} Metaphors
                  </Typography>
                  {examples.slice(0, 3).map((example, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {index + 1}. <BoldTerms text={example.text} terms={example.terms} />
                      </Typography>
                    </Box>
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
