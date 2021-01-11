export const getEdgesCommingFrom = (graph, from, markedNodes, maxDepth = 2, currentDepth = 1) => {
    
  if (currentDepth > maxDepth) {
    return [[], []];
  }

  const { nodes, edges } = graph.state.graph;

  let outEdges = [];
  let outNodes = [];
  
  for (const edge of edges) {
    const { from_node, to_node } = edge.origin;
    if (from === from_node) {
      outEdges.push(edge);
      
      if (!markedNodes.hasOwnProperty(from_node)) {
        markedNodes[from_node] = true;
        outNodes.push(nodes[graph.byhash[from_node]])
      }

      if (!markedNodes.hasOwnProperty(to_node)) {
        markedNodes[to_node] = true;
        outNodes.push(nodes[graph.byhash[to_node]])
      }

      let nextLevel = getEdgesGoingTo(graph, to_node, markedNodes, maxDepth, currentDepth + 1);

      outEdges = outEdges.concat(nextLevel[0]);
      outNodes = outNodes.concat(nextLevel[1]);

      nextLevel = getEdgesCommingFrom(graph, to_node, markedNodes, maxDepth, currentDepth + 1);

      outEdges = outEdges.concat(nextLevel[0]);
      outNodes = outNodes.concat(nextLevel[1]);
    }
  }

  return [outEdges, outNodes];
}

export const getEdgesGoingTo = (graph, to, markedNodes, maxDepth = 2, currentDepth = 1) => {
  
  if (currentDepth > maxDepth) {
    return [[], []];
  }

  const { nodes, edges } = graph.state.graph;

  let outEdges = [];
  let outNodes = [];
  
  for (const edge of edges) {
    const { from_node, to_node } = edge.origin;
    if (to === to_node) {
      outEdges.push(edge);
      
      if (!markedNodes.hasOwnProperty(from_node)) {
        markedNodes[from_node] = true;
        outNodes.push(nodes[graph.byhash[from_node]])
      }

      if (!markedNodes.hasOwnProperty(to_node)) {
        markedNodes[to_node] = true;
        outNodes.push(nodes[graph.byhash[to_node]])
      }

      let nextLevel = getEdgesGoingTo(graph, from_node, markedNodes, maxDepth, currentDepth + 1);

      outEdges = outEdges.concat(nextLevel[0]);
      outNodes = outNodes.concat(nextLevel[1]);

      nextLevel = getEdgesCommingFrom(graph, from_node, markedNodes, maxDepth, currentDepth + 1);

      outEdges = outEdges.concat(nextLevel[0]);
      outNodes = outNodes.concat(nextLevel[1]);
    }
  }

  return [outEdges, outNodes];
}