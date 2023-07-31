import cytoscape from "cytoscape";

export const breadthfirst = {
    name: 'breadthfirst',
    fit: true,
    directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 5, // padding on fit
    circle: false,
    grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
    spacingFactor: 1, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, 
    nodeDimensionsIncludeLabels: false, 
    roots: undefined, // the roots of the trees
    depthSort: undefined, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, 
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled,
    //animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    // transform a given node position. 
    //transform: function (node, position ){ return position; }
};

let count = 0;

export const dagre = {
    name: "dagre",
     // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: "TB", // 'TB' for top to bottom flow, 'LR' for left to right,
    align: undefined,  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
                            // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: 'tight-tree', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 5, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: false, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    // transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
    transform: function(node: cytoscape.NodeSingular, pos:any) {
        // TODO: verbessern
        // currently staggers the connected nodes, so that the PathViz-graph is not as wide
        if(node.hasClass("connect")) {
            if(count % 2 != 0) {
                pos.y = pos.y * 0.5;
                // pos.x = pos.x - 200;
            } else {
                pos.y = pos.y * 2;
                // pos.x = pos.x * 0.5;
            }
        }
        count++;
        return pos;
    },
    ready: function(){}, // on layoutready
    sort: undefined, // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
                    // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
                    // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
                    // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
    stop: function(){} // on layoutstop
}