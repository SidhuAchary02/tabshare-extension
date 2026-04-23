(function() {
  console.log("Import script loaded");
  const hash = location.hash.slice(1);
  console.log("Hash:", hash);
  if (!hash) {
    alert("Invalid link");
    return;
  }

  let data;
  try {
    data = JSON.parse(decodeURIComponent(atob(hash)));
    console.log("Data:", data);
  } catch (e) {
    console.error("Error parsing data:", e);
    alert("Invalid data");
    return;
  }

  // Display preview
  document.getElementById("groupTitle").textContent = data.name || "Tab Group";
  
  const tabsList = document.getElementById("tabsList");
  tabsList.innerHTML = data.tabs.map(tab => `
    <div class="tab-item">
      <span class="tab-icon">🔗</span>
      <a href="${tab.url}" target="_blank" rel="noopener noreferrer">${tab.title}</a>
    </div>
  `).join("");
  
  document.getElementById("preview").style.display = "block";

  const openButton = document.getElementById("open");
  let isImporting = false;
  let loadingInterval = null;

  const startLoading = () => {
    const baseText = "Importing";
    let dotCount = 0;
    openButton.disabled = true;
    openButton.style.opacity = "0.7";
    openButton.style.cursor = "not-allowed";
    openButton.textContent = baseText + "...";

    loadingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      openButton.textContent = baseText + ".".repeat(dotCount);
    }, 350);
  };

  const stopLoading = () => {
    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
    openButton.disabled = false;
    openButton.style.opacity = "";
    openButton.style.cursor = "";
    openButton.textContent = "Import All Tabs";
  };

  openButton.onclick = async () => {
    if (isImporting) {
      return;
    }
    isImporting = true;
    startLoading();

    console.log("Button clicked, sending message to content script");
    
    // Send message via postMessage to content script
    window.postMessage(
      {
        type: "TABSHARE_IMPORT_REQUEST",
        tabs: data.tabs,
        groupName: data.name,
        groupColor: data.color,
      },
      "*"
    );

    console.log("Message sent, waiting for response...");

    // Wait for response from content script
    const handleResponse = (event) => {
      console.log("Received message:", event.data);
      if (event.data.type === "TABSHARE_IMPORT_RESPONSE") {
        window.removeEventListener("message", handleResponse);
        clearTimeout(timeoutId);
        isImporting = false;
        stopLoading();
        if (event.data.success) {
          alert("Tab group imported successfully!");
          window.close();
        } else {
          alert("Failed to import tabs: " + (event.data.error || "Unknown error"));
        }
      }
    };

    window.addEventListener("message", handleResponse);
    
    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      window.removeEventListener("message", handleResponse);
      console.error("Timeout waiting for extension response");
      isImporting = false;
      stopLoading();
      alert("Failed to import tabs. Make sure the TabShare extension is installed and enabled.");
    }, 10000);
  };
})();