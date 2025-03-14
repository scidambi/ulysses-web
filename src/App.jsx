import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, AppBar, Toolbar, Paper, Grid, List, ListItem, ListItemText } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const imageryPatterns = {
  water: /(?:sea|water|wave|flood|stream|river|flow)/i,
  body: /(?:heart|blood|flesh|bone|skin|hand|eye|brain)/i,
  light: /(?:sun|light|shine|glow|bright|shadow|dark)/i,
  food: /(?:eat|drink|food|bread|meat|milk|wine)/i,
  religion: /(?:god|christ|pray|soul|spirit|holy|sacred)/i,
  death: /(?:death|dead|grave|ghost|corpse|funeral)/i,
  city: /(?:street|building|shop|house|dublin|city)/i,
  nature: /(?:flower|tree|leaf|grass|garden|earth|sky)/i
};

const metaphorPatterns = [
  { pattern: /like a|as a/i, name: 'Similes' },
  { pattern: /in my heart|in his heart|in her heart/i, name: 'Heart Metaphors' },
  { pattern: /life is|death is|love is/i, name: 'Life/Death/Love Metaphors' },
  { pattern: /burning|blazing|flowing|floating/i, name: 'State Metaphors' },
  { pattern: /time(?:.*?)(?:river|stream|flow)/i, name: 'Time Metaphors' }
];

function App() {
  const [loading, setLoading] = useState(true);
  const [imageryData, setImageryData] = useState({});
  const [metaphors, setMetaphors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeText = async () => {
      try {
        const response = await fetch('https://www.gutenberg.org/files/4300/4300-0.txt');
        const text = await response.text();
        
        // Extract the main text
        const start = text.indexOf("Stately, plump Buck Mulligan");
        const end = text.indexOf("Trieste-Zurich-Paris, 1914-1921");
        const mainText = text.slice(start, end);

        // Split into paragraphs for context
        const paragraphs = mainText.split(/\n\n+/);

        // Analyze imagery
        const imageryCount = {};
        Object.entries(imageryPatterns).forEach(([category, pattern]) => {
          imageryCount[category] = mainText.match(pattern)?.length || 0;
        });
        setImageryData(imageryCount);

        // Find metaphors with context
        const foundMetaphors = [];
        paragraphs.forEach(paragraph => {
          metaphorPatterns.forEach(({ pattern, name }) => {
            const matches = paragraph.match(pattern);
            if (matches) {
              const start = Math.max(0, paragraph.indexOf(matches[0]) - 50);
              const end = Math.min(paragraph.length, paragraph.indexOf(matches[0]) + 100);
              const context = paragraph.slice(start, end).trim();
              foundMetaphors.push({
                type: name,
                context: context
              });
            }
          });
        });
        setMetaphors(foundMetaphors.slice(0, 15));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch and analyze text');
        setLoading(false);
      }
    };

    analyzeText();
  }, []);

  const imageryChartData = {
    labels: Object.keys(imageryData).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [{
      label: 'Frequency of Imagery',
      data: Object.values(imageryData),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(199, 199, 199, 0.5)',
        'rgba(83, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Ulysses Literary Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thematic Imagery Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar 
                    data={imageryChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Notable Metaphors and Context
                </Typography>
                <List>
                  {metaphors.map((metaphor, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={metaphor.type}
                        secondary={`"...${metaphor.context}..."`}
                        secondaryTypographyProps={{ 
                          style: { 
                            fontStyle: 'italic',
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;

feat: Add literary analysis features with Material-UI and Chart.js
