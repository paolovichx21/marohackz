(function () {
  var quotes = [
    "ابدأ دلوقتي، وبكرة هتشكري نفسك إنك ما استنيتيش.",
    "كل خطوة صغيرة بتقربك من حلمك، كمّلي.",
    "اللي بيتعب النهارده هو اللي هيفرح بكرة.",
    "ماتقوليش مش هقدر، قولي لسه ما جربتش.",
    "النجاح مش صدفة، ده تعب وصبر وإصرار.",
    "إنتي أقوى مما تتخيلي، كمّلي يا بطلة.",
    "الشاطر اللي يتعلم من غلطته ويقوم تاني."
  ];

  var sites = [
    { name: "Google", url: "google.com" },
    { name: "YouTube", url: "youtube.com" },
    { name: "TikTok", url: "tiktok.com" },
    { name: "Instagram", url: "instagram.com" }

  ];

  var KEY = "marohack_recent";

  var input = document.getElementById("url");
  var error = document.getElementById("error");
  var chips = document.getElementById("chips");
  var recentBox = document.getElementById("recentBox");
  var recent = document.getElementById("recent");

  document.getElementById("quote").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("year").textContent = new Date().getFullYear();

  function readRecent() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveRecent(host) {
    try {
      var list = readRecent().filter(function (h) { return h !== host; });
      list.unshift(host);
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 5)));
    } catch (e) {}
  }

  function makeChip(label, value) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", function () {
      input.value = value;
      go();
    });
    return b;
  }

  function drawRecent() {
    var list = readRecent();
    recent.innerHTML = "";
    recentBox.hidden = list.length === 0;
    list.forEach(function (h) { recent.appendChild(makeChip(h, h)); });
  }

  function go() {
    var value = input.value.trim();
    error.textContent = "";

    if (!value) {
      error.textContent = "اكتبي الرابط الأول.";
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) {
      value = "https://" + value;
    }

    var url;
    try {
      url = new URL(value);
    } catch (e) {
      error.textContent = "الرابط ده شكله مش صح، راجعيه تاني.";
      return;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      error.textContent = "الرابط لازم يبدأ بـ http أو https.";
      return;
    }

    if (url.hostname.indexOf(".") === -1) {
      error.textContent = "الرابط ده شكله ناقص، راجعيه تاني.";
      return;
    }

    saveRecent(url.hostname);
    window.location.href = url.href;
  }

  sites.forEach(function (s) { chips.appendChild(makeChip(s.name, s.url)); });
  drawRecent();

  document.getElementById("go").addEventListener("click", go);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") go();
  });

  document.getElementById("paste").addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function (text) {
        input.value = text.trim();
        input.focus();
      }).catch(function () {
        error.textContent = "ما قدرتش ألصق، الصقي الرابط بإيدك في الخانة.";
      });
    } else {
      error.textContent = "الصقي الرابط بإيدك في الخانة.";
    }
  });

  document.getElementById("clear").addEventListener("click", function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    drawRecent();
  });
})();
