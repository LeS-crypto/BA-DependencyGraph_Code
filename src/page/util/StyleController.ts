import cytoscape from "cytoscape";
import viewUtilities from "cytoscape-view-utilities";
import { style } from "../design/graphStyle";

// Class that bundels all graph stylings (using: view-utilities extension)
export class Styler {

    private cy : any;
    private api : any;

    constructor(cy: cytoscape.Core) {
        this.cy = cy;
        this.initViewUtilities();
    }

    private initViewUtilities() {
        viewUtilities(cytoscape);
        this.api = this.cy.viewUtilities(options);
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
    ) {
        const nodes = collection.nodes();
        const edges = collection.edges();
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

    public onHover(){

    }

    public show(eles:cytoscape.Collection){
        this.api.show(eles);
    }

    public hide(eles:cytoscape.Collection){
        this.api.hide(eles);
    }




}

export const options = {

}