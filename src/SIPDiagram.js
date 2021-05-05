import React from "react";
import {allGraphs, generateGraphContent, getGraphRecipe} from './Graphs';

class SIPDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
        showGraphText: false,

        diagramText: '',
        graphKey: '',
        graphNames: 'A,B',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
    this.toggleGraphText = this.toggleGraphText.bind(this);
    this.graphReset = this.graphReset.bind(this);
    this.setGraphContent = this.setGraphContent.bind(this);
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
        hasError: true,
        error: error,
        errorInfo: info
    });
  }

    graphReset = (e) => {
        var self = this;
        this.setGraphContent('');
    }

    toggleGraphText = (e) => {
        this.setState(prevState => ({
              showGraphText: !prevState.showGraphText
        }));
    }

  handleChange = (e) => {
      this.setGraphContent(e.target.value);
  }

  setGraphContent = (txt, cb) => {
    this.setState({
        diagramText: txt,
        hasError: false,
        error: null,
        errorInfo: null,
    }, function() {
        cb && cb();
    });
  }

    drawGraph = (e) => {
        try {
            var graph = generateGraphContent(this.state.graphKey, this.state.graphNames);

            this.setState({
                diagramText: graph ? graph.content : '',
                hasError: false,
                error: null,
                errorInfo: null,
            });
        } catch (err) {
            this.setState({
                diagramText: '',
                hasError: true,
                error: err,
                errorInfo: err,
            });
        }

    }

    handleGraphChange = (e) => {
        var key = e.target.value;
        var graph = getGraphRecipe(key);
        var nodes = 'A,B'; // default
        if (graph && graph.nodes) {
            nodes = graph.nodes;
        }

        this.setState({
            graphKey: key,
            graphNames: nodes,
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
        if (self.state.hasError && self.state.error) {
            errMsg = <pre>{self.state.error.message ? self.state.error.message : self.state.error}</pre>;
        }

        var graphOptions = [];
        var allGraphsTemp = allGraphs();
        allGraphsTemp.forEach(function(g) {
            graphOptions.push(
                <option key={g.key} value={g.key}>{g.name}</option>
            );
        });

        return (
            <div className="site-content container-fluid">
                <div className="row">
                  <div className="col-md-4">
                    <h4>Start Here...</h4>
                    <p><strong>Select the type of call flow you want to view:</strong></p>

                    <div className="form-input">
                        <label>Call Type</label>
                        <br/>
                        <select onChange={(e) => this.handleGraphChange(e)} value={this.state.graphValue}>
                          <option value="select">Select Graph</option>
                          {graphOptions}
                        </select>
                    </div>

                    <div className="form-input">
                        <label>Optional: Alter Node Names <small>(comma separated list)</small></label>
                        <br/>
                        <input name="graph-names" type="text" onChange={(e) => this.handleUserChange(e)} value={this.state.graphNames} />
                    </div>

                    <div className="form-input">
                        <button onClick={(e) => this.drawGraph(e)}>Generate Graph</button>
                    </div>

                    <hr />

                    <div>
                        <button className="link-button" onClick={(e) => this.toggleGraphText(e)}>Toggle Graph Text</button>
                        &nbsp;
                        <button className="link-button" onClick={(e) => this.graphReset(e)}>Reset Graph</button>
                    </div>

                    {self.state.showGraphText
                        ?  <textarea className="chart-text" onChange={e => self.handleChange(e)} value={self.state.diagramText}>{self.state.diagramText}</textarea>
                        : null}
                  </div>

                  <div className="col-md-8 diagram-wrapper">
                    {self.state.hasError
                        ? <><p>Error!</p>{errMsg}</>
                        : (self.state.diagramText ? childrenWithProps : null)
                    }
                  </div>
              </div>
            </div>
        );
    }
}

export default SIPDiagram;
