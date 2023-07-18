/* Bundels all Layout Options */

import cytoscape, { NodeSingular } from "cytoscape";
import { LayoutController } from "../util/LayoutController";
import { graphLayout } from "./fcoseOptions";

function getDegree(ele:any) {
    return ele.isEdge() ? ele.target().degree() : ele.degree();
}

const getRepulsion = (node:cytoscape.NodeSingular) => {
    const degree = node.degree(false);
    return 1000 + degree * 10000;
}

const getEdgeLength = (edge:cytoscape.EdgeSingular) => {
    const degree = edge.target().degree(false);
    // *2 if resource ??
    return 5000 + degree * 1000;
}

const getSeparation = (node:cytoscape.NodeSingular) => {
    const degree = getDegree(node);
    return degree * 100;
}

export function setCourseNode (id:String, xPos:Number, yPos:Number) {
    return [{nodeId: id, position: {x: xPos, y: yPos}}];
}

const getConstraint = () => {
    [{nodeId: 'n1', position: {x: 100, y: 200}}]
}

export const fcose = {
    //https://github.com/iVis-at-Bilkent/cytoscape.js-fcose
    name: 'fcose',
    //quality: 'default',
    randomize: false,
    animate: true,
    fit: true, 
    packComponents: false,
    padding: 15,
    nodeDimensionsIncludeLabels: true,
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
    nodeRepulsion: 200,
    // Ideal edge (non nested) length
    idealEdgeLength: 100,
    // Divisor to compute edge forces
    edgeElasticity: 0.2,

    nestingFactor: 0.1,
    tile: true,
    //tilingCompareBy: node => node.degree(),
    //fixedNodeContraint: setCourseNode,
}

export const fcose2 = {
    //https://github.com/iVis-at-Bilkent/cytoscape.js-fcose
    name: 'fcose',
    //quality: 'default',
    randomize: false,
    animate: true,
    fit: true, 
    packComponents: false,
    padding: 15,
    nodeDimensionsIncludeLabels: true,
    uniformNodeDimensions: false, // for simple nodes (non-compound)    
    // packComponents: true, // needs: layout-utilities (test), see no change
    nodeSeparation: 100,
    /*  Incremental Layout options */
    nodeRepulsion: 100,
    idealEdgeLenght: 100,
    //nodeRepulsion: getRepulsion,
    //idealEdgeLenght: getEdgeLength,
    gravity: 0,
    tile: true,
}

// run separate, layout inside of a course
export const fcoseInside = {
    name: 'fcose',
    quality: 'default',
    radomize: false,
    animate: true,
    fit: false, 
    padding: 15,
    nodeDimensionsIncludeLabels: true,
    uniformNodeDimensions: false, // for simple nodes (non-compound)    
    // packComponents: true, // needs: layout-utilities (test), see no change
    nodeSeparation: 300, // dynamic not a good idea for perfomance
    /*  Incremental Layout options */
    //nodeRepulsion: 5000,
    nodeRepulsion: getRepulsion,
    idealEdgeLenght: 500, // scheint keinen unterschied zu machen
    gravity: 0.25,
    tile: true,
}

// New Test
// Run only one layout
export const fcose3 = {

}

export const grid = {
    name: 'grid',
    fit: true,
    avoidOverlap: true,
}

export const concentric = {
    name: 'concentric',
    fit: true,
    minNodeSpacing: 10,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    spacingFactor: 0.5,
    concentric: function(node:NodeSingular) {
        return (node.maxDegree(false) + node.minDegree(false)) - node.degree(false);
    },
    levelWidth: function( nodes:any ){ // the variation of concentric values in each level
        return nodes.maxDegree() / 4;
    },
}

export const noLayout = {
    name: 'null',
}

export const spread = {
    name: 'spread',
    animate: false,
    fit: true,
    padding: 20,
    prelayout: graphLayout,
}

let clusters = [] as any;

export function setClusters(eles:any){
    clusters = eles;
}

export const cise = {
    name: 'cise',
    clusters: clusters,
    nodeSeparation: 20,
}