import cytoscape, { Stylesheet } from "cytoscape";
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

// Doesn't work (sadly)
const getGradientColors = (edge:cytoscape.EdgeSingular) => {
    const col1 = edge.target().style("background-color") as string;
    const col2 = edge.source().style("background-color") as string;
    return [col1, col2];
}

const amount2 = 7;
let amount : number = 7;
export function setAmount(maxDepth:number) {
    amount = maxDepth;
}

/* ---- STYLESHEET ---- */
export const style: Stylesheet[] = [
    // NODES:
    { selector: 'node',
    style: {
        'label': 'data(label)',
        'text-wrap': 'wrap',
        "text-max-width": '150',
        'width': nodeSize,
        'height': nodeSize,
        'text-background-padding': '5',
        }
    },

    // COURSES:
    { selector: '.course',
        style: {
        'width': courseSize,
        'height': courseSize,
        //'background-blacken': 0.2,
        'background-color': nodeColors.darkgrey,
        'label': 'data(label)',
        'events': 'yes',
        'font-weight': 'bold',
        'text-transform': 'uppercase',
        'text-halign': 'center',
        'text-valign': 'center',
        'text-background-color': 'white',
        'text-background-opacity': 1,
        'text-wrap': 'wrap',
        'text-events': "yes",
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

    // hide nodes -> needed ??
    /*{ selector: '.hide',
        style: {
        'display': 'none',
        //'visibility': 'hidden',
        }
    }, */
    { selector: '.ghost-internal',
        style: {
            'opacity': 0.5,
            'label': 'data(label)',
            'text-opacity': 0,
            'z-compound-depth': 'bottom',
            'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
            'text-background-padding': '100',
        }
    },
    { selector: '.ghost',
        style: {
            //'opacity': 0.3, 
            'opacity': 0.75, 
            'background-color': nodeColors.lightgrey2,
            'label': 'data(label)', //Label doesn't take up space
            'text-opacity': 0,
            'z-compound-depth': 'bottom',
            'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
            // 'width': ghostSize,
            // 'height': ghostSize,
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
        // 'background-color': 'mapData(weight, 0, 20,' + nodeColors.darkgrey2 + ',' + nodeColors.lightgrey2 + ')', //??
        // 'border-color': nodeColors.darkgrey2,
        // for 10 -> make dynamic ??
        'background-color': 'mapData(weight, 0,' 
            + amount + ',' 
            + connectColors.close + ',' 
            + connectColors.far + ')', //??
        // 'background-color': 'mapData(weight, 0, 10,' + connectColors.close + ',' + connectColors.far + ')', //??
        // 'border-color': nodeColors.darkgrey2,
        // 'border-width': 3,
        //'border-opacity': 0,
        }
    },
    { selector: '.un-connect',
    style: {
        'background-color': nodeColors.lightgrey2,
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
        }
    },
    // outgoing node
    { selector: '.node-outgoing',
    style: {
        'background-color': hoverColors.outgoing,
        'text-wrap': 'wrap',
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


    /* ---- EDGES ---------------------------- */
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
    { selector: '.edge-un-connect',
    style: {
        'line-opacity': 1,
        'line-color': nodeColors.lightgrey2,
        'source-arrow-color': nodeColors.lightgrey2,
        }
    },

    // HOVER: incoming edges
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
    // HOVER: outgoing edges
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

    { selector: '.ghost-edges',
    style: {
        'line-opacity': 0.3, // 0.75
        'line-color': nodeColors.lightgrey,
        'source-arrow-color': nodeColors.lightgrey,
        'z-compound-depth': 'bottom',
        'source-arrow-shape': 'none'
        }
    },


    //parents:
    // hide parents in graph
    { selector: ':parents',
    style: {
        'background-opacity': 1,
        'border-width': 0,
        'label': '',
        'events': 'no',
        }
    },
]