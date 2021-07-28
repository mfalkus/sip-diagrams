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
        Sequence Call Flow Generator
        </h1>

        <h2>
        sip-diagrams.netlify.app
        </h2>
      </header>

      <SIPDiagram>
        <MermaidReact id="coreGraph" />
      </SIPDiagram>

      <footer>
      <div className="footer-inner">
        <p><strong>About</strong></p>
        <p>A mini site that aims to make creating typical SIP flow diagrams easy by
          using the brilliant <a
          href="https://mermaid-js.github.io/mermaid/#/">mermaid</a> graph library.
            For a mini blog post about the origin of this project
            see <a href="https://falkus.co/2021/06/sip-diamgrams-with-mermaid">this
            falkus.co blog post</a>.
            To report any bugs or suggest improvements head to the
            GitHub <a href="https://github.com/mfalkus/sip-diagrams">repo</a>.
          </p>
      <p>Helpful links:</p>
        <ul>
      <li> New to SIP and after the full detail? Check out <a
          href="https://datatracker.ietf.org/doc/html/rfc3261">SIP RFC 3261</a>.
      </li>
      <li>Reliable Provisional Responses: <a href="https://datatracker.ietf.org/doc/html/rfc3262">PRACK RFC 3262</a></li>
      <li>Full list of <a href="https://en.wikipedia.org/wiki/List_of_SIP_response_codes">SIP response codes</a></li>
      </ul>
      </div>
      </footer>
    </>
  );
}

export default App;
