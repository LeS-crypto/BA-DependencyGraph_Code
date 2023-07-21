import cytoscape from "cytoscape";
import { DataManager } from "./DataManager";
import { GLOBALS } from "../../global/config";
import { StyleController } from "./StyleController";

export class LayoutController {

    private readonly cy: cytoscape.Core;
    private readonly dataManager: any;
    private readonly styler: any;

    constructor(
        cy: cytoscape.Core
    ) {
        this.cy = cy;
        this.dataManager = new DataManager(this.cy);
        this.styler = new StyleController(this.cy);
    }

    /* ---- LAYOUT MAIN GRAPH ---- */

    // The main layout function
    private layoutGraph() {
        this.cy.layout(GLOBALS.graphLayout).run();
        this.styler.styleGraph(this.cy.elements());
    }

    // Layout the full graph
    public layoutFullGraph() {
        this.dataManager.addCourses();
        this.layoutGraph();
    }

    public relayoutFullGraph() {
        const eles = this.cy.elements();
        this.styler.ghost(false, eles, true);
        this.styler.show(true, eles);
        // Hide connected style
        this.layoutGraph();
    }

    /* ---- LAYOUT COURSE --- */

    public layoutCourse(courseNodes: cytoscape.Collection) {
        this.styler.ghost(false, courseNodes); // unghost all elements
        this.styler.hide(true, this.cy.elements().not(courseNodes)); // hide other
        
        courseNodes.layout(GLOBALS.courseLayout).run();

        this.styler.styleCourse(courseNodes)
    }

}