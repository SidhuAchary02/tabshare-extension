(function() {
  console.log("TabShare import page loaded");
  const hash = location.hash.slice(1);
  console.log("Hash:", hash);

  let data;
  if (!hash) {
    showNoExtension();
    return;
  }

  try {
    data = JSON.parse(decodeURIComponent(atob(hash)));
    console.log("Data:", data);
  } catch (e) {
    console.error("Error parsing data:", e);
    alert("Invalid share link");
    return;
  }

  // Check if extension is available
  const hasExtension = typeof chrome !== 'undefined' && chrome.runtime;
  
  // Display preview
  document.getElementById("groupTitle").textContent = data.name || "Tab Group";
  
  const tabsList = document.getElementById("tabsList");
  tabsList.innerHTML = data.tabs.map(tab => `
    <div class="tab-item">
      <span class="tab-icon">🔗</span>
      <a href="${tab.url}" target="_blank" rel="noopener noreferrer">${tab.title}</a>
    </div>
  `).join("");
  
  if (hasExtension) {
    document.getElementById("preview").style.display = "block";
    document.getElementById("noExtension").style.display = "none";

    document.getElementById("open").onclick = async () => {
      console.log("Import button clicked");
      
      if (typeof chrome === 'undefined') {
        alert("TabShare extension is not installed.");
        return;
      }

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

      // Wait for response from content script
      const handleResponse = (event) => {
        if (event.data.type === "TABSHARE_IMPORT_RESPONSE") {
          window.removeEventListener("message", handleResponse);
          if (event.data.success) {
            alert("Tab group imported successfully!");
            window.close();
          } else {
            alert("Failed to import tabs. Try again.");
          }
        }
      };

      window.addEventListener("message", handleResponse);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleResponse);
        alert("Failed to import tabs. Make sure the TabShare extension is installed and enabled.");
      }, 5000);
    };
  } else {
    showNoExtension();
    document.getElementById("preview").style.display = "block";
  }

  function showNoExtension() {
    document.getElementById("noExtension").style.display = "block";
  }
})();
