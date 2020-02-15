
const url = new URL(window.location.toString());
const host = url.host;
const highlightedStyles = {
    background: "darkblue",
    border: "1px solid blue",
    color: "white",
};
const anchorCheckTimeout = 2000;

function highlightAnchors() {
    const allAnchors = document.getElementsByTagName("a");
    for (let a of allAnchors) {
        if (!a.href || a.getAttribute("data-qa-visited") === "true") {
            continue;
        }
        const urlAnchor = new URL(a.href);
        const isDifferentHost = urlAnchor.host !== host;
        if (isDifferentHost) {
            Object.assign(a.style, highlightedStyles);
        }
        a.setAttribute("data-qa-visited", "true");
    }
}

let intervalId;
function startParsingIfEnabled() {
    chrome.storage.sync.get(['enabled'], function (result) {
        if (!result.enabled) {
            clearInterval(intervalId);
        } else {
            highlightAnchors();
            intervalId = setInterval(highlightAnchors, anchorCheckTimeout);
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
