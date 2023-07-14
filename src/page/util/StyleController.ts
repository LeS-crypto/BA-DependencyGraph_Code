import cytoscape from "cytoscape";

export class StyleController {

    private readonly cy : any;

    constructor(cy:cytoscape.Core) {
        this.cy = cy;
    }

    public hide() {

    }

    public ghost(ghost:boolean, elements:cytoscape.Collection) {
        this.styleEdgesAndNodes(ghost, elements, ["ghost", "hide-edges"]); 
        //ghost-edges
    }

    public show() {

    }

    public toggleHoverStyle (target:any, show:boolean) {
        // batch style-operations?
        const outNodes = target.outgoers();
        const inNodes = target.incomers();
        target.toggleClass("hover", show);
        this.styleEdgesAndNodes(show, outNodes, ["node-incoming", "edge-incoming"]);
        this.styleEdgesAndNodes(show, inNodes, ["node-outgoing", "edge-outgoing"]);
        /*outNodes.nodes().toggleClass("node-incoming", show);
        outNodes.edges().toggleClass("edge-incoming", show);
        inNodes.nodes().toggleClass("node-outgoing", show);
        inNodes.edges().toggleClass("edge-outgoing", show);*/
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
        if(add) {
           collection.nodes().addClass(style[0]);
           collection.edges().addClass(style[1]);
        } else {
           collection.nodes().removeClass(style[0]);
           collection.edges().removeClass(style[1]);
        }
    } 

}