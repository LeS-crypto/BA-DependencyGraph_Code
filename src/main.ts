import './style.css';
import cytoscape from "cytoscape";

console.log("Hello World!");

const app = document.getElementById("app");

var cy = cytoscape ({
  container: app, 
  //elements: EIMI,

  // initial viewport state:
  zoom: 1,
  pan: { x: 0, y: 0 },

  // STYLESHEET -> ausgelagert in gStyle.ts
  //style: gStyle,

  // called on layoutready
  // layout: ;

});
