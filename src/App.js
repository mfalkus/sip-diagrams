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

      <footer>
      <p><strong>About</strong></p>
      <p>A mini site that aims to make creating typical SIP flows easy in mermaidJS.
      Also a useful tool for those new to SIP!</p>
      </footer>
    </div>
  );
}

export default App;
