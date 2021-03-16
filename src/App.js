import './App.css';
import './custom-bs.scss';
import SIPDiagram from './SIPDiagram';
import MermaidReact from 'mermaid-react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SIP Diagrams</h1>
      </header>

      <SIPDiagram>
        <MermaidReact id="coreGraph" />
      </SIPDiagram>
    </div>
  );
}

export default App;
