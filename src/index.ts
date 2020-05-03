import "./index.scss";
import { drawConstellations } from "./constellations";

function initConstellations() {
  drawConstellations(document.getElementById("page-root") as HTMLDivElement);
}

window.addEventListener("load", initConstellations);
