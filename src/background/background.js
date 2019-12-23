var master = {};
var clickEnabled = true;

function openPanel(tab) {

    let contentWindowId = tab.windowId;
    if (master[contentWindowId] != undefined) {
        browser.windows.update(master[contentWindowId], {
            focused: true
        }).catch(function(e) {
            master[contentWindowId] == undefined;
            openPanel(tab);
        });
        return;
    } else if (!clickEnabled) {
        return;
    }

    clickEnabled = false;
    setTimeout(function() {
        clickEnabled = true;
    }, 1000);

    browser.windows.create({
        url: browser.runtime.getURL("panel/index.html"),
        type: "popup",
        height: 730,
        width: 750
    }).then(function waitForPanelLoaded(panelWindowInfo) {
        return new Promise(function(resolve, reject) {
            let count = 0;
            let interval = setInterval(function() {
                if (count > 100) {
                    reject("Simpler editor has no response");
                    clearInterval(interval);
                }

                browser.tabs.query({
                    active: true,
                    windowId: panelWindowInfo.id,
                    status: "complete"
                }).then(function(tabs) {
                    if (tabs.length != 1) {
                        count++;
                        return;
                    } else {
                        master[contentWindowId] = panelWindowInfo.id;
                        if (Object.keys(master).length === 1) {
                            createMenus();
                        }
                        resolve(panelWindowInfo);
                        clearInterval(interval);
                    }
                })
            }, 200);
        });
    }).then(function bridge(panelWindowInfo){
        return browser.tabs.sendMessage(panelWindowInfo.tabs[0].id, {
            selfWindowId: panelWindowInfo.id,
            commWindowId: contentWindowId
        });
    }).catch(function(e) {
        console.log(e);
    });

}

browser.browserAction.onClicked.addListener(openPanel);

browser.windows.onRemoved.addListener(function(windowId) {
    let keys = Object.keys(master);
    for (let key of keys) {
        if (master[key] === windowId) {
            delete master[key];
            if (keys.length === 1) {
                browser.contextMenus.removeAll();
            }
        }
    }
});

function createMenus() {
    browser.contextMenus.create({
        id: "verifyText",
        title: "verifyText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "verifyTitle",
        title: "verifyTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "verifyValue",
        title: "verifyValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertText",
        title: "assertText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertTitle",
        title: "assertTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "assertValue",
        title: "assertValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeText",
        title: "storeText",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeTitle",
        title: "storeTitle",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
    browser.contextMenus.create({
        id: "storeValue",
        title: "storeValue",
        documentUrlPatterns: ["<all_urls>"],
        contexts: ["all"]
    });
}

var port;
browser.contextMenus.onClicked.addListener(function(info, tab) {
    port.postMessage({ cmd: info.menuItemId });
});

browser.runtime.onConnect.addListener(function(m) {
    port = m;
});

browser.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install" || details.reason == "update") {
        browser.tabs.create({url: "http://edu.enu.kz"});
    }
})
