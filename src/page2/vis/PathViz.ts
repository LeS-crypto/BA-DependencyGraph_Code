import cytoscape from "cytoscape";
import { stylesheet } from "../design/stylesheet";
import { GLOBALS } from "../../global/config";
import { INFO_NODES } from "../../global/data/infoNodes";
import { StyleController } from "../utils/StyleController";

// Dagre ?? u/o taxi edges

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

    // private layoutGraph() {
    //     // TODO Dagre ??
    //     this.cy.layout(GLOBALS.breadthLayout).run();
    //     // TODO styling
    // }

    public setElements(
        pathElements: cytoscape.Collection,
    ) {
        // Style the elements
        this.styler.ghost(false, pathElements);
        pathElements.removeClass("hover");
        this.styler.setConnectedColor(pathElements[0], pathElements);
        this.styler.styleEdgesAndNodes(true, pathElements, ["direct", "edge-direct"], true);

        this.cy.remove(this.cy.elements());
        this.cy.add(pathElements);

        // this.cy.layout(GLOBALS.breadthLayout).run();
        this.cy.layout(GLOBALS.dagre).run();
        // this.layoutGraph();
    }

    public setPreview(eles:cytoscape.Collection) {

        this.styler.ghost(false, eles);
        eles.removeClass("hover");

        this.cy.remove(this.cy.elements());
        this.cy.add(eles);

        this.styler.hide(true, this.cy.$("node[url]")); // hide resources

        this.cy.fit(eles);

        // keep a SIMILAR layout as the graph
        this.cy.layout(GLOBALS.courseLayout).run();
    }

    public setRedString(eles: cytoscape.Collection) {
        console.log("r", eles.nodes().connectedEdges().classes(), eles.nodes().classes());
        console.log("r", eles);
        
        // const pathEdges = eles.nodes().connectedEdges(".path-edges");

        this.styler.ghost(false, eles);
        eles.removeClass("hover");

        this.cy.remove(this.cy.elements());
        this.cy.add(eles);
        // this.cy.add(pathEdges);

        this.cy.layout(GLOBALS.dagre).run();
    }

    // Anzeige für Sinks??

    public getCore(){
        return this.cy;
    }

}