import cytoscape, { EventObject } from "cytoscape";
import { eventBus } from "../../global/EventBus";

export class MenuEventController {

    private readonly cy: cytoscape.Core;
    private pathInfo: HTMLElement;
    private graphInfo: HTMLElement;
    private sidebarBtn: HTMLElement;
    private container: HTMLElement;
    private openMenu: boolean = true;

    constructor(cy: cytoscape.Core){
        this.cy = cy;

        eventBus.on("menuClick", this.openResource);

        this.pathInfo = document.getElementById("path-info") as HTMLElement;
        this.graphInfo = document.getElementById("graph-info") as HTMLElement;
        this.sidebarBtn = document.getElementById("sidebar-icon") as HTMLElement;
        this.container = document.getElementById("sidebar") as HTMLElement;

        this.initListeners();
        this.populateSideBar();
    }

    private initListeners() {
        this.pathInfo.addEventListener("click", this.onClick);
        this.graphInfo.addEventListener("click", this.onClick)
        this.sidebarBtn.addEventListener("click", this.onClick)
    }

    private populateSideBar(){
        const courses = this.cy.$(".course") as cytoscape.Collection;

        courses.forEach(course => {
            const childs = course.neighborhood().not(".ghost").not(".course");
            this.addDivs(course, childs, this.container);
        });
    }


    /* ---- EVENTS  AND EVENT FUNCTIONS ---- */

    private openResource = (res:any) => {
        window.open(res.data("url"), "_blank")?.focus();
    }

    private onClick = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        console.log("click Menu", t);
        switch (t.id){
            case "graph-info":
                this.createInfoBox(GRAPH_INFO);
                break;
            case "path-info":
                this.createInfoBox(PATH_INFO);
                break;
            case "sidebar-icon":
                this.toggleSideBar();
                break;
            default:
                console.log("no info-box available");
                break;  
        }
    }

    private toggleSideBar(){
        const sidebar = document.getElementById("sidebar") as HTMLElement;
        if(this.openMenu){
            console.log("open sidebar");
            this.openMenu = false;
            sidebar.style.width = "250px";
            this.container.style.display = "block";
        } else {
            this.openMenu = true;
            sidebar.style.width = "25px";
            this.container.style.display = "none";
        }
    }


    private createInfoBox(text:string){
        const infoDiv = document.createElement("div");
        infoDiv.setAttribute("class", "info-box");
        infoDiv.innerHTML = text;

        const closeBtn = document.createElement("div");
        closeBtn.setAttribute("class", "info-box-close");
        closeBtn.addEventListener("click", this.closeInfoBox);

        infoDiv.appendChild(closeBtn);
        document.body.appendChild(infoDiv);
    }

    private closeInfoBox = (e:MouseEvent) => {
        const div = e.target as HTMLElement;
        console.log("p", div.parentNode);
        document.body.removeChild(div.parentNode as HTMLElement);
    }

    /* UTILS */

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
        pDiv.setAttribute("class", "sidebar-items");
        pDiv.innerText = parent.data("label");
        div.appendChild(pDiv);

        childs.forEach(child => {
            if(child.data("label") != undefined) {
                var cDiv = document.createElement("div");
                cDiv.setAttribute("class", "sidebar-childs");
                cDiv.setAttribute("id", child.data("label"));
                cDiv.innerText = child.data("label");
                pDiv.appendChild(cDiv);
            }

        });

        // TODO: add click-event listeners !!!

    }

}

const GRAPH_INFO = `<b> Zeigt den aktuellen Graphen an. </b> <br/>
Hier werden die Kurse und ihre jeweiligen Knoten angezeigt. 
Und wie diese voneinander anbhängen. <br/>
Innerhalb dieser Ansicht kann mit dem Graphen interagiert werden.
Es gibt zwei Ansichten die die gleiche Interaktionsmöglichkeiten haben.<br/>
<ul>
<li>Die Ansicht des gesamten Graphen</li>
<li>Die separierte Ansicht eines Kurses 
<small>(etwa: Computergrafik und Bildverarbeitung)</small></li>
</ul> 
Der eizige Unterschied besteht in dem Abstraktionsgrad der Anzeige. 
So werden im gesamten Graphen weniger Informationen auf einmal angezeigt.
<br/>
<br/>
Die Interaktionsmöglichkeiten sind:
<ul>
<li>Klick auf einen Kurs öffnet oder schließt die separate Kursansicht</li>
<li>Klick auf einen Knoten zeigt 
    <ul>
    <li> die Verbundenen Knoten an </li> 
    <li> einen Lernpfad zu dem selektierten Knoten an</li>
    <li> zusätzliche Informationen und verknüpfte Ressourcen an (oben rechts) </li>
    </ul>
<li>Hover über einem Knoten zeigt dessen direkte Nachbarn an</li>
<li>Hover über einem versteckten Knoten (grauer Kreis) zeigt dessen Namen an</li>
</ul> 
<br/>
Die Größe eines Knotens stellt die Wichtigkeit dar.
`

const PATH_INFO = `<b> Zeigt den Lernpfad zu einem Knoten an. </b> <br/>
Der zu erlernende Knoten befindet sich oben 
und das benötigte Vorwissen wird unterhalb angesiedelt. <br/>
<small> Innerhalb dieser Ansicht, kann auch mit dem Graphen interagiert werden.</small>
`