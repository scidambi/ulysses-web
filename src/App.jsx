import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h1>Ulysses Literary Analysis</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Analysis will appear here</p>
      )}
    </div>
  );
}

export default App;
