import React from "react";
import {allGraphs, graphContent} from './Graphs';

class SIPDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        hasError: false,
        error: null,
        errorInfo: null,

        diagramText: '',
        graphKey: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
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
    this.setState({
        diagramText: e.target.value,
        hasError: false,
        error: null,
        errorInfo: null,
    });
  }

    handleGraphChange = (e) => {
        var key = e.target.value;
        var graph = graphContent(key);

        this.setState({
            graphKey: key,
            diagramText: graph ? graph.content : '',
            hasError: false,
            error: null,
            errorInfo: null,
        });
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

        var graphOptions = [];
        var allGraphsTemp = allGraphs();
        allGraphsTemp.forEach(function(g) {
            graphOptions.push(
                <option value={g.key}>{g.name}</option>
            );
        });

        return (
            <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Input</h4>
                    <select onChange={(e) => this.handleGraphChange(e)} value={this.state.graphValue}>
                      <option value="select">Select Graph</option>
                      {graphOptions}
                   </select>
                    <textarea className="chart-text" onChange={e => self.handleChange(e)} value={self.state.diagramText}>{self.state.diagramText}</textarea>
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
