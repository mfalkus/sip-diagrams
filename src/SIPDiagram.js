import React from "react";
import {allGraphs, generateGraphContent} from './Graphs';

class SIPDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        hasError: false,
        error: null,
        errorInfo: null,

        diagramText: '',
        graphKey: '',
        graphNames: 'A,B',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
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

    drawGraph = (e) => {
        var graph = generateGraphContent(this.state.graphKey, this.state.graphNames);

        this.setState({
            diagramText: graph ? graph.content : '',
            hasError: false,
            error: null,
            errorInfo: null,
        });
    }

    handleGraphChange = (e) => {
        var key = e.target.value;

        this.setState({
            graphKey: key,
        });
    }

    handleUserChange = (e) => {
        var key = e.target.value;

        this.setState({
            graphNames: key
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
                <option key={g.key} value={g.key}>{g.name}</option>
            );
        });

        return (
            <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Select Call Flow</h4>

                    <div>
                        <label>User Names (comma list)</label>
                        <input name="graph-names" type="text" onChange={(e) => this.handleUserChange(e)} value={this.state.graphNames} />
                    </div>

                    <div>
                        <label>Call Type</label>
                        <select onChange={(e) => this.handleGraphChange(e)} value={this.state.graphValue}>
                          <option value="select">Select Graph</option>
                          {graphOptions}
                        </select>
                    </div>
                    <div>
                        <button onClick={(e) => this.drawGraph(e)}>Generate Graph</button>
                    </div>

                    <hr />

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
