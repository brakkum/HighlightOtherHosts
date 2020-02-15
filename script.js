
const url = new URL(window.location.toString());
const host = url.host;

function highlightAnchors() {
    const allAnchors = document.getElementsByTagName("a");
    for (let a of allAnchors) {
        if (!a.href || a.getAttribute("data-qa-visited") === "true") {
            continue;
        }
        const urlAnchor = new URL(a.href);
        const isDifferentHost = urlAnchor.host !== host;
        if (isDifferentHost) {
            const newStyles = {
                background: "darkblue",
                border: "1px solid blue",
                color: "white",
            };
            Object.assign(a.style, newStyles);
        }
        a.setAttribute("data-qa-visited", "true");
    }
}

let intervalId;
function startParsingIfEnabled() {
    chrome.storage.sync.get(['enabled'], function (result) {
        if (!result.enabled) {
            if (intervalId) {
                clearInterval(intervalId);
            }
        } else {
            intervalId = setInterval(highlightAnchors, 1000);
        }
    });
}

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.enabled.newValue) {
        startParsingIfEnabled();
    } else {
        clearInterval(intervalId);
    }
});

startParsingIfEnabled();
