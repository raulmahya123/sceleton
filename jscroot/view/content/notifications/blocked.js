import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.2/croot.js";

export function main() {
    setInner("biggreet", "Halo Ngadimin");

    // Add animation effect using animate.css
    const biggreetElement = document.getElementById("biggreet");
    biggreetElement.classList.add("animate__animated", "animate__bounce");
}
