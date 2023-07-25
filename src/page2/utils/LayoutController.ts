import cytoscape from "cytoscape";
import { DataManager } from "./DataManager";
import { GLOBALS } from "../../global/config";
import { StyleController } from "./StyleController";

export class LayoutController {

    private readonly cy: cytoscape.Core;
    private readonly dataManager: any;
    private readonly styler: any;
    private tempEdges: any = null;
    private tempConnect : any = null;

    constructor(
        cy: cytoscape.Core
    ) {
        this.cy = cy;
        this.dataManager = new DataManager(this.cy);
        this.styler = new StyleController(this.cy);
        // this.tempEdges = this.cy.elements().edges("edge[temp]");
        
    }

    /* ---- LAYOUT MAIN GRAPH ---- */

    // The main layout function
    private layoutGraph() {
        this.tempEdges = this.cy.elements().edges("edge[temp]");
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

        this.cy.remove(this.tempConnect); //remove temporary connection btw course and first red string elements
        this.cy.add(this.tempEdges);

        // Restyle graph to initial styling
        this.styler.ghost(false, eles, true);
        this.styler.hide(false, eles);
        this.styler.styleEdgesAndNodes(
            false, this.cy.elements(), ["connect", "edge-connect"]
        ); // hide connected style
        eles.edges().removeClass("path-edges"); // remove path style
        this.layoutGraph();
    }

    /* ---- LAYOUT COURSE --- */

    public layoutCourse(courseNodes: cytoscape.Collection) {
        this.styler.ghost(false, courseNodes); // unghost all elements
        this.styler.hide(true, this.cy.elements().not(courseNodes)); // hide other
        
        courseNodes.layout(GLOBALS.courseLayout).run();

        this.styler.styleCourse(courseNodes)
    }

    // Layout the course with a red String
        // -> a path through the course, that goes over the most important topics
    public layoutRedString(courseNodes: cytoscape.Collection){
        console.log("layout red string");
        this.styler.hide(true, this.cy.elements().not(courseNodes));
        
        // remove temporary edges, i.e. edges that connect nodes to the course
        this.cy.remove(this.tempEdges);

        const pathNodes = courseNodes.filter("node[important]");
        this.setCoursePath(courseNodes, pathNodes);

        // Layout the courses on the top of the core
        const course = this.cy.$id(courseNodes.data("course"));
        this.setCoursesAfterPath(course, pathNodes[0]);

        // Set a constraint to put the course above the first pathNode
        // let layoutoptions = GLOBALS.courseLayout;
        // layoutoptions.relativePlacementConstraint = [{
        //     top: course.id(), bottom: pathNodes[0].id(), gap: 100
        // }]

        courseNodes.layout(GLOBALS.courseLayout).run();
    }


    private setCoursePath(nodes: cytoscape.Collection, pathNodes: cytoscape.Collection) {
        // let paths = [];
        for (let i = 0; i < pathNodes.length - 1; i++) {
            let aStar = nodes.aStar({
                root: pathNodes[i],
                goal: pathNodes[i+1],
                directed: false,
            });
            // paths.push(aStar);
            if(aStar.path) {
                this.styler.ghost(false, aStar.path);
                aStar.path.edges().addClass("path-edges");
            }
        }
    }

    private setCoursesAfterPath(course: cytoscape.NodeSingular, start: cytoscape.NodeSingular){
        // const courses = this.cy.$(".course");
        // Connect the courses to the first node of the red string
        const edge = this.cy.add({ group: "edges",
            data: {
                id: `${start.id()}-${course.id()}`,
                source: start.id(),
                target: course.id(),
                temp: true,
                }
        });
        // connect courses between each other -> done in coursedata.ts
        // + connect this course to the first path node
        // course.position({x:200, y: 50});
        // courses.layout(GLOBALS.breadthLayout).run();
        this.tempConnect = edge;
    }

}