chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Service worker received message:", request);
  
  if (request.action === "importTabs") {
    importTabs(request.tabs, request.groupName, request.groupColor);
    sendResponse({ success: true });
  }
});

async function importTabs(tabs, groupName, groupColor) {
  try {
    const tabIds = [];
    for (const tab of tabs) {
      try {
        const newTab = await chrome.tabs.create({ url: tab.url, active: false });
        tabIds.push(newTab.id);
      } catch (e) {
        console.error("Failed to create tab:", tab.url, e);
      }
    }

    if (tabIds.length > 0) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title: groupName, color: groupColor });
      console.log("Tab group created successfully");
    }
  } catch (e) {
    console.error("Error importing tabs:", e);
  }
}
