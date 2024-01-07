import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.2/croot.js";

export function main() {
    // Fetch content from the web URL
    fetch("https://raulmahya123.github.io/sweggergis/")
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                throw new Error(`Failed to fetch content. Status: ${response.status}`);
            }
            // Parse the response as text
            return response.text();
        })
        .then(data => {
            // Update the "biggreet" element with the fetched content
            setInner("biggreet", data);

            // Add animation effect using animate.css
            const biggreetElement = document.getElementById("biggreet");
            biggreetElement.classList.add("animate__animated", "animate__bounce");
        })
        .catch(error => {
            console.error("Error fetching content:", error);
        });
}
