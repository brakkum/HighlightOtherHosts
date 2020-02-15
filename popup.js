
document.addEventListener("DOMContentLoaded", function () {
    let checkbox = document.getElementById("watch-checkbox");
    chrome.storage.sync.get(["enabled"], function (result) {
        if (result.enabled) {
            checkbox.checked = true;
        }
    });

    checkbox.onchange = function () {
        if (checkbox.checked) {
            chrome.storage.sync.set({enabled: true});
        } else {
            chrome.storage.sync.set({enabled: false});
        }
    };
});
