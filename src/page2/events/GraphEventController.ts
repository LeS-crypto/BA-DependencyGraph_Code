import cytoscape, { EventObject } from "cytoscape";
import { eventBus } from "../../global/EventBus";

export class GraphEvents {

    private readonly $cy : cytoscape.Core;

    constructor(cy: cytoscape.Core) {
        this.$cy = cy;
        this.initListeners();
    }

    private initListeners() {
        this.$cy.on("click", "node", this.onClick);
        this.$cy.on("mouseover", "node", this.onMouseOver);
        this.$cy.on("mouseout", "node", this.onMouseOut);

        this.initDoubleClick();
        this.$cy.on("dblclick", this.onDoubleClick);
    }

    /* ---- EVENTS ---- */
    
    private onClick = (e:EventObject) => {
        eventBus.emit("click", e.target);
    }

    private onMouseOver = (e:EventObject) => {
        eventBus.emit("mouseover", e.target);
    }

    private onMouseOut = (e:EventObject) => {
        eventBus.emit("mouseout", e.target);
    }

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
    } // via: [3rd Answer] https://stackoverflow.com/questions/18610621/cytoscape-js-check-for-double-click-on-nodes

    private onDoubleClick = (e:EventObject) => {
        eventBus.emit("dblclick", e.target);
    }

}