import { ElementDefinition } from "cytoscape";
import "./style.css";
import { GraphViz } from "./vis/GraphViz";
import CGBV from "./data/cgbv.json";
import EIMI from "./data/eimi.json";

async function main() {
    console.log("main");

    // Get the elements
    //const elements = await getElements();
    // TODO: Change to also get resources and categories

    initGraph();
}
main();

async function initGraph() {
    //const elements = await getElements(); // currently only Cv&Bg
    const app = document.getElementById("app")!;

    //load all elements first

    const graphViz = new GraphViz(CGBV as ElementDefinition[], app);
}