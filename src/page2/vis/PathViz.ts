import cytoscape from "cytoscape";
import { stylesheet } from "../design/stylesheet";
import { GLOBALS } from "../../global/config";
import { INFO_NODES } from "../../global/data/infoNodes";

export class PathViz {

    private readonly cy: cytoscape.Core;
    private readonly $container: HTMLElement;

    constructor() {
        this.$container = document.getElementById("path") as HTMLElement;
        this.cy = cytoscape({
            container: this.$container,
            style: stylesheet,
            elements: INFO_NODES,
            layout: GLOBALS.breadthLayout,
        });  
        //this.cy.ready(this.layoutGraph);
    }

    private layoutGraph() {
        console.log("start path layout");
        // TODO Dagre
        this.cy.layout(GLOBALS.breadthLayout).run();
        // TODO styling
    }

    public setElements(
        pathElements: cytoscape.Collection
    ) {
        this.cy.remove(this.cy.elements());
        this.cy.add(pathElements);
        this.layoutGraph();
    }

    public getCore(){
        return this.cy;
    }

    /* ---- EVENT FUNCTIONS ---- */

}