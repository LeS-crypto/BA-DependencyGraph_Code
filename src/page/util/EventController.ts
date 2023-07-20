import { eventBus } from "../../global/EventBus";

// Classes for handeling Events/Interactions

// HANDLE MENU EVENTS
export class MenuEventController {
    
    private readonly $menuBtn : HTMLDivElement;
    private readonly $toggleNodes : HTMLElement;
    private readonly $sidebar : HTMLElement;
    // private readonly $closeBtn : HTMLDivElement;
    private readonly $hotlist : HTMLElement;
    private readonly hotlistItems: any;
    private readonly $app : HTMLElement;
    // private readonly $cy : any;

    constructor(){
        this.$app = document.getElementById("app") as HTMLElement;
        this.$menuBtn = document.getElementById("menuBtn") as HTMLDivElement;
        this.$toggleNodes = document.getElementById("toggleNodes") as HTMLElement;
        // this.$closeBtn = document.getElementById("closeBtn") as HTMLDivElement;
        //this.hotlistItems = document.getElementsByClassName("hotlist-items") as HTMLCollectionOf<Element>;
        this.$sidebar = document.getElementById("sidebar") as HTMLElement;
        this.$initListeners();
    }


    private $initListeners() {
        this.$menuBtn.addEventListener("click", this.onMenuClick);
        this.$toggleNodes.addEventListener("click", this.onMenuClick);
        //this.$hotlist.addEventListener("mouseover", this.onMouseOver);
        //this.$sidebar.addEventListener("mouse")
    };

    // ---- EVENTS ----

    private onMenuClick = (e:MouseEvent) => {
        console.log("click");
        eventBus.emit("onMenuClick", e);
    }

    private onHotlistClick = (e:MouseEvent) => {
        console.log("click hotlist");
    }

    private onMouseOver = (e:MouseEvent) => {
        eventBus.emit("onMouseOver");
    }


}


// HANDEL GRAPH EVENTS
export class GraphEventController {

    private readonly $cy : any;

    constructor(cy: any){
        this.$cy = cy;
        this.$initListeners();
    }

    private $initListeners() {
        //this.$cy.dblclick(); // Note: Extension Also triggers several regular click event
        this.$cy.on("click", "node", this.onSingleClick);

        // NEW:
        //this.$cy.on("scrollzoom", this.onScroll2);
        //document.getElementById("app")!.addEventListener("wheel", this.onScroll);
        this.initDoubleClick();
        this.$cy.on("dblclick", this.onDoubleClick);
        this.$cy.on("mouseover", "node", this.onMouseOver);
        this.$cy.on("mouseout", "node", this.onMouseOut);
        document.addEventListener("keyup", this.onKeyDown); //doesn't work on app
        // evtl. https://github.com/cytoscape/cytoscape.js/issues/1556
        
    }

    // ---- EVENTS ----

    private onScroll = (e:any) => {
        const zoomLevel = this.$cy.zoom();
        const mousePos = [e.clientX, e.clientY];
        console.log("mp", mousePos); //geht
        // rendered position doesn't work on scroll -> kein user input decive event, sondern graph event
        eventBus.emit("changeZoomLevel", zoomLevel, mousePos);
        // Concat another mouseover event or use dom api 
        // doc.getElbyid("app").addEventListener ()
    }

    private onScroll2 = (e:any) => {
        eventBus.emit("changeZoomLevel", e);
    }


    private onSingleClick = (e:any) => {
        //console.log(e.renderedPosition);
        eventBus.emit("click", e.target);
    }

    // via: [3rd Answer] https://stackoverflow.com/questions/18610621/cytoscape-js-check-for-double-click-on-nodes
    // Improvement? Check position
    private initDoubleClick() {
        var doubleClickDelayMs = 350;
        var previousTapStamp:any;
        this.$cy.on("mouseup", function(e:any) {
            var currentTapStamp = e.timeStamp;
            var msFromLastTap = currentTapStamp - previousTapStamp;
        
            if (msFromLastTap < doubleClickDelayMs) {
                e.target.trigger('doubleClick', e);
            }
            previousTapStamp = currentTapStamp;
        });
    }

    private onDoubleClick = (e:MouseEvent) => {
        eventBus.emit("dblclick", e.target);
    }

    private onMouseOver = (e:MouseEvent) => {
        eventBus.emit("mouseover", e.target);
    }

    private onMouseOut = (e:MouseEvent) => {
        eventBus.emit("mouseout", e.target);
    }

    private onKeyDown = (e:KeyboardEvent) => {
        eventBus.emit("keyDown", e.key, this.$cy);
    }

}