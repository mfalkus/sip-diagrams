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
        <p>A mini site that aims to make creating typical SIP flows easy by
          using the brilliant <a
          href="https://mermaid-js.github.io/mermaid/#/">mermaid</a> graph library.
          </p>
      <p>Helpful links:</p>
        <ul>
      <li> New to SIP and after the full detail? Check out <a
          href="https://datatracker.ietf.org/doc/html/rfc3261">SIP RFC 3261</a>.
      </li>
      <li>Reliable Provisional Responses: <a href="https://datatracker.ietf.org/doc/html/rfc3262">PRACK RFC 3262</a></li>
      <li>Full list of <a href="https://en.wikipedia.org/wiki/List_of_SIP_response_codes">SIP response codes</a></li>
      </ul>
      </footer>
    </>
  );
}

export default App;
