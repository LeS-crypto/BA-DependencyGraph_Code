import { Stylesheet } from "cytoscape";
import { connectColors, hoverColors, nodeColors } from "./colorsCofig";
//import { url } from "inspector";
import feed from "../../global/icons/feed.svg";
import school from "../../global/icons/school.svg";

//const encoded_feed = encodeURI("data:image/svg+xml;utf-8," + feed); //??

const nodeSize = (ele: any) => {
	const degree = ele.degree();
    const res = 7 + degree * 7;
	return res > 100 ? 100 : res;
};
// size + gradient? -> smaller = lighter

const courseSize = (ele: any) => {
    const degree = ele.degree();
    const res = (7 + degree * 7) / 2;
    return res < 50 ? 50 : res;
}

const ghostSize = (ele:any) => {
    return nodeSize(ele) / 1.5;
}

const getOpacityOut = (edge:any) => {
    //console.log(edge.source().hasClass("ghost"));
    let isGhost = edge.source().hasClass("ghost");
    return isGhost ? 0.3 : 1;
}

const getOpacityIn = (edge:any) => {
    //console.log(edge.target().hasClass("ghost"));
    let isGhost = edge.target().hasClass("ghost");
    return isGhost ? 0.3 : 1;
}

// default font size = 14
const setFontSize = (node:any) => {
    const degree = node.degree();
    return degree > 30 ? degree : 14 + degree;
    return 14 + degree;
}

let amount : number = 4;

/* ---- STYLESHEET ---- */
export const labelStylesheet: Stylesheet[] = [
    // NODES:
    { selector: 'node',
    style: { // TODO: show size of node -> probably using font-size
        'label': 'data(label)',
        //'background-color': nodeColors.lightgrey2, 
        'text-wrap': 'wrap', //wrap text on second space
        "text-max-width": '120',
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        'text-halign': 'center',
        'text-valign': 'center',
        'font-size': setFontSize, 
        // @ts-ignore
        'padding': 10, // type doesn't exist
        'text-events': 'yes',
        }
    },
    // Selection -> also selects on dbl-click
    { selector: ':selected',
    style: {
        //'background-color': hoverColors.hover,
        'background-color': nodeColors.grey,
        'font-weight': 'bold',
        'text-background-color': 'white',
        'text-background-opacity': 1, 
        'z-compound-depth': 'top',
        'border-color': hoverColors.hover,
        'border-width': 5,
        }
    },
    // hide nodes
    { selector: '.hide',
        style: {
        'display': 'none',
        //'visibility': 'hidden',
        }
    },
    { selector: '.ghost-internal',
        style: {
            'opacity': 0.5,
            'shape': 'ellipse',
            'label': 'data(label)',
            'text-opacity': 0,
            'z-compound-depth': 'bottom',
            'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
            //'overlay-padding': nodeSize, //?
            'text-background-padding': '100',
        }
    },
    { selector: '.ghost',
        style: {
            //'opacity': 0.3, 
            'opacity': 0.75, 
            'shape': 'ellipse',
            'background-color': nodeColors.lightgrey2,
            'label': 'data(label)', //Label doesn't take up space
            'text-opacity': 0,
            'z-compound-depth': 'bottom',
            'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
            //'overlay-padding': nodeSize, //?
        }
    },

    { selector: '.target-connect',
    style: {
        'background-color': connectColors.target,
        'border-color': connectColors.tBorder,
        'font-weight': 'bold',
        'text-background-color': 'white',
        'text-background-opacity': 1, 
        'border-width': 5,
        'border-opacity': 1,
        }   
    },

    { selector: '.connect',
    style: {
        'background-color': 'mapData(weight, 0,' 
            + amount + ','  // not dynamic -> should be maxDepth, but how?
            + connectColors.close + ',' 
            + connectColors.far + ')', //??
        }
    },

    // highlight on hover
    { selector: ".hover",
        style: {
            //TODO
            'border-width': 5,
            'border-color': hoverColors.hover2,
            'background-color': hoverColors.hover,
            'font-weight': 'bold',
            'text-background-color': 'white',
            'text-background-opacity': 1, 
            'text-wrap': 'wrap',
            'z-compound-depth': 'top',
            'z-index': 1000,
        }
    },
    // incoming node
    { selector: '.node-incoming',
    style: {
        'background-color': hoverColors.incoming,
        'text-wrap': 'wrap',
        'text-opacity': 1,
        'color': 'black',
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        // @ts-ignore
        'padding': 5,
        'z-compound-depth': 'top',
        }
    },
    // outgoing node
    { selector: '.node-outgoing',
    style: {
        'background-color': hoverColors.outgoing,
        'text-wrap': 'wrap',
        'text-opacity': 1,
        'color': 'black',
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        // @ts-ignore
        'padding': 5,
        'z-compound-depth': 'top',
        }
    },
    // RESOURCES -> dont change on hover, etc
    { selector: '.resource',
    style: {
        'background-color': hoverColors.resource,
        'width': nodeSize,
        'height': nodeSize,
        'background-image': feed,
        'background-fit': 'contain',
        'background-opacity': 0,
        'label': "",
        }
    },
    { selector: '.resource-hide',
    style: {
        'width': nodeSize,
        'height': nodeSize,
        'background-image': feed,
        'background-fit': 'contain',
        'background-opacity': 0,
        'background-image-opacity': 0.5,
        'label': "",
        }
    },
    // EDUCATROS
    { selector: '.educator',
    style: {
        'background-image': school,
        'background-fit': 'contain',
        'text-wrap': 'none',
        }
    },


    // EDGES:
    // NOTE: direction of edge correct?
    { selector: 'edge',
    style: {
        'source-arrow-shape': 'triangle',
        'line-color': nodeColors.grey1,
        'source-arrow-color': nodeColors.grey1,
        'curve-style': 'straight',
        'events': 'no',
        'z-compound-depth': 'auto',
        'width': 5,
        'line-opacity': 1, 
        }
    },
    { selector: '.ghost-edges',
    style: {
        'line-opacity': 0.3,
        'line-color': nodeColors.lightgrey,
        'source-arrow-color': nodeColors.lightgrey,
        'z-compound-depth': 'bottom',
        'source-arrow-shape': 'none'
        }
    },
    { selector: '.hide-edges',
    style: {
        //'line-opacity': 0,
        'line-color': 'white',
        'z-compound-depth': 'bottom',
        }
    },

    { selector: '.edge-connect',
    style: {
        'line-color': 'mapData(weight, 0, '
            + amount +',' 
            + connectColors.close + ',' 
            + connectColors.far + ')',
        'source-arrow-color': 'mapData(weight, 0, '
            + amount +','  
            + connectColors.close + ',' 
            + connectColors.far + ')',
        //'line-gradient-stop-colors': getGradientColors,
        'z-compound-depth': 'auto',
        }
    },

    // incoming edges
    { selector: '.edge-incoming',
    style: {
        'line-fill': 'linear-gradient',
        'line-gradient-stop-colors': [hoverColors.hover, hoverColors.incoming],
        'source-arrow-color': hoverColors.hover,
        'width': 7,
        'z-compound-depth': 'top', 
        'line-opacity': getOpacityIn,
        }
    },
    // outgoing edges
    { selector: '.edge-outgoing',
    style: {
        'line-fill': 'linear-gradient',
        'line-gradient-stop-colors': [hoverColors.outgoing, hoverColors.hover],
        'source-arrow-color': hoverColors.outgoing,
        'width': 5,
        'z-compound-depth': 'top', 
        'line-opacity': getOpacityOut,
        }
    },

    // COURSES:
    { selector: '.course',
        style: {
        'width': 'label',
        'height': 'label',
        // @ts-ignore
        'padding': 10,
        'background-blacken': 0.5,
        'label': 'data(label)',
        'events': 'yes',
        'font-weight': 'bold',
        'text-transform': 'uppercase',
        'text-halign': 'center',
        'text-valign': 'center',
        'text-background-color': 'white',
        'text-background-opacity': 1,
        'text-background-padding': '5', 
        'text-wrap': 'wrap',
        'text-events': "yes",
        }
    },


    //parents:
    // hide parents in graph
    { selector: ':parents',
    style: {
        'background-opacity': 0,
        'border-width': 0,
        'label': '',
        'events': 'no',
        }
    },
]