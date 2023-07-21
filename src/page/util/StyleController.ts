import cytoscape from "cytoscape";
import viewUtilities from "cytoscape-view-utilities";
import { connectColors, nodeColors } from "../../global/colorsCofig";
import { machine } from "os";
import { amount, setAmount } from "../design/graphStyle";

// Class that bundels all graph stylings (using: view-utilities extension)
export class Styler {

    private cy : any;
    private api : any;
    private visibleDegree: number = 5; // ?? -> better solution? + make global
    private readonly degreeFilter = "[[degree <"+ 5 + "]]"; // make global

    constructor(cy: cytoscape.Core) {
        this.cy = cy;
        this.initViewUtilities();
    }

    private initViewUtilities() {
        viewUtilities(cytoscape);
        this.api = this.cy.viewUtilities(options);;
    }

    /**
    * A function that bundles a simple styling action for both nodes and edges
    * @param add If true: add a style | if false: remove a style
    * @param collection the collection of nodes and edges to perform the styling on 
    * @param style A string array of the node style and the edge style
    */
    private styleEdgesAndNodes(
        add:Boolean, 
        collection: cytoscape.Collection, 
        style:string[],
        connected:Boolean=false,
    ) {
        // if(connected) edge = nodes.connectedEdges();
        const nodes = collection.nodes();
        let edges;
        connected ? edges = nodes.connectedEdges() : edges = collection.edges();
        if(add) {
            nodes.addClass(style[0]);
            edges.addClass(style[1]);
        } else {
            nodes.removeClass(style[0]);
            edges.removeClass(style[1]);
        }
    }

    /**
     * Applies to ghost style to nodes and their connected Edges
     * @param ghost if true: ghost | if false: unghost
     * @param eles the elements(nodes) to style
     */
    public ghostConnected(
        ghost: boolean, 
        eles:cytoscape.Collection, 
        internal:Boolean=false
    ){
        let nodeStyle;
        internal ? nodeStyle = "ghost-internal" : nodeStyle = "ghost";
        const nodes = eles.nodes();
        const edges = nodes.connectedEdges();
        if(ghost) {
            nodes.addClass(nodeStyle);
            edges.addClass("ghost-edges");
        } else {
            nodes.removeClass(nodeStyle);
            edges.removeClass("ghost-edge");
        }
        //this.styleEdgesAndNodes(ghost, eles, ["ghost", "ghost-edges"]);
    }

    /**
     * Applies to ghost style to nodes and edges in the collection
     * @param ghost if true: ghost | if false: unghost
     * @param eles the elements(nodes) to style
     */
    public ghost(
        ghost: boolean, 
        eles:cytoscape.Collection,
        internal:Boolean=false
    ){
        let nodeStyle;
        internal ? nodeStyle = "ghost-internal" : nodeStyle = "ghost";
        this.styleEdgesAndNodes(ghost, eles, [nodeStyle, "ghost-edges"]);
    }

    // Initial course style
    public styleCourse(courseNodes:cytoscape.Collection){
        //this.cy.elements().removeStyle(); // remove all applied styles ??
        this.hide(this.cy.elements().not(courseNodes));

        // Restyle the graph, so that the true structure is shown
        this.ghost(false, courseNodes);

        // courseNodes.filter("node[url]").addClass("resource-hide"); // hide all Resources -> specific class
        const ghost = courseNodes.filter(this.degreeFilter);
        this.ghostConnected(true, ghost, true);
    }

    public styleConnected(target:cytoscape.NodeSingular, eles:cytoscape.Collection) {
        // Reload original course style
        this.styleEdgesAndNodes(false, this.cy.elements(), ["connect", "edge-connect"]);
        this.cy.elements().removeClass("target-connect");

        // Ghost all unconnected Elements
        const ghostEles = this.cy.elements().not(eles)
            .filter("[[degree <"+ this.visibleDegree + "]]");
        this.ghostConnected(true, ghostEles, true);
        this.ghost(false, eles, true); // unghost all connected Elements
        //eles.filter("node[url]").addClass("resource");

        // Highlight the connected Elements + get maxDepth
        this.setConnectedColor2(target, eles);
        this.styleEdgesAndNodes(true, eles, ["connect", "edge-connect"]); // + connected edges
        target.addClass("target-connect");

        // Style the leftover Elements that are shown in the graph ??
        let rest = this.cy.elements().not(eles)
            .filter("[[degree >"+ 2 + "]]");


    }

    // Verbesserung für setConnected()
    private setConnectedColor2(target: cytoscape.NodeSingular, eles:cytoscape.Collection) {
        //target.data("weight", 0);
        // set maxDepth for mapper ??
        let maxDepth = 0;
        eles.bfs({
            roots: target,
            visit: function(v, e, u, i, depth) {
                if(e?.isEdge) {
                    e.data("weight", depth);
                }
                if(v.isNode()){
                    v.data("weight", depth);
                    v.connectedEdges().data("weight", depth); 
                    //console.log("v", v.data("weight"), v.data("label"));
                }
                if(depth > maxDepth) maxDepth = depth
            },
            directed: false,
        });
        eles.data("maxDepth", maxDepth); // probably needs custom mapper
        // setAmount(maxDepth);
    }

    // TODO
    public onHover(){

    }

    public show(eles:cytoscape.Collection){
        this.api.show(eles);
    }

    public hide(eles:cytoscape.Collection){
        this.api.hide(eles);
        eles.addClass("hide");
    }

}

// funktioniert nicht wirklich
export const options = {
    highlightStyles: [
        // Highlight connected Nodes and edges
        { node: {
            'background-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey2 + ',' + nodeColors.lightgrey2 + ')', //??
            'border-color': nodeColors.darkgrey2,
            'border-width': 3,
            'border-opacity': 1,
        },
        edge: {
            'line-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey + ',' + nodeColors.lightgrey2 + ')',
            'source-arrow-color': 'mapData(weight, 0, 100,' + nodeColors.darkgrey + ',' + nodeColors.lightgrey2 + ')',
        }}
    ]

}