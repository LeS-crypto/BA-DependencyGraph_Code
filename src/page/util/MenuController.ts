import cytoscape from "cytoscape";
import { eventBus } from "../../global/EventBus";
import { MenuEventController } from "./EventController";
import {style} from "../design/graphStyle";
import { labelStylesheet } from "../design/labelStyle";

export class MenuController {

    private readonly cy : any;
    //private readonly container : HTMLElement;
    private openMenu : boolean = true;

    constructor(
        cy : any,
        //container : HTMLElement,*/
    ) {
        this.cy = cy;
        this.populateSidebar(this.cy);
        //this.cy = cy;
        // this.container = container; */
        this.initMenuEvents();
    }

    private initMenuEvents() {
        //new MenuEventController();
        //eventBus.on("onMenuClick", this.onMenuClick);
        eventBus.on("onMouseOver", this.onMenuHover);
    }

    /* ---- EVENT FUNCTIONS --- */

    public onMenuClick(cy:any, e:any) {
        if(e.target.id == "menuBtn" && this.openMenu) {
            this.openSideBar(cy);
            this.openMenu = false;
        } else if (e.target.id == "menuBtn" && !this.openMenu) {
            this.closeSideBar(cy);
            this.openMenu = true;
        } else this.toggleNodes(e.target.checked, cy);
    }

    public openSideBar (cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "25%";
        sidebar.style.display = "block";
        // cy.resize()
        console.log("click");
    }

    public closeSideBar (cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "0%";
        sidebar.style.display = "none";
    }

    private toggleNodes(checked:Boolean, cy:cytoscape.Core){
        cy.elements().removeStyle();
        if(checked){ // show labels
            cy.style(labelStylesheet);
        } else { // show nodes
            cy.style(style);
        }
    }

    // TODO: make work
    public onMenuHover(e:any) {
        console.log ("mouse over1");
        // https://stackoverflow.com/questions/23508221/vanilla-javascript-event-delegation
        //console.log(e.target.closest(".hotlist-element"));
        // TODO: highlight in graph -> highlight node on hover
    }

    private populateSidebar(cy: any) {
        const hotlist = document.getElementById("hotlist") as HTMLElement;
        console.log("core", cy); //-> undefined ??
        // list of all (important) nodes for the graph view
        const courses = cy.$(".course") as cytoscape.Collection;

        courses.forEach(course => {
            const childs = course.neighborhood().not(".ghost").not(".course");
            this.addDivs(course, childs, hotlist);
        });
    
    }

    public updateSidebar(target:any, courseNodes:cytoscape.Collection) {
        const hotlist = document.getElementById("hotlist") as HTMLElement;
        hotlist.innerHTML = "";
        // Find good and easy way to look for visible nodes in graph
        this.addDivs(target, courseNodes, hotlist);

    }

    // Make work ??
    public sidebarSelect(target:cytoscape.NodeSingular) {
        const nodeDivs = document.getElementById(target.data("label"));
        nodeDivs?.setAttribute("class", "select-hotlist-child");
    }

    public sidebarConnect() {

    }

    public sidebarHover() {

    }

    /**
     * Creates a tree-view of parent and their childs
     * @param parent The parent to create
     * @param childs The childs to append to the parent
     * @param div The div to append the parent and then the childs
     */
    private addDivs(
        parent:cytoscape.NodeSingular, 
        childs:cytoscape.Collection, 
        div:HTMLElement
    ) {
        var pDiv = document.createElement("div");
        pDiv.setAttribute("class", "hotlist-items");
        pDiv.innerText = parent.data("label");
        div.appendChild(pDiv);

        childs.forEach(child => {
            if(child.data("label") != undefined) {
                var cDiv = document.createElement("div");
                cDiv.setAttribute("class", "hotlist-childs");
                cDiv.setAttribute("id", child.data("label"));
                cDiv.innerText = child.data("label");
                pDiv.appendChild(cDiv);
            }

        });

    }

}

function onMouseOver () {
    eventBus.on("onMouseOver", (e:MouseEvent) => {
        // highlight div and graph
        // const target = e.currentTarget;
        //console.log("target", target);
        console.log("mouseover");
    });
}

// just export all functions?