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
        // this.initMenuEvents();
    }

    private initMenuEvents() {
        //new MenuEventController();
        eventBus.on("onMenuClick", this.onMenuClick);
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
        /*if(this.openMenu){
            this.openSideBar(cy);
            this.openMenu = false;
        } else if (!this.openMenu) {
            this.closeSideBar(cy);
            this.openMenu = true;
        } else if (e.target.id() == "toggleNodes") {
            this.toggleNodes(e.target.checked(), cy);
        } */
        //this.toggleNodes(e.target.checked, cy);
    }

    public openSideBar (cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "25%";
        sidebar.style.display = "block";
        // cy.resize()
        console.log("click");
        //populateSidebar(cy);
    }

    public closeSideBar (cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "0%";
        sidebar.style.display = "none";
    }

    private toggleNodes(checked:Boolean, cy:cytoscape.Core){
        cy.elements().removeStyle();
        if(checked){
            // show labels
            cy.style(labelStylesheet);
            //cy.elements().style(labelStylesheet);

        } else {
            // show nodes
            cy.style(style);
        }
    }

    // TODO: make work
    public onMouseOver(e:any) {
        console.log ("mouse over1");
        // https://stackoverflow.com/questions/23508221/vanilla-javascript-event-delegation
        //console.log(e.target.closest(".hotlist-element"));
        // TODO: highlight in graph -> highlight node on hover
    }

    // TODO: close sidebar + move cy-container = app

    /*public onMenuClick(e:MouseEvent, cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "25%";
        sidebar.style.display = "block";
        console.log("click");
        populateSidebar(cy);
    }*/

    private populateSidebar(cy: any) {
        const hotlist = document.getElementById("hotlist") as HTMLElement;
        console.log("core", cy); //-> undefined ??
        // list of all (important) nodes for the graph view
        const courses = cy.$(".course") as cytoscape.Collection;
    
        courses.nodes().forEach(course => {
            var div = document.createElement("div");
            div.setAttribute("class", "hotlist-items");
            div.innerText = course.data("label");
            hotlist.appendChild(div);
            // create div element
            // wirte content
            // put in scrollable list
            //div.addEventListener("mouseover", onMouseOver)
        });
    
    }

    public updateSidebar() {}

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