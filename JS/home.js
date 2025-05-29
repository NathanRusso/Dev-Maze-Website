// Load some variables.
const play = document.getElementById("play");
const about = document.getElementById("about");
let fitTitle = null;
let fitOptions = null;

// This resizes the text on the home page.
resize();

// This resizes the text on the home page when the page changes size.
window.addEventListener("resize", resize);

// This generates the items needed for fitty to resize the text.
function initializeFit() {
    // This recreates the fit instances.
    if (fitTitle) { fitTitle.unsubscribe(); }
    if (fitOptions) { fitOptions.unsubscribe(); }
    fitTitle = fitty("#home_title", {})[0];
    fitOptions = fitty("#instructions", {})[0];

    // This adjust the home title size to fit limit.
    fitTitle.element.addEventListener("fit", () => {
        const titleFont = window.getComputedStyle(fitTitle.element).fontSize;
        fitTitle.unsubscribe();
        fitTitle.element.style.fontSize = titleFont;
    });

    // This adjust the home options sizes to fit limits together.
    fitOptions.element.addEventListener("fit", () => {
        const optionsFont = window.getComputedStyle(fitOptions.element).fontSize;
        fitOptions.unsubscribe();
        fitOptions.element.style.fontSize = optionsFont;
        play.style.fontSize = optionsFont;
        about.style.fontSize = optionsFont;
    });
}

/**
 * This functions resizes the text on the home page.
 */
function resize() {
    initializeFit();
    fitTitle.fit(true);
    fitOptions.fit(true);
}
