console.log("TabShare service worker initialized");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Service worker received message:", request);
  
  if (request.action === "importTabs") {
    importTabs(request.tabs, request.groupName, request.groupColor)
      .then(() => {
        console.log("Import completed successfully");
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Import failed:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

async function importTabs(tabs, groupName, groupColor) {
  try {
    console.log("Starting tab import:", { tabCount: tabs.length, groupName });
    const tabIds = [];
    
    for (const tab of tabs) {
      try {
        console.log("Creating tab:", tab.url);
        const newTab = await chrome.tabs.create({ url: tab.url, active: false });
        tabIds.push(newTab.id);
      } catch (e) {
        console.error("Failed to create tab:", tab.url, e);
      }
    }

    console.log("Created tabs:", tabIds);

    if (tabIds.length > 0) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title: groupName, color: groupColor });
      console.log("Tab group created successfully:", { groupId, title: groupName, color: groupColor });
    } else {
      throw new Error("No tabs were created");
    }
  } catch (e) {
    console.error("Error importing tabs:", e);
    throw e;
  }
}
