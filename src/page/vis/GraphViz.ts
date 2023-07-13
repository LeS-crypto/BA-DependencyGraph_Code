import cytoscape, { LayoutOptions, NodeDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import spread from "cytoscape-spread";
import { ElementDefinition } from "cytoscape";
import {style} from "../design/graphStyle";
import * as layoutOptions from "../design/graphLayout";
import { GraphEventController, MenuEventController } from "../ui/EventController";
import { MenuController } from "../ui/MenuController";
import { eventBus } from "../../global/EventBus";
import EIMI from "../data/eimi.json";
import { COURSES, EDUCATORS } from "../data/courseData";

//Init extensions
cytoscape.use(fcose);
cytoscape.use(spread); //weaver.js

/* Displays the Graph and bundles all graph functions */
export class GraphViz {
    private readonly cy: any;
    private readonly $container: HTMLElement;
    private layoutOps : LayoutOptions = layoutOptions.fcose;
    private visibleDegree: number = 5; // ?? -> better solution?
    private visibleDegreeCourse: number = 2;
    private readonly degreeFilter = "[[degree <"+ this.visibleDegree + "]]";
    private oldZoom: any;
    private willEnter: Boolean = true;
    private willExpand: Boolean = true;

    constructor(
        graphModel: ElementDefinition[],
        $container: HTMLElement,
    ) {
        this.$container = $container;
        this.cy = cytoscape({
            container: this.$container,
            elements: graphModel,
            style: style,
            layout: layoutOptions.noLayout,
            zoom: 1, //TODO: adjust zoom level, make smoother
        });
        this.cy.ready(this.layoutGraph());

        this.initGraphEvents();
        this.initMenuEvents();
    }

    private initGraphEvents() {
        new GraphEventController(this.cy);
        //eventBus.on("changeZoomLevel", this.adjustGraph);
        eventBus.on("dblclick", this.onDblClick);
        eventBus.on("mouseover", this.hightlightNodeOnHover);
        eventBus.on("mouseout", this.noHightlightNodeOnHover);
        eventBus.on("keyDown", this.onKeyEvent);
    }

    private initMenuEvents() {
        const menuController = new MenuController();
        new MenuEventController();
        eventBus.on("onMenuClick", () => {
            menuController.openSideBar(this.cy);
        });
        // TODO:
        /*eventBus.on("onMouseOver", e => {
            console.log(e.closest(".hotlist-items"));
            menuController.onMouseOver(e);
        }); */
    }

    // Bundles all dblClick actions
    // TODO: enter diff course from inside course -> currently only binary
    private onDblClick = (target:any) => {
        // evtl.: https://github.com/daniel-dx/cytoscape-all-paths 
        // evtl.: https://stackoverflow.com/questions/73038701/search-predecessors-only-upto-a-certain-node-in-cytoscape-js
        
        const isResource = target.data("url");
        console.log(isResource);
        // if dbl-click on course node: "enter" course
        if(isResource) { 
            //open resource link
            window.open(target.data("url"), "_blank")?.focus();
        } else if(target.hasClass("course") && this.willEnter) {
            console.log("enter course ", target.id());
            this.enterCourse(target);
        } else if(target.hasClass("course") && !this.willEnter) {
            console.log("leave course");
            this.leaveCourse()
        } else { // if clicking normal node
            console.log("entering and connecting");
            const course = this.cy.$id(target.data("course"));
            //this.enterCourse(course); // neccessary?
            this.showConnected(target);
        }

    }

    // NOTE: nodes have the same class as the course has as an ID
    // TODO: EIMI doesn't work properly -> edges get lost
    // TODO: layout course + hiden nodes, when enter 
        // -> hidden nodes are not layouted well, make graph unreadable -> therfore layout conencted
    private enterCourse(target:any) {
        if(!this.willEnter) this.leaveCourse();
        const courseNodes = this.cy.$("[course =" + "'" + target.id() + "'" + "]");
        // Hide all other courses ? -> for now -> later make accessible by other means        
        this.cy.elements().not(courseNodes).addClass("hide");
        target.removeClass("hide");
        
        // ?? all other courses now hidden, why?

        // layout the graph
        courseNodes.layout(layoutOptions.fcoseInside).run();

        //courseNodes.layout(layoutOptions.spread).run(); //.-> hilft nicht

        //const circle = courseNodes.filter("[[degree >"+ this.visibleDegree + "]]");
        //courseNodes.layout(layoutOptions.concentric).run();
        //courseNodes.not(circle).layout(layoutOptions.fcose).run();

        
        //hides course-nodes here, for some reason
        courseNodes.nodes().removeClass("ghost");
        courseNodes.edges().removeClass("hide-edges");
        courseNodes.filter("node[url]").addClass("resource-hide"); // hide all Resources -> specific class
        const ghost = courseNodes.filter(this.degreeFilter);
        ghost.nodes().addClass("ghost-internal");
        ghost.connectedEdges().addClass("hide-edges");

        this.willEnter = false;
    }

    // Reload the graph was it was before -> Course-View
    private leaveCourse(){
        // Reload graph as it was before
        this.cy.elements().removeClass("hide"); // show rest of courses
        styleEdgesAndNodes(false, this.cy.elements(), ["ghost-internal", "hide-edges"]);
        layoutCourses(this.cy, this.cy.$(".course"));
        this.willEnter = true;
        // FIX: Educator disapears
    }

    
    // if dblclick on node, expand all connected edges for this node
    // NOTE: either doesn't change to layout or only with expand/collapse
    private showConnected(target:any) {
        const connected = this.getConnected(target);

        // hide all unconnected nodes (expept those with high degree) -> for backtracking
        const hide = this.cy.elements().not(connected)
            .filter("[[degree <"+ this.visibleDegree + "]]");
        //styleEdgesAndNodes(true, connected, ["ghost", "hide-edges"]);
        hide.nodes().addClass("ghost-internal");
        hide.connectedEdges().addClass("hide-edges"); // only works with connectedEdges()
        
        // show all connected nodes
        styleEdgesAndNodes(false, connected, ["ghost-internal", "hide-edges"]);
        // ADD: highlight as on hover (nearest neighbors), but without color

        //this.cy.fit(connected, 50);
        //connected.layout(layoutOptions.fcose).run();
    }

    // TODO: only get all connected, if the collection isn't too big
    private getConnected (target:any) {
        target = target.union(target.predecessors());
        target = target.union(target.successors());
        return target;
    }


    // RIGHT DIRECTION ?
    private hightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, true);
    }

    private noHightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, false);
    }

    /**
     * A Event-Function that bundles the Keyboard-Events
     * @param key gives the pressed key
     * @param cy the cytoscape element (as kbd-events only work on the document)
     */
    private onKeyEvent (key:String, cy:cytoscape.Core) {
        console.log(key);
        switch(key) {
            case "Enter":
                if(cy.filter(":selected")) {
                    console.log("Enter/Expand selected Node");
                } else console.log("Nothing selected");
                break;
            case "Backspace":
                console.log("Leave/Collapse selected node");
                break;
            case "+":
                console.log("Zoom in");
                break;
            case "-":
                console.log("Zoom out");
                break;
            default:
                console.log("Opps, something went wrong.");
        }
    }

    /* ---- GRAPH - FUNCTIONS ---- */

    private layoutGraph = () => {
        console.log("load the graph and start the layout");
        addAndLayoutCoursesAndEducators(this.cy);
        
        // https://js.cytoscape.org/#collection/layout -> eles.layout(options).run() for layout only on nodes   
        // use [[metadata]] to determine centrality // oder ele.pageRank()

        // STYLE EDUCATOR
        const educator = this.cy.nodes(".educator")
        educator.removeClass("ghost");
        educator.connectedEdges().removeClass("hide-edges");
        educator.addClass(".educator");
        // cy: eles.pageRank(): https://js.cytoscape.org/#eles.pageRank        
    }

}

// -- UTILITY FUNCTIONS --

// Put inside of GraphViz class ?

/**
 * A function that bundles a simple styling action for both nodes and edges
 * @param add If true: add a style | if false: remove a style
 * @param collection the collection of nodes and edges to perform the styling on 
 * @param style A string array of the node style and the edge style
 */
function styleEdgesAndNodes(
    add:Boolean, 
    collection: cytoscape.Collection, 
    style:string[]
) {
    if(add){
        collection.nodes().addClass(style[0]);
        collection.edges().addClass(style[1]);
    } else {
        collection.nodes().removeClass(style[0]);
        collection.edges().removeClass(style[1]);
    }
} 

function toggleHoverStyle (target:any, show:boolean) {
    // batch style-operations?
    const outNodes = target.outgoers();
    const inNodes = target.incomers();
    target.toggleClass("hover", show);
    styleEdgesAndNodes(show, outNodes, ["node-incoming", "edge-incoming"]);
    styleEdgesAndNodes(show, inNodes, ["node-outgoing", "edge-outgoing"]);
    /*outNodes.nodes().toggleClass("node-incoming", show);
    outNodes.edges().toggleClass("edge-incoming", show);
    inNodes.nodes().toggleClass("node-outgoing", show);
    inNodes.edges().toggleClass("edge-outgoing", show);*/
}

// Add additional Courses and their educators as nodes to the graph
// TODO: handel adding the nodes of a course (i.e EIMI) before initialisation
/* NOTE: currently additional courses (i.e EIMI get added here, 
    as there is no way to differentiate the data between courses.
    Would need an additional filed in the node-definition */
function addAndLayoutCoursesAndEducators(cy:cytoscape.Core) {
    // Add the course nodes
    const courses = cy.add(COURSES);
    
    connectCourse(cy, cy.elements(), "cgbv");
    cy.elements().data("course", "cgbv"); // add data field for access (magical "number"!)
    
    // Eimi -> knoten sind nicht mit kurs verbinden -> manchmal keine Sinks
    // TODO: Hier: die maxDegrees mit Kurs verbinden + Knoten ohne verbindungen
    const eimiData = cy.add(EIMI as ElementDefinition[]);
    eimiData.move({parent: null}); //move Eimi out of parents
    connectCourse(cy, eimiData, "eimi");
    eimiData.data("course", "eimi");

    cy.add(EDUCATORS);

    layoutCourses(cy, courses);
}

/**
 * A Function that lays out all the courses in a main graph
 * -> It abstracts the graph, so only the immeadiate neighbours are displayed
 * @param cy The cytoscape core object
 * @param courses The collection that contains all displayable courses
 */
function layoutCourses(cy:cytoscape.Core, courses:cytoscape.Collection) {
    //courses.layout(layoutOptions.grid).run();
    // TODO: show educators
    //cy.elements().layout(layoutOptions.fcose).run();
    // Hide all nodes completelty (except nearest neighbors) until course node is entered
    const displayed = cy.$(".course").neighborhood("[[degree >"+ 2 + "]]"); // IDEA?
    cy.elements().not(displayed).addClass("ghost");
    cy.elements().not(displayed).connectedEdges().addClass("hide-edges");

    styleEdgesAndNodes(false, courses, ["ghost", "hide-edges"]); //Temporary for empty course nodes

    cy.elements().layout(layoutOptions.fcose).run();
}


/**
 * A function that connects all Sources/Origins of a Course to the Course-Node (additionally)
 * NOTE: a source is a node that has no outgoing edges (only incomming) -> good starting point
 * @param cy The cytoscape core object
 * @param eles A collection of all elements to be connected
 * @param courseId The course to which they should connect
 */
// TODO: Hier: die maxDegrees mit Kurs verbinden + Knoten ohne Verbindungen
function connectCourse(
    cy:cytoscape.Core, 
    eles:cytoscape.Collection,
    courseId:String,
) {
    const maxD = eles.nodes().maxDegree(false);
    eles.nodes().forEach(ele => {
        if(ele.outdegree(false) == 0) { // If node is source/origin
            // connect to course-node
            cy.add(newCourseEdge(ele.id(), courseId));
        } else if(ele.outdegree(false) == 0 && ele.indegree(false) == 0) { 
            cy.add(newCourseEdge(ele.id(), courseId));
        } else if(ele.degree(false) == maxD ) {
            cy.add(newCourseEdge(ele.id(), courseId));
        }
    });
}

/**
 * Make a new edge pointing from a source to a target (course)
 * @param eleSource specify the origin 
 * @param eleTarget specify the target, i.e the course-node
 * @returns a new edge-element
 */
function newCourseEdge(eleSource:String, eleTarget:String) {
    return [ { group: "edges",
    data: {
        id: `${eleSource}-${eleTarget}`,
        source: eleSource,
        target: eleTarget,
        }
    }] as ElementDefinition[];
}