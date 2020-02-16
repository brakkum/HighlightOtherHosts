
const url = new URL(window.location.toString());
const host = url.host;
const anchorCheckTimeout = 2000;

let changeHosts;
function highlightAnchors() {
    const uncheckedAnchors = document.querySelectorAll("a:not([class='project-qa-checked-anchor']), a:not([data-qa-visited])");
    for (let a of uncheckedAnchors) {
        if (!a.href) {
            a.classList.add("data-qa-visited");
            continue;
        } else if (a.getAttribute("data-qa-visited") === "true") {
            continue;
        }
        const url = new URL(a.href);
        const isDifferentHost = url.host !== host;
        if (isDifferentHost) {
            a.classList.add("project-qa-checked-anchor");
            a.onclick = function (e) {
                e.preventDefault();
                if (changeHosts) {
                    url.host = host;
                }
                window.location.href = url.toString();
            }
        }
        a.setAttribute("data-qa-visited", "true");
    }
}

function removeClassesAndDataAttributes() {
    const anchors = document.querySelectorAll("a");
    for (let anchor of anchors) {
        if (anchor.classList.contains("project-qa-checked-anchor")) {
            anchor.classList.remove("project-qa-checked-anchor");
        }
        if (anchor.getAttribute("data-qa-visited")) {
            anchor.removeAttribute("data-qa-visited");
        }
    }
}

let intervalId;
function startParsingIfEnabled() {
    chrome.storage.sync.get(["enabled", "changeHosts"], function (result) {
        if (result.enabled) {
            highlightAnchors();
            intervalId = setInterval(highlightAnchors, anchorCheckTimeout);
        } else {
            clearInterval(intervalId);
        }
        if (result.changeHosts) {
            changeHosts = true;
        } else {
            changeHosts = false;
        }
    });
}

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.enabled !== undefined) {
        if (changes.enabled.newValue) {
            startParsingIfEnabled();
        } else {
            clearInterval(intervalId);
            removeClassesAndDataAttributes();
        }
    }
    if (changes.changeHosts !== undefined) {
        if (changes.changeHosts.newValue) {
            changeHosts = true;
        } else {
            changeHosts = false;
        }
    }
});

startParsingIfEnabled();
