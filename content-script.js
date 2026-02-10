console.log("TabShare content script loaded on:", window.location.href);

// Listen for messages from the web page
window.addEventListener("message", (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  if (event.data.type === "TABSHARE_IMPORT_REQUEST") {
    console.log("Content script received import request:", event.data);
    
    // Send message to service worker
    try {
      chrome.runtime.sendMessage(
        {
          action: "importTabs",
          tabs: event.data.tabs,
          groupName: event.data.groupName,
          groupColor: event.data.groupColor,
        },
        (response) => {
          console.log("Service worker response:", response);
          // Send response back to web page
          window.postMessage(
            {
              type: "TABSHARE_IMPORT_RESPONSE",
              success: response?.success || false,
              error: response?.error,
            },
            "*"
          );
        }
      );
    } catch (error) {
      console.error("Error sending message to service worker:", error);
      window.postMessage(
        {
          type: "TABSHARE_IMPORT_RESPONSE",
          success: false,
          error: error.message,
        },
        "*"
      );
    }
  }
});
