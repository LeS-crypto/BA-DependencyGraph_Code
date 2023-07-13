import { Stylesheet } from "cytoscape";
import { graphColors } from "./colorsCofig";
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
    return nodeSize(ele) / 2;
}

/* ---- STYLESHEET ---- */
export const style: Stylesheet[] = [
    // NODES:
    { selector: 'node',
    style: { // Show node with label
        'label': 'data(label)',
        'text-wrap': 'wrap', //wrap text on second space
        "text-max-width": '150',
        //'border-color': "#666",
        'width': nodeSize,
        'height': nodeSize,
        //'padding-relative-to': 'min', // ?
        //'z-compound-depth': 'top',
        'text-background-padding': '5',
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
            'opacity': 0.3,
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
            'opacity': 0.3,
            'label': '', //Label doesn't take up space
            'text-opacity': 0,
            'z-compound-depth': 'bottom',
            'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
            //'overlay-padding': nodeSize, //?
        }
    },

    // highlight on hover
    { selector: ".hover",
        style: {
            //TODO
            'border-width': 5,
            'border-color': graphColors.hover2,
            'background-color': graphColors.hover,
            'font-weight': 'bold',
            'text-background-color': 'white',
            'text-background-opacity': 1, 
            'text-wrap': 'wrap',
            //'text-transform': 'uppercase',
            // wrap text -> 
        }
    },
    // incoming node
    { selector: '.node-incoming',
    style: {
        'background-color': graphColors.incoming,
        'text-wrap': 'wrap',
        }
    },
    // outgoing node
    { selector: '.node-outgoing',
    style: {
        'background-color': graphColors.outgoing,
        'text-wrap': 'wrap',
        }
    },
    // RESOURCES -> dont change on hover, etc
    { selector: '.resource',
    style: {
        'background-color': graphColors.resource,
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
        'z-compound-depth': 'bottom',
        'width': 5,
        }
    },
    { selector: '.hide-edges',
    style: {
        'line-opacity': 0,
        'z-compound-depth': 'bottom',
        }
    },
    // incoming edges
    { selector: '.edge-incoming',
    style: {
        'line-fill': 'linear-gradient',
        'line-gradient-stop-colors': [graphColors.hover, graphColors.incoming],
        'target-arrow-color': graphColors.incoming,
        'width': 7,
        'z-compound-depth': 'top',
        }
    },
    // outgoing edges
    { selector: '.edge-outgoing',
    style: {
        'line-fill': 'linear-gradient',
        'line-gradient-stop-colors': [graphColors.outgoing, graphColors.hover],
        'target-arrow-color': graphColors.hover,
        'width': 5,
        'z-compound-depth': 'top',
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
        'text-background-opacity': 0.5,
        'text-wrap': 'wrap',
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