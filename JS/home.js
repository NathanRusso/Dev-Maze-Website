// Load some constants.
const play = document.getElementById("play");
const about = document.getElementById("about");
const fitTitle = fitty("#home_title", {});
const fitOptions = fitty("#instructions", {});

// Adjust the home title size to fit limit. This also fixes other altered styles.
fitTitle[0].element.addEventListener("fit", () => {
    // This resets the title element styles.
    resetElement(fitTitle[0].element);
    console.log("Title font size after fit:", window.getComputedStyle(fitTitle[0].element).fontSize);
});

// Adjust the home options sizes to fit limits together. This also fixes other altered styles.
fitOptions[0].element.addEventListener("fit", () => {
    // This resets the instructions element styles.
    resetElement(fitOptions[0].element);

    // Matches play and about font sizes to instructions font size.
    const fontGoal = window.getComputedStyle(fitOptions[0].element).fontSize;
    console.log("Instructions font size after fit:", fontGoal);
    play.style.fontSize = fontGoal;
    about.style.fontSize = fontGoal;
});

// This resizes the text on the home page.
resize();

/**
 * This functions resizes the text on the home page.
 */
function resize() {
    console.log("Resizing home page text...");   
    console.log("Title container width:", fitTitle[0].element.clientWidth);
    console.log("Instructions container width:", fitOptions[0].element.clientWidth);

    fitTitle[0].fit(true);
    fitOptions[0].fit(true);
}

/**
 * This rests style changes made by fitty on the element.
 * 
 * @param {*} element - The element to reset.
 */
function resetElement(element) {
    console.log("Resetting element styles...");
    //element.style.display = "block";
    element.style.transform = "none";
    element.style.position = "static";
    element.style.willChange = "auto";
}
