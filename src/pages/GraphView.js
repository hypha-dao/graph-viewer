import { Component } from 'react'
import { get_table, set_url } from '../providers/Table';
import Graph from 'vis-react'
import './GraphView.css';
import ReactJson from 'react-json-view'
import { getEdgesCommingFrom, getEdgesGoingTo } from '../api/NodesFilters';
import { getContent, getGroup, nameGroups } from '../api/DocumentHelpers';
import ConfigBar from '../components/ConfigBar';

const options = {
  physics: {
    enabled: true,
    solver: 'repulsion',
    stabilization: {
      enabled: false,
    },
    // repulsion: {
    //   centralGravity: 0,
    //   springLength: 200,
    //   springConstant: 0.05,
    //   nodeDistance: 100,
    //   damping: 0.09
    // },
  },
  layout: {
    hierarchical: {
      enabled: false,
      direction:'UD',
      sortMethod: 'directed'
    }
  },
  edges: {
      color: '#000000',
      smooth: true
  },
  nodes: {
    fixed: {
      x: false,
      y: false
    }
  },
  interaction: { hoverEdges: true }
};

class GraphView extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      graph: { nodes: [], edges: [] },
      customView: null,
      style: { width: "100%", height: "100%" },
      network: null,
      currentNode: undefined,
    }

    this.config = {
      nodesLimit: 100,
      edgesLimit: 1000,
      serverUrl: 
      'http://513f67fc2f65.ngrok.io'
      ,
    }

    this.currentDepth = 1;

    this.byhash = {};
    this.events = {
      select: (e) => {

        const { ctrlKey } = e.event.srcEvent;
        this.ctrlKey = ctrlKey;
        if (e.nodes.length === 0) { 
          this.setState({currentNode: undefined, customView: null});
          //this.state.network.redraw();
        }
        else {

          if (!ctrlKey) {
            this.filterID = e.nodes[0];            
          }

          this.viewID = e.nodes[0];

          this.filterNodes(this.currentDepth, e.nodes[0], this.viewID, ctrlKey);
          //this.state.network.redraw();
        }
      }
    };
  }

  filterNodes = (maxDepth, filterIdx, viewIdx, ctrlKey) => {
    
    const originNodes = this.state.graph.nodes;

    let newEdges;
    let newNodes;

    if (ctrlKey) {
      const { currentNode, customView, graph } = this.state;
      const { nodes, edges } = currentNode ? customView : graph;
      newEdges = edges;
      newNodes = nodes;
    }
    else {         

      let markedNodes = {};

      const { data } = originNodes[filterIdx];

      const commingEdgesNodes = getEdgesCommingFrom(this, data.hash, markedNodes, maxDepth);

      const goingEdgesNodes = getEdgesGoingTo(this, data.hash, markedNodes, maxDepth);

      newEdges = commingEdgesNodes[0].concat(goingEdgesNodes[0]);
      newNodes = commingEdgesNodes[1].concat(goingEdgesNodes[1]);
    }

    //Some bug makes the app crash if I don't set the customView to null first
    this.setState({currentNode: originNodes[viewIdx], customView: null}, () => this.setState({customView: { nodes: newNodes, edges: newEdges }}))
  }

  getNetwork = data => {
    this.setState({network: data});
  }

  getEdges = data => {
    console.log("getEdges:", data);
  }

  getNodes = data => {
    console.log("getNodes:", data);
  }

  resize = data => {
    this.state.network.redraw();
    this.state.network.fit();
  }

  depthChange = (newDepth) => {
    this.currentDepth = newDepth;
    const { currentNode } = this.state;
    if (currentNode) {
      this.filterNodes(newDepth, this.filterID, this.viewID);
    }
  }

  loadData = async (url, code = 'accounting') => {

    console.log(url, code);

    try {

      // const { serverUrl } = this.state.config;

      set_url(url);

      const nodesData = await get_table(code, code, 'documents', this.config.nodesLimit);

      let nodes = []; 

      nodesData.rows.forEach((node, idx) => {

        this.byhash[node.hash] = idx;

        let label = node.hash.substr(0, 5);

        const system = getGroup(node, "system");

        if (system) {
          
          const name = getContent(system, "node_label");
          
          if (name) {
            label = name.value[1];
          }
        }

        node = nameGroups(node);

        nodes.push({id: idx, label: label, data: node});
      });

      this.setState({ graph: { ...this.state.graph, nodes: nodes } });

      const edgesData = await get_table(code, code, 'edges', this.config.edgesLimit)

      console.log(edgesData);
      
      let edges = [];

      edgesData.rows.forEach(edge => {
        if (this.byhash.hasOwnProperty(edge.from_node) && 
            this.byhash.hasOwnProperty(edge.to_node)) {
          edges.push({from: this.byhash[edge.from_node], 
            to: this.byhash[edge.to_node], 
            label: edge.edge_name, 
            origin: edge});
        }
      });

      this.setState({ graph: { ...this.state.graph, edges: edges }});

    }
    catch(error) {
      console.log("Error while getting nodes data:", error);
    }
  }

  componentDidMount() {

    window.addEventListener('resize', this.resize);
    
    this.loadData(this.config.serverUrl);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
   
    const { graph, customView, currentNode } = this.state;

    const { serverUrl } = this.config;
    
    const renderGraph = customView ?? graph;

    return (
    <div className="app-container">
      <ConfigBar
        defaultUrl={serverUrl}
        className='options-container' 
        onUrlUpdate={this.loadData}
        onDepthChange={this.depthChange}/>
      <div className="graph-canvas">
      <Graph
        graph={renderGraph}
        options={options}
        style={this.state.style}
        events={this.events}
        getNetwork={this.getNetwork}
        getEdges={this.getEdges}
        getNodes={this.getNodes}
        vis={vis => (this.vis = vis)}/>
      </div>
      <div
        className={`json-container ${currentNode && 'container-show'}`}
      >
        <ReactJson
          displayDataTypes={false}
          theme='monokai'
          style={{
            minWidth: "100%", 
            maxWidth: "100%",
            minHeight: "100%"
          }} 
          src={currentNode} />
      </div>
    </div>)
  }
}

export default GraphView;