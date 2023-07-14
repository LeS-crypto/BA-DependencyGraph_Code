import cytoscape, { ElementDefinition } from "cytoscape";
import layoutUtilities from "cytoscape-layout-utilities";
import viewUtilities from "cytoscape-view-utilities";
import * as layoutOptions from "../design/graphLayout";

import EIMI from "../data/eimi.json";
import { COURSES, EDUCATORS } from "../data/courseData";
import { StyleController } from "./StyleController";

export class LayoutController {

    private cy : any;
    private api: any;
    private api2: any;
    private styleController: any;
    private readonly degreeFilter = "[[degree <"+ 5 + "]]"; // make global
    private layout: any;

    constructor(cy:cytoscape.Core){
        this.cy = cy;
        this.initExtensions(); //Separate ??
        this.api = this.cy.layoutUtilities(); //options
        this.api2 = this.cy.viewUtilities();
        this.styleController = new StyleController(this.cy);
        //init layoutUtilities
        //init StyleController
    }

    private initExtensions(){
        cytoscape.use(layoutUtilities);
        cytoscape.use(viewUtilities);
    }

    private initLayout() {
        this.layout = this.cy.makeLayout(layoutOptions.fcose);
    }

    public getLayout() {
        return this.layout;
    }

    /* ---- Layout Graph ---- */
    public layoutFullGraph() {
        this.addCourses();

        this.initLayout();
        this.layout.run();

        //this.cy.elements().layout(layoutOptions.fcose).run();

        const notDisplayed = this.cy.elements().not(
            this.cy.$(".course").neighborhood("[[degree >"+ 2 + "]]")
        );
        // TODO: union the connectedEdges() into a new variable for ghost()

        //this.styleController.ghost(true, notDisplayed); // hides all edges
        //this.api.placeHiddenNodes(notDisplayed);
        
        notDisplayed.nodes().addClass("ghost");
        notDisplayed.connectedEdges().addClass("ghost-edges");

        //TEMPORARY: for empty course nodes;
        this.cy.elements(".course").removeClass("ghost"); 

        //this.api2.hide(notDisplayed);

        //this.api.placeHiddenNodes(notDisplayed); // assumes pre-calculated layout 

    }

    public layoutCourse(courseNodes:cytoscape.Collection) {
        // BUG: doesn't display empty courses;

        const course = courseNodes.filter(".course");

        // set constraint
        this.setCourseLayoutConstraint(course.id());
        this.cy.layout(layoutOptions.fcoseCourse).run();

        // hide the rest of the nodes -> ? temporarily remove ?
        this.cy.elements().not(courseNodes).addClass("hide");
        this.cy.elements(".course").removeClass("hide");
        // do I need a second layouting ?

        //this.cy.layout(layoutOptions.fcose).run();

        // Restyle the graph, so that the true structure is shown
        this.styleController.ghost(false, courseNodes);

        courseNodes.filter("node[url]").addClass("resource-hide"); // hide all Resources -> specific class
        const ghost = courseNodes.filter(this.degreeFilter);
        
        ghost.nodes().addClass("ghost-internal");
        ghost.connectedEdges().addClass("ghost-edges");

        //this.styleController.ghost(true, ghost); // doesn't work, bc. of connectedEdges();
    }

    /* ---- Utility Functions --- */

    private setCourseLayoutConstraint(id: string) {
        const midX = this.cy.width() / 2;
        const midY = this.cy.height() / 2;
        layoutOptions.setCourseNode(id, midX, midY);
    }

    public addCourses() {
        const courses = this.cy.add(COURSES);
    
        this.connectCourse(this.cy, this.cy.elements(), "cgbv");
        this.cy.elements().data("course", "cgbv"); // add data field for access (magical "number"!)
        
        // Eimi -> knoten sind nicht mit kurs verbinden -> manchmal keine Sinks
        // TODO: Hier: die maxDegrees mit Kurs verbinden + Knoten ohne verbindungen
        const eimiData = this.cy.add(EIMI as ElementDefinition[]);
        eimiData.move({parent: null}); //move Eimi out of parents
        this.connectCourse(this.cy, eimiData, "eimi");
        eimiData.data("course", "eimi");

        this.cy.add(EDUCATORS);

    }

    /**
     * A function that connects all Sources/Origins of a Course to the Course-Node (additionally)
     * NOTE: a source is a node that has no outgoing edges (only incomming) -> good starting point
     * @param cy The cytoscape core object
     * @param eles A collection of all elements to be connected
     * @param courseId The course to which they should connect
     */
    // TODO: Hier: die maxDegrees mit Kurs verbinden + Knoten ohne Verbindungen
    private connectCourse(
        cy:cytoscape.Core, 
        eles:cytoscape.Collection,
        courseId:String,
    ) {
        const maxD = eles.nodes().maxDegree(false);
        eles.nodes().forEach(ele => {
            if(ele.outdegree(false) == 0) { // If node is source/origin
                // connect to course-node
                cy.add(this.newCourseEdge(ele.id(), courseId));
            } else if(ele.outdegree(false) == 0 && ele.indegree(false) == 0) { 
                cy.add(this.newCourseEdge(ele.id(), courseId));
            } else if(ele.degree(false) == maxD ) {
                cy.add(this.newCourseEdge(ele.id(), courseId));
            }
        });
    }

    /**
     * Make a new edge pointing from a source to a target (course)
     * @param eleSource specify the origin 
     * @param eleTarget specify the target, i.e the course-node
     * @returns a new edge-element
     */
    private newCourseEdge(eleSource:String, eleTarget:String) {
        return [ { group: "edges",
        data: {
            id: `${eleSource}-${eleTarget}`,
            source: eleSource,
            target: eleTarget,
            }
        }] as ElementDefinition[];
    }

}