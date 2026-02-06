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
  const hasExtension = typeof chrome !== 'undefined' && chrome.tabs;
  
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
      const tabIds = [];
      for (const tab of data.tabs) {
        try {
          const newTab = await chrome.tabs.create({ url: tab.url, active: false });
          tabIds.push(newTab.id);
        } catch (e) {
          console.error("Failed to create tab:", tab.url, e);
        }
      }

      if (tabIds.length > 0) {
        const groupId = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(groupId, { title: data.name, color: data.color });
        alert("Tab group imported successfully!");
      }

      window.close();
    };
  } else {
    showNoExtension();
    document.getElementById("preview").style.display = "block";
  }

  function showNoExtension() {
    document.getElementById("noExtension").style.display = "block";
  }
})();
