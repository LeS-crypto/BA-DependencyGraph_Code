export const breadthfirst = {
    name: 'breadthfirst',
    fit: true,
    directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 5, // padding on fit
    circle: false,
    grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
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