
document.addEventListener("DOMContentLoaded", function () {
    let watchCheckbox = document.getElementById("watch-checkbox");
    watchCheckbox.onchange = function () {
        if (watchCheckbox.checked) {
            chrome.storage.sync.set({enabled: true});
        } else {
            chrome.storage.sync.set({enabled: false});
        }
    };

    let changeHostCheckbox = document.getElementById("ask-to-change-host-checkbox");
    changeHostCheckbox.onchange = function () {
        if (changeHostCheckbox.checked) {
            chrome.storage.sync.set({askToChangeHosts: true});
        } else {
            chrome.storage.sync.set({askToChangeHosts: false});
        }
    };

    chrome.storage.sync.get(["enabled", "askToChangeHosts"], function (result) {
        if (result.enabled) {
            watchCheckbox.checked = true;
        }
        if (result.askToChangeHosts) {
            changeHostCheckbox.checked = true;
        }
    });
});
