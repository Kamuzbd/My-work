(() => {
  const input = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");
  const popup = document.getElementById("popup");
  const searchTermDisplay = document.getElementById("searchTermDisplay");
  const buttonsContainer = document.getElementById("buttonsContainer");
  const voiceBtn = document.getElementById("voiceBtn");
  const themeToggle = document.getElementById("themeToggle");
  const blobs = document.querySelectorAll(".blob");

  // Theme handling
  function updateThemeUI(isDark) {
    if (isDark) {
      document.body.classList.remove("light");
      themeToggle.textContent = "🌓";
    } else {
      document.body.classList.add("light");
      themeToggle.textContent = "🌞";
    }
  }

  let darkMode = localStorage.getItem("darkMode");
  if (darkMode === null) {
    darkMode = "true";
    localStorage.setItem("darkMode", darkMode);
  }
  updateThemeUI(darkMode === "true");

  themeToggle.addEventListener("click", () => {
    darkMode = darkMode === "true" ? "false" : "true";
    localStorage.setItem("darkMode", darkMode);
    updateThemeUI(darkMode === "true");
  });

  // Google Suggestions via JSONP
  function fetchSuggestions(query) {
    if (!query) {
      suggestionsBox.innerHTML = "";
      return;
    }
    const callbackName = "suggestCallback";
    const oldScript = document.getElementById("jsonpScript");
    if (oldScript) oldScript.remove();

    window[callbackName] = function (data) {
      if (!data || data.length < 2) {
        suggestionsBox.innerHTML = "";
        return;
      }
      const suggestions = data[1];
      showSuggestions(suggestions);
    };

    const script = document.createElement("script");
    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&callback=${callbackName}`;
    script.id = "jsonpScript";
    script.onerror = () => {
      suggestionsBox.innerHTML = "";
    };
    document.body.appendChild(script);
  }

  function showSuggestions(suggestions) {
    if (!suggestions.length) {
      suggestionsBox.innerHTML = "";
      return;
    }
    suggestionsBox.innerHTML = "";
    suggestions.forEach(s => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.textContent = s;
      div.setAttribute("role", "option");
      div.tabIndex = 0;
      div.onclick = () => {
        input.value = s;
        suggestionsBox.innerHTML = "";
        showSearchApps(s);
      };
      div.onkeydown = e => {
        if (e.key === "Enter") {
          input.value = s;
          suggestionsBox.innerHTML = "";
          showSearchApps(s);
        }
      };
      suggestionsBox.appendChild(div);
    });
  }

  // Show apps with search links
  function showSearchApps(term) {
    searchTermDisplay.textContent = term;
    popup.classList.remove("hidden");
    buttonsContainer.innerHTML = "";

    const apps = [
      { name: "Google", url: `https://www.google.com/search?q=${encodeURIComponent(term)}` },
      { name: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}` },
      { name: "Instagram", url: `https://www.instagram.com/explore/tags/${encodeURIComponent(term)}` },
      { name: "TikTok", url: `https://www.tiktok.com/tag/${encodeURIComponent(term)}` },
      { name: "Facebook", url: `https://www.facebook.com/search/top?q=${encodeURIComponent(term)}` }
    ];

    apps.forEach(app => {
      const a = document.createElement("a");
      a.href = app.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = app.name;
      buttonsContainer.appendChild(a);
    });
  }

  input.addEventListener("input", e => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      fetchSuggestions(val);
      popup.classList.add("hidden");
    } else {
      suggestionsBox.innerHTML = "";
      popup.classList.add("hidden");
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) {
      suggestionsBox.innerHTML = "";
      showSearchApps(input.value.trim());
    }
  });

  // Voice input
  let recognition;
  let recognizing = false;

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      recognizing = true;
      voiceBtn.classList.add("listening");
    };

    recognition.onend = () => {
      recognizing = false;
      voiceBtn.classList.remove("listening");
    };

    recognition.onerror = (e) => {
      recognizing = false;
      voiceBtn.classList.remove("listening");
      alert("Voice recognition error: " + e.error);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      fetchSuggestions(transcript);
      showSearchApps(transcript);
    };

    voiceBtn.addEventListener("click", () => {
      if (recognizing) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    voiceBtn.style.display = "none";
  }

  // Background blobs move on mouse move
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 15;
      const moveX = (x - 0.5) * speed;
      const moveY = (y - 0.5) * speed;
      blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
})();
