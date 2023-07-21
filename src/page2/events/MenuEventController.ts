import cytoscape from "cytoscape";
import { eventBus } from "../../global/EventBus";

export class MenuEventController {


    constructor(){
        eventBus.on("menuClick", this.openResource);
    }


    private openResource = (res:any) => {
        window.open(res.data("url"), "_blank")?.focus();
    }

}