import cytoscape, { ElementDefinition } from "cytoscape";
import layoutUtilities from "cytoscape-layout-utilities";
import viewUtilities from "cytoscape-view-utilities";
import expandCollapse from "cytoscape-expand-collapse";
import * as layoutOptions from "../design/graphLayout";
import { GLOBALS } from "../../global/config";

import EIMI from "../data/eimi.json";
import { COURSES, EDUCATORS } from "../data/courseData";
import { StyleController } from "./StyleController-old";
import { Styler } from "./StyleController";

export class LayoutController {

    private cy : any;
    private api: any;
    private api2: any;
    private exCol: any;
    private styleController: any; //OLD
    private styler : any
    private readonly degreeFilter = "[[degree <"+ 5 + "]]"; // make global

    constructor(cy:cytoscape.Core){
        this.cy = cy;
        this.initExtensions(); //Separate ??
        this.api = this.cy.layoutUtilities(); //options
        this.api2 = this.cy.viewUtilities();
        this.exCol = this.cy.expandCollapse({
            layoutBy: GLOBALS.graphLayout,
            fisheye: true,
            undoable: false,
        });
        this.styleController = new StyleController(this.cy);
        this.styler = new Styler(this.cy);
        //init layoutUtilities
        //init StyleController
    }

    private initExtensions(){
        cytoscape.use(layoutUtilities);
        cytoscape.use(viewUtilities);
        expandCollapse(cytoscape);
    }

    /* ---- Layout Graph ---- */
    private layoutGraph() {
        // STYLE the graph first
        const notDisplayed = this.cy.elements().not(
            this.cy.$(".course").neighborhood("[[degree >"+ 4 + "]]")
        );
        this.styler.ghostConnected(true, notDisplayed);
        this.styler.hide(this.cy.$("node[url]")); // Hide all resources in the graph

        // LAYOUT the graph 
        this.cy.layout(GLOBALS.graphLayout).run();
            // NOTE: Layout uses styles as conditions

        //this.cy.elements("[course ='cgbv']").not(notDisplayed).layout(GLOBALS.graphLayout).run();
        //this.cy.elements("[course ='eimi']").not(notDisplayed).layout(GLOBALS.graphLayout).run();
        // Layout visible and ghosted Nodes separately
        //this.cy.elements().not(notDisplayed).layout(layoutOptions.concentric).run();
        // notDisplayed.layout(layoutOptions.grid).run();

        

        //TEMPORARY: for empty course nodes;
        //this.cy.elements(".course").removeClass("ghost"); 

        //this.api.placeHiddenNodes(notDisplayed); // assumes pre-calculated layout -> don't now if works
    }

    public layoutFullGraph() {
        // test
        this.cy.add({
            group: "nodes", data: {id: "conPa"}
        })
        this.addCourses();
        this.layoutGraph(); 

    }

    public relayoutFullGraph() {
        const eles = this.cy.elements();
        this.styler.ghost(false, eles, true); // remove ghost style
        this.styler.show(this.cy.elements()); // show all hidden elements
        this.styler.styleEdgesAndNodes(
            false, this.cy.elements(), ["connect", "edge-connect"]
        ); // hide connected style
        this.layoutGraph();

    }

    public layoutCourse(courseNodes:cytoscape.Collection) {
        // BUG: doesn't display empty courses;

        //const course = courseNodes.filter(".course");

        //this.layoutClusters();
        this.styler.hide(this.cy.$("node[url]")); // Hide all resources in the graph

        // WORKS:
        this.cy.layout(GLOBALS.graphLayout).run();
        this.styler.styleCourse(courseNodes);
    }

    public layoutClusters() {
        const clusters = this.getClusters();
        clusters.forEach(cluster => {
            cluster.layout(GLOBALS.graphLayout).run();
        });
        this.cy.center(this.cy);
    }

    // NOT USED
    public leaveCourse(){
        this.styler.show(this.cy.elements());
        this.styler.ghost(false, this.cy.elements(), true);

        this.styler.styleEdgesAndNodes(false, this.cy.elements(), ["connect", "edge-connect"]);
        
        // BUG: relayout the Graph incrementally -> ??
        this.cy.layout(GLOBALS.graphLayout).stop();
        this.layoutFullGraph();
    }

    /* ---- Utility Functions --- */

    private setCourseLayoutConstraint(id: string) {
        const midX = this.cy.width() / 2;
        const midY = this.cy.height() / 2;
        layoutOptions.setCourseNode(id, midX, midY);
    }

    public addCourses() {
        this.cy.add(COURSES);
    
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

    private getClusters(
        eles : any = this.cy.elements()
    ) {
        return eles.markovClustering({
            attributes: [
                function(edge:cytoscape.EdgeSingular){
                    return edge.source().degree(false);
                }
            ]
        }) as cytoscape.Collection[];
    }

    private ciseLayout(){
        // TRY:
        // needs parents in graph Data
        const parents = this.cy.$(":parents");
        let clusters = [] as Array<any>;
        parents.forEach((parent: { descendants: () => any[]; }) => {
            let p = [] as Array<string>;
            parent.descendants().forEach(child => {
                    p.push(child.id());
            });
            clusters.push(p);
        });
        console.log(clusters);
        this.cy.layout({
            name: 'cise',
            clusters: clusters,
            nodeSeparation: 20,
        }).run();
    }

}