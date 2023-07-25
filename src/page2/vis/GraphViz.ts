import cytoscape, { ElementDefinition, EventObject } from "cytoscape";
import fcose from "cytoscape-fcose";
import { GLOBALS } from "../../global/config";
import { stylesheet } from "../design/stylesheet";
import { LayoutController } from "../utils/LayoutController";
import { eventBus } from "../../global/EventBus";
import { GraphEvents } from "../events/GraphEventController";
import { StyleController } from "../utils/StyleController";
import { PathViz } from "./PathViz";
import { MenuEventController } from "../events/MenuEventController";

// INIT EXTENSIONS
cytoscape.use(fcose);

/* Displays the Main Graph */
export class MainGraph {

    private readonly cy: cytoscape.Core;
    private readonly $container: HTMLElement;
    private layouter: any;
    private styler: any;
    private pathViz: any
    // private menuer: any;

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
        new MenuEventController(this.cy);
        // this.menuer.populateSideBar();
        
        this.initGraphEvents();
    }

    // Initial layout-function
    private layoutGraph = () => {
        console.log("load the graph and start the layout");

        this.layouter = new LayoutController(this.cy);
        this.layouter.layoutFullGraph();
    }

    private initGraphEvents() {
        new GraphEvents(this.cy, this.pathViz.getCore());
        eventBus.on("click", this.onClick);
        eventBus.on("sidebarSelect", this.onClick);
        eventBus.on("mouseover", this.hightlightNodeOnHover);
        eventBus.on("mouseout", this.noHightlightNodeOnHover);
        eventBus.on("dblclick", this.onDblClick);
    }

    /* ---- GRAPH FUNCTIONS ---- */
    private enterCourse(target:any) {
        let courseNodes = this.cy.$("[course =" + "'" + target.id() + "'" + "]");
        courseNodes = courseNodes.union(target);

        // this.layouter.layoutCourse(courseNodes);
        this.layouter.layoutRedString(courseNodes);

        this.willEnter = false;
    }

    private leaveCourse() {
        this.layouter.relayoutFullGraph();
        this.willEnter = true;
    }

    /* ---- UTIL FUNCTIONS ---- */

    // Show the connected Elements
    private showConnected(target: cytoscape.NodeSingular) {
        console.log("show Connected-Nodes for:", target.data("label"));
        target = this.cy.$id(target.id());
        this.styler = new StyleController(this.cy);
        let connected: cytoscape.Collection;
        if(this.willEnter){
            connected = target.neighborhood();
        } else {
            connected = this.getConnected(target);
        }
        this.styler.styleConnected(target, connected);
    }

    private showPath(target: cytoscape.NodeSingular) {
        console.log("show learning path for:", target.data("label"));
        let learners = target.successors()
            .not(".course")
            .not("edge[target=" + "'" + target.data("course") + "'" + "]")
            .not("edge[source=" + "'" + target.data("course") + "'" + "]");
        console.log(learners);
        learners = learners.union(target);
        this.styler.styleConnected(target, learners);
        this.pathViz.setElements(learners);
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
        // this.menuer = new MenuEventController(this.cy);
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
        resDiv.innerHTML = "";
        res.forEach(r => {
            let div = document.createElement("div");
            div.setAttribute("class", "resource-items");

            let icon = document.createElement("div");
            icon.setAttribute("class", "resource-icon");
            icon.addEventListener("click", () => eventBus.emit("menuClick", r));

            let name = document.createElement("div");
            name.setAttribute("class", "resource-name");
            name.innerHTML = r.data("label");

            div.appendChild(icon)
            div.appendChild(name);

            resDiv.appendChild(div);
        });

    }

    /* ---- EVENT FUNCTIONS ---- */
    // NOTE: verbesserung -> if course entered -> click different course -> enter this course
    // also usefull for sidebar
    private onClick = (target:any) => {
        console.log("click", target.data("label"));
        
        this.displayInfo(target);

        if(target.hasClass("course") && this.willEnter) {
            console.log("enter course ", target.id());
            toggleHoverStyle(target, false); // unhover all elements on enter
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
    target.toggleClass("hover", show);
    if(!target.hasClass("ghost")){
        const outNodes = target.outgoers();
        const inNodes = target.incomers();
        styleEdgesAndNodes(show, outNodes, ["node-incoming", "edge-incoming"]);
        styleEdgesAndNodes(show, inNodes, ["node-outgoing", "edge-outgoing"]);
    }
    // Only style connected edges, if the node isn't ghosted
    // styleEdgesAndNodes(show, outNodes, ["node-incoming", "edge-incoming"]);
    // styleEdgesAndNodes(show, inNodes, ["node-outgoing", "edge-outgoing"]);
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