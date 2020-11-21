
const url = new URL(window.location.toString());
const host = url.host;
const protocol = url.protocol;
const anchorCheckTimeout = 2000;

let changeHosts;
let intervalId;
let metaKeyIsDown;
function highlightAnchors() {
    const uncheckedAnchors = document.querySelectorAll("a:not([data-qa-visited])");
    for (let a of uncheckedAnchors) {
        if (a.getAttribute("data-qa-visited") === "true") {
            continue;
        } else if (!a.href || a.href.startsWith("javascript")) {
            a.setAttribute("data-qa-visited", "true");
            continue;
        }
        let url;
        try {
            url = new URL(a.href);
        } catch {
            url = new URL(`https://${a.href}`);
        }
        const isDifferentHost = url.host !== host;
        const isDifferentProtocol = url.protocol !== protocol;

        if (isDifferentProtocol) {
            url.protocol = protocol;
        }

        a.setAttribute("data-qa-other-host", isDifferentHost ? "true" : "false");

        a.onclick = function (e) {
            e.preventDefault();
            if (isDifferentHost && changeHosts) {
                url.host = host;
            }
            if (a.target.includes("_blank") || metaKeyIsDown) {
                window.open(url.toString());
            } else {
                window.location.href = url.toString();
            }
        }

        a.setAttribute("data-qa-visited", "true");
    }
}

window.onkeydown = function (e) {
    metaKeyIsDown = e.metaKey;
};

window.onkeyup = function (e) {
    metaKeyIsDown = e.metaKey;
};

function removeClassesAndDataAttributes(anchors) {
    for (let anchor of anchors) {
        if (anchor.getAttribute("data-qa-visited")) {
            anchor.removeAttribute("data-qa-visited");
        }
        if (anchor.getAttribute("data-qa-other-host")) {
            anchor.removeAttribute("data-qa-other-host");
        }
    }
}

function setAllAnchorOnClicksToHref(anchors) {
    for (let anchor of anchors) {
        anchor.onclick = function (e) {
            e.preventDefault();
            if (anchor.target.includes("_blank") || metaKeyIsDown) {
                window.open(anchor.href);
            } else {
                window.location.href = anchor.href;
            }
        }
    }
}

function startParsingIfEnabled() {
    chrome.storage.sync.get(["enabled", "changeHosts"], function (result) {
        if (result.enabled) {
            highlightAnchors();
            intervalId = setInterval(highlightAnchors, anchorCheckTimeout);
        } else {
            clearInterval(intervalId);
        }
        changeHosts = !!result.changeHosts;
    });
}

chrome.storage.onChanged.addListener(function (changes) {
    const anchors = document.querySelectorAll("a");
    if (changes.enabled !== undefined) {
        if (changes.enabled.newValue) {
            startParsingIfEnabled();
        } else {
            clearInterval(intervalId);
            removeClassesAndDataAttributes(anchors);
        }
    }
    if (changes.changeHosts !== undefined) {
        changeHosts = !!changes.changeHosts.newValue;
        if (!changeHosts) {
            setAllAnchorOnClicksToHref(anchors);
        }
    }
});

startParsingIfEnabled();
