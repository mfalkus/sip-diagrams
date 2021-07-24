/**
 * Render call flow list and call flow diagram.
 *
 * Nothing special in the form, but note that the mermaid render needs to be
 * passed in as a child object. This component will catch errors from children,
 * which is required as the mermaid lib will throw for bad syntax. This way we
 * can disable a neat error to the user without bricking the page.
 *
 */

import React from "react";
import {allGraphs, generateGraphContent, getGraphRecipe} from './Graphs';

// Formatted so it accepts the base64 encoded string immediately appended
const MermaidLiveEditURL = 'https://mermaid-js.github.io/mermaid-live-editor/edit/#';

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
        graphNameDisabled: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.drawGraph = this.drawGraph.bind(this);
    this.toggleGraphText = this.toggleGraphText.bind(this);
    this.graphReset = this.graphReset.bind(this);
    this.graphExport = this.graphExport.bind(this);
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
        this.setGraphContent('');
    }

    graphExport = (e) => {
        var j = JSON.stringify(
            // Based on the default string encoded when you fire up the Mermaid online editor
            // See https://github.com/mermaid-js/mermaid-live-editor
            {
                code: "%% Generated at " + window.location.href + "\n"
                    + this.state.diagramText,
                // default, forest, dark or neutral
                mermaid:{ theme: "default" },
                autoSync:true, // Should the editor update as the user makes changes?
                updateEditor:true,
                updateDiagram:true
            }
        );

        // Redirect the user to the live editor with graph
        window.location.href = MermaidLiveEditURL + btoa(j);
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
        var disabled = false;
        if (graph && graph.nodes) {
            nodes = graph.nodes;
        }
        if (graph && graph.static_content) {
            disabled = true;
        }

        this.setState({
            graphKey: key,
            graphNames: nodes,
            graphNameDisabled: disabled,
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
                        <input disabled={this.state.graphNameDisabled} name="graph-names" type="text" onChange={(e) => this.handleUserChange(e)} value={this.state.graphNames} />
                    </div>

                    <div className="form-input">
                        <button onClick={(e) => this.drawGraph(e)}>Generate Graph</button>
                    </div>

                    <hr />

                    <div>
                        <button title="Show/hide the graph text" className="link-button" disabled={!self.state.diagramText} onClick={(e) => this.toggleGraphText(e)}>Toggle Graph Text</button>
                        &nbsp;
                        <button title="Export graph to Mermaid Live Editor for additional features" className="link-button" disabled={!self.state.diagramText} onClick={(e) => this.graphExport(e)}>Export</button>
                        &nbsp;
                        <button title="Clear the graph text" className="link-button" disabled={!self.state.diagramText} onClick={(e) => this.graphReset(e)}>Reset</button>
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
