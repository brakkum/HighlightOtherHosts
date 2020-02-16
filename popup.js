
document.addEventListener("DOMContentLoaded", function () {
    let watchCheckbox = document.getElementById("watch-checkbox");
    let changeHostCheckbox = document.getElementById("change-host-checkbox");

    watchCheckbox.onchange = function () {
        if (watchCheckbox.checked) {
            chrome.storage.sync.set({enabled: true});
            document.getElementById("host-container").hidden = false;
        } else {
            chrome.storage.sync.set({enabled: false, changeHosts: false});
            changeHostCheckbox.checked = false;
            document.getElementById("host-container").hidden = true;
        }
    };

    changeHostCheckbox.onchange = function () {
        if (changeHostCheckbox.checked) {
            chrome.storage.sync.set({changeHosts: true});
        } else {
            chrome.storage.sync.set({changeHosts: false});
        }
    };

    chrome.storage.sync.get(["enabled", "changeHosts"], function (result) {
        if (result.enabled) {
            watchCheckbox.checked = true;
        } else {
            document.getElementById("host-container").hidden = true;
            chrome.storage.sync.set({changeHosts: false});
        }
        if (result.changeHosts) {
            changeHostCheckbox.checked = true;
        }
    });
});
