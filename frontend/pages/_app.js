import '../src/css/index.css'
import '../src/css/dist/output.css'; // Example of a global CSS file
import '../src/css/counter.css';
import 'semantic-ui-css/semantic.min.css'; // Assuming you're using Semantic UI

// Your _app.js content;
import ReactEnviorment from '../components/ReactFlow/ReactFlowEnv'

export default function App() {
  return(
      <>
        <ReactEnviorment/>
      </>
      
  )
};
