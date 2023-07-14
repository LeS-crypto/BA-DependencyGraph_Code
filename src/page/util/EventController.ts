import { eventBus } from "../../global/EventBus";

// Classes for handeling Events/Interactions

// HANDLE MENU EVENTS
export class MenuEventController {
    
    /*private readonly $container : HTMLDivElement;
    private readonly $dropBtn : HTMLSelectElement;
    private readonly $searchBtn : HTMLButtonElement;
    private readonly $toggleBtn1 : HTMLInputElement;
    private readonly $toggleBtn2 : HTMLInputElement;*/
    private readonly $menuBtn : HTMLDivElement;
    private readonly $hotlist : HTMLElement;
    private readonly $app : HTMLElement;
    private readonly $cy : any;

    constructor(){
        //this.$cy = cy;
        /*this.$container = document.getElementById("toolbar") as HTMLDivElement;
        this.$dropBtn = document.getElementById("layout-options") as HTMLSelectElement;
        this.$searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
        this.$toggleBtn1 = document.getElementById("toggle1") as HTMLInputElement;
        this.$toggleBtn2 = document.getElementById("toggle2") as HTMLInputElement;*/
        this.$app = document.getElementById("app") as HTMLElement;
        this.$menuBtn = document.getElementById("menuBtn") as HTMLDivElement;
        this.$hotlist = document.getElementById("hotlist") as HTMLElement;
        this.$initListeners();
    }


    private $initListeners() {
        this.$menuBtn.addEventListener("click", this.onMenuClick);
        this.$hotlist.addEventListener("mouseover", this.onMouseOver);
        /*this.$dropBtn.selectedIndex = 0; // Change Dropdown back to default value
        this.$dropBtn.addEventListener("change", this.onLayoutChange);
        this.$searchBtn.addEventListener("click", this.onSearch);
        this.$toggleBtn1.addEventListener("click", this.onToggleBubbleSet);
        this.$toggleBtn2.addEventListener("click", this.onTogglePacking);*/
    };

    // ---- EVENTS ----

    private onMenuClick = (e:MouseEvent) => {
        eventBus.emit("onMenuClick");
    }

    private onMouseOver = (e:MouseEvent) => {
        eventBus.emit("onMouseOver");
    }

    // Event to change to layout depending on selecte option (dropdown-menu)
    private onLayoutChange = (e:any) => {
        var layoutVar = e.target.value;
        eventBus.emit("layoutChange", layoutVar);
    };

    private onToggleBubbleSet = (e:any) => {
        var toggleVar = e.target;
        eventBus.emit("toggleBubble", toggleVar);
    };

    private onTogglePacking = (e:any) => {
        var toggleVar = e.target;
        eventBus.emit("togglePacking", toggleVar);
    }

    private onSearch = (e:any) => {
        eventBus.emit("searchNode", e)
    };

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