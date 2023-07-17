import { Stylesheet } from "cytoscape";
import { hoverColors, nodeColors } from "./colorsCofig";
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

export function setConnectedColor(target:cytoscape.NodeSingular, eles:cytoscape.Collection){
    let number = 0
    eles.nodes().forEach(ele => {
        ele.data("weight", number);
        amount++;
        // for each element lighten the color a little bit
        // map to data
    });
}

let amount = 0;

// blackens 0 to 1, whitens 0 to -1
function setBlacken (node:any) :number {
    amount = amount - 0.2;
    return amount;
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
    // hide nodes -> needed ??
    { selector: '.hide',
        style: {
        'display': 'none',
        //'visibility': 'hidden',
        }
    },
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
        }
    },

    { selector: '.connect',
    style: {
        'background-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey2 + ',' + nodeColors.lightgrey2 + ')', //??
        'border-color': nodeColors.darkgrey2,
        'border-width': 3,
        'border-opacity': 1,
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

    // Selection
    { selector: ':selected',
    style: {
        'background-color': hoverColors.hover,
        'font-weight': 'bold',
        'text-background-color': 'white',
        'text-background-opacity': 1, 
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
        'curve-style': 'straight',
        'events': 'no',
        'z-compound-depth': 'auto',
        'width': 5,
        'line-opacity': 1, 
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
    { selector: '.hide-edges',
    style: {
        //'line-opacity': 0,
        'line-color': 'white',
        'z-compound-depth': 'bottom',
        }
    },

    { selector: '.edge-connect',
    style: {
        'line-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey + ',' + nodeColors.lightgrey2 + ')',
        'source-arrow-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey + ',' + nodeColors.lightgrey2 + ')',
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

    // COURSES:
    { selector: '.course',
        style: {
        'width': courseSize,
        'height': courseSize,
        'background-blacken': 0.5,
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