import React from "react";

class SIPDiagram extends React.Component {
  constructor(props) {
    super(props);

    const defaultDiagram = `
    graph LR;
        A--> B & C & D;
        B--> A & E;
        C--> A & E;
        D--> A & E;
        E--> B & C & D;
    `;

    this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
        diagramText: defaultDiagram,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
        hasError: true,
        error: error,
        errorInfo: info
    });
  }

  handleChange = (e) => {
    this.setState({ diagramText: e.target.value});
  }

    render() {
    var self = this;

    var childrenWithProps = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, { mmd: self.state.diagramText });
    });

    var errMsg = null;
    if (self.state.hasError && self.state.error && self.state.error.message) {
        errMsg = <pre>{self.state.error.message}</pre>;
    }

    return (
        <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h4>Input</h4>
                <textarea className="chart-text" onChange={e => self.handleChange(e)}>{self.state.diagramText}</textarea>
              </div>

              <div className="col-md-6">
                <h4>Diagram</h4>
                {self.state.hasError
                    ? <><p>Error!</p>{errMsg}</>
                    : childrenWithProps
                }
              </div>
          </div>
        </div>
    );
}
}

export default SIPDiagram;
