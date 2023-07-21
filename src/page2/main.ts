import "./style.css";
import CGBV from "../global/data/cgbv.json";
import { ElementDefinition } from "cytoscape";
import { MainGraph } from "./vis/GraphViz";

async function main() {
    console.log("start");

    //init Graph
    const app = document.getElementById("graph")!;
    new MainGraph(CGBV as ElementDefinition[], app);
}
main();