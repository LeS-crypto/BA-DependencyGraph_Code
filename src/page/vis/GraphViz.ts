import cytoscape, { LayoutOptions, NodeDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import spread from "cytoscape-spread";
import layoutUtilities from "cytoscape-layout-utilities";
import { ElementDefinition } from "cytoscape";
import {style} from "../design/graphStyle";
import * as layoutOptions from "../design/graphLayout";
import { GraphEventController, MenuEventController } from "../util/EventController";
import { MenuController } from "../util/MenuController";
import { eventBus } from "../../global/EventBus";
import EIMI from "../data/eimi.json";
import { COURSES, EDUCATORS } from "../data/courseData";
import { StyleController } from "../util/StyleController";
import viewUtilities from "cytoscape-view-utilities";
import { LayoutController } from "../util/LayoutController";

//Init extensions
cytoscape.use(fcose);
cytoscape.use(spread); //weaver.js
cytoscape.use(layoutUtilities);
cytoscape.use(viewUtilities);

/* Displays the Graph and bundles all graph functions */
export class GraphViz {
    private readonly cy: any;
    private readonly $container: HTMLElement;
    private layoutOps : LayoutOptions = layoutOptions.fcose;
    private visibleDegreeCourse: number = 2;
    private visibleDegree: number = 5; // ?? -> better solution?
    private readonly degreeFilter = "[[degree <"+ this.visibleDegree + "]]";
    private oldZoom: any;
    private willEnter: Boolean = true;
    private willExpand: Boolean = true;
    private layoutInstance: any;
    private viewInstance: any;
    private styleController: any;
    private layoutController: any;

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
        //this.layoutController = new LayoutController(this.cy);
        this.cy.ready(this.layoutGraph());
        this.layoutInstance = this.cy.layoutUtilities(); //options */
        this.viewInstance = this.cy.viewUtilities({
            setVisibilityOnHide: false,
        })
        // this.styleController = new StyleController(this.cy);
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

    private layoutGraph = () => {
        console.log("load the graph and start the layout");
        this.layoutController = new LayoutController(this.cy);
        this.styleController = new StyleController(this.cy);
        //addAndLayoutCoursesAndEducators(this.cy);
        this.layoutController.layoutFullGraph();
        
        // https://js.cytoscape.org/#collection/layout -> eles.layout(options).run() for layout only on nodes   
        // use [[metadata]] to determine centrality // oder ele.pageRank()

        // STYLE EDUCATOR - TODO
        /*const educator = this.cy.nodes(".educator")
        educator.removeClass("ghost");
        educator.connectedEdges().removeClass("hide-edges");
        educator.addClass(".educator");*/
        // cy: eles.pageRank(): https://js.cytoscape.org/#eles.pageRank        
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
            console.log("connecting");
            this.showConnected(target);
        } // TODO: what if clicking normal node bevore entering ? 

    }

    // NOTE: nodes have the same class as the course has as an ID
    // TODO: EIMI doesn't work properly -> edges get lost
    // TODO: layout course + hiden nodes, when enter 
        // -> hidden nodes are not layouted well, make graph unreadable -> therfore layout conencted
    private enterCourse(target:any) {
        if(!this.willEnter) this.leaveCourse();

        const courseNodes = this.cy.$("[course =" + "'" + target.id() + "'" + "]");
        this.layoutController.layoutCourse(courseNodes);

        this.willEnter = false;
    }

    // TODO:
    // Reload the graph was it was before -> Course-View
    private leaveCourse(){
        // Reload graph as it was before -> ONLY STYLE
        this.cy.elements().removeClass("hide"); // show rest of courses
        styleEdgesAndNodes(false, this.cy.elements(), ["ghost-internal", "hide-edges"]);
        this.layoutController.layoutFullGraph();
        //layoutCourses(this.cy, this.cy.$(".course"));
        //this.layoutController.layoutFullGraph();
        this.willEnter = true;
        // FIX: Educator disapears
    }

    private showConnected(target:any) {
        const connected = this.getConnected(target);
        //this.layoutInstance.placeHiddenNodes(connected);

        const hide = this.cy.elements().not(connected)
            .filter("[[degree <"+ this.visibleDegree + "]]");
        //styleEdgesAndNodes(true, connected, ["ghost", "hide-edges"]);
        hide.nodes().addClass("ghost-internal");
        hide.connectedEdges().addClass("hide-edges"); // only works with connectedEdges()

        styleEdgesAndNodes(false, connected, ["ghost-internal", "hide-edges"]);

        connected.layout(layoutOptions.fcoseCourse).run();
        // Adjust zoom level
    }

    // ?? TODO: only get all connected, if the collection isn't too big
    private getConnected (target:any) {
        target = target.union(target.predecessors());
        target = target.union(target.successors());
        return target;
    }


    // RIGHT DIRECTION ?
    // Use styleController -> not defined for some reason
    private hightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, true);
        //this.styleController.toggleHoverStyle(target, true);
    }

    private noHightlightNodeOnHover (target:any) {
        toggleHoverStyle(target, false);
        // this.styleController.toggleHoverStyle(target, false);
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