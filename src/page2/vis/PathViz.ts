import cytoscape from "cytoscape";
import { stylesheet } from "../design/stylesheet";
import { GLOBALS } from "../../global/config";
import { INFO_NODES } from "../../global/data/infoNodes";
import { StyleController } from "../utils/StyleController";

export class PathViz {

    private readonly cy: cytoscape.Core;
    private readonly $container: HTMLElement;
    private readonly styler: any;

    constructor() {
        this.$container = document.getElementById("path") as HTMLElement;
        this.cy = cytoscape({
            container: this.$container,
            style: stylesheet,
            elements: INFO_NODES,
            layout: GLOBALS.breadthLayout,
        });  
        this.styler = new StyleController(this.cy);
    }

    private layoutGraph() {
        // TODO Dagre ??
        this.cy.layout(GLOBALS.breadthLayout).run();
        // TODO styling
    }

    public setElements(
        pathElements: cytoscape.Collection
    ) {
        this.cy.remove(this.cy.elements());
        this.cy.add(pathElements);
        this.layoutGraph();

        // Style only shows up after hovering over final node
        this.styler.setConnectedColor(pathElements[0], pathElements);
        this.styler.styleEdgesAndNodes(true, pathElements, ["direct", "edge-direct"], true);
    }

    public getCore(){
        return this.cy;
    }

}