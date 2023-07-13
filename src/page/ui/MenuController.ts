import { eventBus } from "../../global/EventBus";
import { MenuEventController } from "./EventController";

export class MenuController {

    private readonly cy : any;
    //private readonly container : HTMLElement;

    constructor(
        //cy : any,
        //container : HTMLElement,*/
    ) {
        //this.cy = cy;
        // this.container = container; */
        //this.initMenuEvents();
    }

    /*private initMenuEvents() {
        //new MenuEventController();
        eventBus.on("onMenuClick", this.onMenuClick);
    }*/

    /* ---- EVENT FUNCTIONS --- */

    public openSideBar (cy:any) {
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        // open Sidebar
        sidebar.style.width = "25%";
        sidebar.style.display = "block";
        console.log("click");
        populateSidebar(cy);
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

}

function populateSidebar(cy: any) {
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

} // update on enterCourse()?

function onMouseOver () {
    eventBus.on("onMouseOver", (e:MouseEvent) => {
        // highlight div and graph
        // const target = e.currentTarget;
        //console.log("target", target);
        console.log("mouseover");
    });
}

// just export all functions?