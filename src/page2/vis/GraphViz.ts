import cytoscape, { ElementDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import { GLOBALS } from "../../global/config";
import { stylesheet } from "../design/stylesheet";
import { LayoutController } from "../utils/LayoutController";
import { eventBus } from "../../global/EventBus";
import { GraphEvents } from "../events/GraphEventController";
import { StyleController } from "../utils/StyleController";
import { PathViz } from "./PathViz";

// INIT EXTENSIONS
cytoscape.use(fcose);

/* Displays the Main Graph */
export class MainGraph {

    private readonly cy: cytoscape.Core;
    private readonly $container: HTMLElement;
    private layouter: any;
    private styler: any;
    private pathViz: any

    private willEnter: Boolean = true;

    constructor(
        graphElements: cytoscape.ElementDefinition[],
        $container: HTMLElement,
    ) {
        // init graph with cy
        this.$container = $container;
        this.cy = cytoscape({
            container: this.$container,
            elements: graphElements,
            style: stylesheet,
            layout: GLOBALS.noLayout,
            zoom: 1,
        });
        this.cy.ready(this.layoutGraph);
        this.pathViz = new PathViz();
        
        this.initGraphEvents();
    }

    // Initial layout-function
    private layoutGraph = () => {
        console.log("load the graph and start the layout");

        this.layouter = new LayoutController(this.cy);
        this.layouter.layoutFullGraph();
    }

    private initGraphEvents() {
        new GraphEvents(this.cy);
        eventBus.on("click", this.onClick);
        eventBus.on("mouseover", this.hightlightNodeOnHover);
        eventBus.on("mouseout", this.noHightlightNodeOnHover);
        eventBus.on("dblclick", this.onDblClick);
    }

    /* ---- GRAPH FUNCTIONS ---- */
    private enterCourse(target:any) {
        const courseNodes = this.cy.$("[course =" + "'" + target.id() + "'" + "]");
        this.layouter.layoutCourse(courseNodes);
        this.willEnter = false;
    }

    private leaveCourse() {
        this.layouter.relayoutFullGraph();
        this.willEnter = true;
    }

    /* ---- UTIL FUNCTIONS ---- */

    private showConnected(target: cytoscape.NodeSingular) {
        console.log("show Connected-Nodes for:", target.data("label"));
        this.styler = new StyleController(this.cy);
        const connected = this.getConnected(target);
        this.styler.styleConnected(target, connected);
    }

    private showPath(target: cytoscape.NodeSingular) {
        console.log("show learning path for:", target.data("label"));
        let learners = target.successors()
            .not(".course")
            .not("edge[target=" + "'" + target.data("course") + "'" + "]");
        console.log(learners);
        learners = learners.union(target);
        let eles : ElementDefinition[];
        eles = learners.data();

        this.pathViz.setElements(learners);

        // GEHT prinzipell 
        // TODO: layout soll nicht null sein -> 
        // const path = document.getElementById("path");
        // const cyPath = cytoscape({
        //     container: path,
        //     elements: eles,
        //     layout: GLOBALS.gridLayout,
        // });
        // cyPath.add(learners);
        // console.log(cyPath);
    }


    /**
     * Gets all connected nodes
     * @param target The node for which to get connected
     * @returns A collection of nodes
     */
    private getConnected (target:any) {
        const course = target.data("course")
        target = target.union(target.predecessors(course));
        target = target.union(target.successors(course));
        // console.log("target", target);
        return target;
    }

    private displayInfo(target:any) {
        const nodeDiv = document.getElementById("node-name") as HTMLElement; 
        const courseDiv = document.getElementById("course-name") as HTMLElement;
        const resDiv = document.getElementById("resource-container") as HTMLElement;

        // Node-name
        const name : string = target.data("label");
        name ? nodeDiv!.innerText = target.data("label") : null;

        // Course-name
        const course : string = target.data("course");
        const courseName = this.cy.$id(course).data("label");
        const courseStr : string = `in Kurs: ${courseName}`;
        courseName ? courseDiv!.innerText = courseStr : "ohne Kurs";
    
        // Resource-names
        const res = target.neighborhood("node[url]") as cytoscape.Collection;
        resDiv.innerHTML = "Resourcen";
        res.forEach(r => {
            let div = document.createElement("div");
            div.setAttribute("class", "resource-items");
            div.innerText = r.data("label");
            resDiv.appendChild(div);
        });

    }

    /* ---- EVENT FUNCTIONS ---- */
    private onClick = (target:any) => {
        console.log("click", target.data("label"));
        // Display name of clicked node
        this.displayInfo(target);

        if(target.hasClass("course") && this.willEnter) {
            console.log("enter course ", target.id());
            this.enterCourse(target);
        } else if(target.hasClass("course") && !this.willEnter) {
            console.log("leave course");
            this.leaveCourse()
        } else {
            this.showConnected(target);
            this.showPath(target);  
        }
    }

    private hightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, true);
        //this.styleController.toggleHoverStyle(target, true);
    }

    private noHightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, false);
        // this.styleController.toggleHoverStyle(target, false);
    }

    // ??
    private onDblClick = (target:any) => {
        if(target.hasClass("course") && this.willEnter) {
            console.log("enter course ", target.id());
            this.enterCourse(target);
        } else if(target.hasClass("course") && !this.willEnter) {
            console.log("leave course");
            this.leaveCourse()
        }

    }
}

// Auslagern
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

function styleEdgesAndNodes(
    add:Boolean, 
    collection: cytoscape.Collection, 
    style:string[]
) {
    if(add){
        collection.nodes().addClass(style[0]);
        //collection.edges().addClass(style[1]);
    } else {
        collection.nodes().removeClass(style[0]);
        //collection.edges().removeClass(style[1]);
    }
}