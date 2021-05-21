import './App.css';
import './custom-bs.scss';
import SIPDiagram from './SIPDiagram';
import MermaidReact from 'mermaid-react'
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  return (
    <>
      <header className="App-header">
        <h1>
        <FontAwesomeIcon icon={faPhone} flip="horizontal"  inverse />
        &nbsp;
        SIP Call Flow Generator
        &nbsp;
        <FontAwesomeIcon icon={faPhone}  inverse />
        </h1>
      </header>

      <SIPDiagram>
        <MermaidReact id="coreGraph" />
      </SIPDiagram>

      <footer>
          <p><strong>About</strong></p>
          <p>A mini site that aims to make creating typical SIP flows easy
          by using the brilliant <a href="https://mermaid-js.github.io/mermaid/#/">mermaid</a> graph library.
          New to SIP and after the full detail? Check out <a
          href="https://datatracker.ietf.org/doc/html/rfc3261">RFC 3261</a>.</p>
      </footer>
    </>
  );
}

export default App;
