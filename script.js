
const url = new URL(window.location.toString());
const host = url.host;
const highlightedStyles = {
    background: "darkblue",
    border: "1px solid blue",
    color: "white",
};
const anchorCheckTimeout = 2000;

let askToChangeHosts;
function highlightAnchors() {
    const uncheckedAnchors = document.querySelectorAll("a:not([data-qa-visited])");
    for (let a of uncheckedAnchors) {
        if (!a.href) {
            a.setAttribute("data-qa-visited", "true");
            continue;
        } else if (a.getAttribute("data-qa-visited") === "true") {
            continue;
        }
        const url = new URL(a.href);
        const isDifferentHost = url.host !== host;
        if (isDifferentHost) {
            Object.assign(a.style, highlightedStyles);
            a.onclick = function (e) {
                e.preventDefault();
                if (window.confirm("Different host, proceed?")) {
                    if (askToChangeHosts) {
                        if (window.confirm(`Change host to ${host}?`)) {
                            url.host = host;
                            window.location.href = url.toString();
                        } else {
                            window.location.href = url.toString();
                        }
                    } else {
                        window.location.href = url.toString();
                    }
                }
            }
        }
        a.setAttribute("data-qa-visited", "true");
    }
}

let intervalId;
function startParsingIfEnabled() {
    chrome.storage.sync.get(["enabled", "askToChangeHosts"], function (result) {
        if (result.enabled) {
            highlightAnchors();
            intervalId = setInterval(highlightAnchors, anchorCheckTimeout);
        } else {
            clearInterval(intervalId);
        }
        if (result.askToChangeHosts) {
            askToChangeHosts = true;
        } else {
            askToChangeHosts = false;
        }
    });
}

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.enabled !== undefined) {
        if (changes.enabled.newValue) {
            startParsingIfEnabled();
        } else {
            clearInterval(intervalId);
        }
    }
    if (changes.askToChangeHosts !== undefined) {
        if (changes.askToChangeHosts.newValue) {
            askToChangeHosts = true;
        } else {
            askToChangeHosts = false;
        }
    }
});

startParsingIfEnabled();
