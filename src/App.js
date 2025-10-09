import './App.css';
import PredictedEventsTable from './components/predictedEventsTable';

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>MMA Predicted Events</h1>
      <PredictedEventsTable />
    </div>
  );
}

export default App;
