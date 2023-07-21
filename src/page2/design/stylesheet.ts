import { Stylesheet } from "cytoscape";
import { connectColors, nodeColors } from "../../global/colorsCofig";

let amount : number = 4;

/* ---- Utility Functions ---- */

const setFontSize = (node:any) => {
    if(node.hasClass("ghost")) {
        return 14;
    }
    const degree = node.degree();
    return degree > 30 ? degree : 14 + degree;
}

const ghostSize = (ele:any) => {
    return nodeSize(ele) / 2;
}

const nodeSize = (ele: any) => {
	const degree = ele.degree();
    const res = 7 + degree * 7;
	return res > 100 ? 100 : res;
};

export const stylesheet: Stylesheet[] =  [

    /* NODES */
    
    // Default node styling
    { selector: 'node',
    style: { 
        'label': 'data(label)',
        'background-color': nodeColors.grey1, 
        'text-wrap': 'wrap',
        "text-max-width": '120',
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        'text-halign': 'center',
        'text-valign': 'center',
        'font-size': setFontSize, 
        // @ts-ignore
        'padding': 5,
        'text-events': 'yes',
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
            //'events': 'no',
            'width': ghostSize,
            'height': ghostSize,
        }
    },

    // HIGHLIGHT connected
    { selector: '.connect',
    style: {
        'background-color': 'mapData(weight, 0,' 
            + amount + ','
            + connectColors.close + ',' 
            + connectColors.far + ')',
        }
    },
    { selector: '.target-connect',
    style: {
        'border-color': connectColors.tBorder,
        'border-width': 5,
        'border-opacity': 1,
        'background-color': connectColors.target,
        'color': 'white',
        'text-opacity': 1,
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        }
    },

    // HIGHLIGHT on HOVER
    { selector: ".hover",
    style: {
        'border-width': 5,
        'border-color': 'black',
        'label': 'data(label)',
        'font-weight': 'bold',
        'text-opacity': 1,
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        'font-size': setFontSize,
        //'text-background-color': 'white',
        // 'text-background-opacity': 1, 
        'text-wrap': 'wrap',
        'z-compound-depth': 'top',
        'z-index': 1000,
        }   
    },


    // incoming node
    { selector: '.node-incoming',
    style: {
        'background-color': nodeColors.grey1,
        // 'border-color': 'black',
        'text-wrap': 'wrap',
        'text-opacity': 1,
        'font-size': setFontSize,
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
        //'background-color': hoverColors.outgoing,
        'text-wrap': 'wrap',
        'text-opacity': 1,
        'font-size': setFontSize,
        'color': 'black',
        'width': 'label',
        'height': 'label',
        'shape': 'rectangle',
        // @ts-ignore
        'padding': 5,
        'z-compound-depth': 'top',
        }
    },
    

    



/* ---------------------------------------- */

    /* EDGES */

    // Default edge styling
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
        'label': '',
        }
    },

    { selector: '.ghost-edges',
    style: {
        'line-opacity': 0.3,
        'line-color': nodeColors.lightgrey,
        'source-arrow-color': nodeColors.lightgrey,
        'z-compound-depth': 'bottom',
        'source-arrow-shape': 'none',
        'label': '',
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
        'z-compound-depth': 'auto',
        'label': '',
        }
    },

        

]