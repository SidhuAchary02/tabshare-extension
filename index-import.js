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
  document.getElementById("noExtension").style.display = "none";

  document.getElementById("open").onclick = async () => {
    console.log("Import button clicked, sending message to content script");
    
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
      alert("Failed to import tabs. Make sure the TabShare extension is installed and enabled.");
    }, 10000);
  };

  function showNoExtension() {
    document.getElementById("noExtension").style.display = "block";
  }
})();
