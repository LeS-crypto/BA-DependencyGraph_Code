import cytoscape from "cytoscape";

const setInclude = (node:cytoscape.NodeSingular) => {
    return node.hasClass("ghost") ? false : true;
}

const setRepulsion = (node:cytoscape.NodeSingular) => {
    if(node.hasClass("ghost")) {
        return 0;
    } else if (node.hasClass("course")) {
        return 50000;
    } else {
        const degree = node.degree(false);
        return degree * 100;
    }
    //return node.hasClass("ghost") ? 50 : 100000;
}

const setLength = (edge:cytoscape.EdgeSingular) => {
    if(edge.hasClass("ghost-edges")) {
        return 0;
    } else {
        //Longer edge for bigger degree
        const degree = edge.target().degree(false);
        return degree < 25 ? 2 : degree * 5 ;
        //return degree < edge.target().maxDegree(false) ? 5 : degree  * 5;
    }
    //return edge.hasClass("ghost-edges") ? 1 : 100;
}

export const graphLayout = {
    name: "fcose",
    quality: "proof",
    // Use random node positions at beginning of layout
    // if this is set to false, then quality option must be "proof"
    randomize: false, 
    // Whether or not to animate the layout
    animate: true, 
    // Duration of animation in ms, if enabled
    animationDuration: 1000, 
    // Easing of animation, if enabled
    animationEasing: undefined, 
    // Fit the viewport to the repositioned nodes
    fit: true, 
    // Padding around layout
    padding: 15,
    // Whether to include labels in node dimensions. Valid in "proof" quality
    nodeDimensionsIncludeLabels: setInclude,
    // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
    uniformNodeDimensions: false,
    // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
    packComponents: false,
    // Layout step - all, transformed, enforced, cose - for debug purpose only
    step: "all",
    
    /* incremental layout options */
    
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: setRepulsion,
    // Ideal edge (non nested) length
    idealEdgeLength: setLength,
    // Divisor to compute edge forces
    edgeElasticity: 0.2, // 10
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
    numIter: 2500,
    // For enabling tiling
    tile: true,
    // The comparison function to be used while sorting nodes during tiling operation.
    // Takes the ids of 2 nodes that will be compared as a parameter and the default tiling operation is performed when this option is not set.
    // It works similar to ``compareFunction`` parameter of ``Array.prototype.sort()``
    // If node1 is less then node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return a negative value
    // If node1 is greater then node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return a positive value
    // If node1 is equal to node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return 0
    tilingCompareBy: undefined,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity force (constant)
    gravity: 0.25,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8, 
    // Initial cooling factor for incremental layout  
    initialEnergyOnIncremental: 0.3,
  
    /* constraint options */
  
    // Fix desired nodes to predefined positions
    // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
    fixedNodeConstraint: undefined,
    // Align desired nodes in vertical/horizontal direction
    // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
    alignmentConstraint: undefined,
    // Place two nodes relatively in vertical/horizontal direction
    // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
    relativePlacementConstraint: undefined,
  
    /* layout event callbacks */
    ready: () => {}, // on layoutready
    stop: () => {} // on layoutstop
};
// Source: https://github.com/iVis-at-Bilkent/cytoscape.js-fcose 

// keine wirkliche veränderung
const setRepulsionCourse = (node:cytoscape.NodeSingular) => {
    const weight = node.data("weight");
    return weight ? weight * 200 : 200;
}

const setLengthCourse = (edge:cytoscape.EdgeSingular) => {
    const weight = edge.target().data("weight");
    return weight ? weight * 150 : 200;
    return 100;
    //return edge.hasClass("ghost-edges") ? 1 : 100;
}

// Layout for inside course, when showConnected()
export const fcoseCourse = {
    name: 'fcose',
    //quality: 'default',
    randomize: false,
    animate: true,
    fit: true, 
    packComponents: false,
    padding: 5,
    nodeDimensionsIncludeLabels: true,
    avoidOverlap: true,
    /* incremental layout options */
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: setRepulsionCourse, // 200 
    // Ideal edge (non nested) length
    idealEdgeLength: setLengthCourse, // 100 -> 150
    // Divisor to compute edge forces
    edgeElasticity: 0.2,

    nestingFactor: 0.1,
    tile: true,

    // relativePlacementConstraint: null as any,
    // fixedNodeConstraint: null as any,
}