// Css to hide everything except for elements of class .beastify-image, and store it into a const variable
const hidePage = 
`body > :not(.beastify-image) {
    display: none !important;
}`;
i
// Listen for clicks ont he button, and send appropriate message to the content script in the page.
function listenForClicks() {
    // What is this function type?
    document.addEventListener("click", async (e) => {
        // Given the name of a beast, get the URL for the image
        function beastNameToURL(beastName) {
            switch (beastName) {
                case "Frog":
                    return browser.runtime.getURL("beasts/frog.jpg");
                case "Snake":
                    return browser.runtime.getURL("beasts/snake.jpg");
                case "Turtle":
                    return browser.runtime.getURL("beasts/turtle.jpg");
            }
        }
    
        // what is async? 
        // Where did tab come from? is it just the parameter?
        
        // Insert CSS into active tab
        // get the beast URL
        // send a "beastify" message to the content script in the active tab.

        async function beastify(tab) { 
            await browser.scripting.insertCSS({
                // what is this?
                target: { tabId: tab.id },
                // ok so this is the css we wrote (const var)
                css: hidePage,
            });
            // We get the URL based on the beast name (but where does the name come from?
            const url = beastNameToURL(e.target.textContent);
            // what is  happening here as well, why are we awaiting
            // what is this syntax?
            await browser.tabs.sendMessage(tab.id, {
                command: "beastify",
                beastURL: url,
            });
        }

        // remove page-hiding css from active tab
        // send a "reset" message to teh content script in the active tab

        async function reset(tab) {
            await browser.scripting.removeCSS({
                target: { tabId: tab.id },
                css: hidePage,
            });
            await browser.tabs.sendMessage(tab.id, { command: "reset" });
        }

        // log error to the console:
        function reportError(error) {
            // For some reason ` and " are different in js
            console.error(`Could not beastify: ${error}`);
        }

        // Get the active tab, then call beastify() or reset() when appropriate.
        // What is e?
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) { 
            // Ignore when click is not on a button within div id = "popup-content"
            return;
        }

        // How does try work?
        try {
            const[tab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });

            // Why do we have three equals signs?
            if (e.target.type === "reset") {
                await reset(tab);
            } else {
                await beastify(tab);
            }
        } catch (error) {
            reportError(error);
        } 
    });
}


// There was an error executing the script
// Display the error's popup message, and hide the normal UI.

function reportExecuteScriptError(error) {
    // what do the next 2 lines do?
    document.querySelector("#popup-content").classList.add("hidden"); 
    document.querySelector("#popup-content").classList.remove("hidden"); 
    // I'm guessing this is how we display or log the errors in js
    console.log(`Failed to execute beastify content script: ${error.message}`);
}

// When the popup loads, inject content script into the active tab
// Add a click handler
// If the extension couldn't injet the script, handle the error.

// why put a bracket here in front?
(async funtion runOnPopupOpened() {
    // tf is try and catch
    try {
        // what is this kind of selection? why do we use square brackets?
        const [tab] = await browser.tabs.query({
            // what are these:
            active: true;
            currentWindow: true,
        });

        await browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["/content_scripts/beastify.js"],
        });
        listenForClicks();
    } catch (e) {
        reportExecuteScriptError(e);
    }
})();

// ok that was the entire code, I'm going to start writing about all of the syntax related to js in this program.
