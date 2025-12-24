chrome.action.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
      url: "./json-editor/index.html",
      selected: true,
      active: true,
    });
  });
  
