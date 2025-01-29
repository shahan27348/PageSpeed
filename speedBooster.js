(function () {
  const BLACKLIST = [/f.vimeocdn.com/, /cdn.nfcube.com/];
  const DELAYLIST = [/cdn-cookieyes.com/];

  function delayScriptLoading() {
    const delayedScripts = [];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "SCRIPT" && DELAYLIST.some((pattern) => pattern.test(node.src))) {
            delayedScripts.push(node.src);
            node.remove();
          }
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      delayedScripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
      });
    }, 1500);
  }

  function blockScriptLoading() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "SCRIPT" && BLACKLIST.some((pattern) => pattern.test(node.src))) {
            node.type = "javascript/blocked";
            node.remove();
          }
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function optimizeImages() {
    setTimeout(() => {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.getAttribute("loading") || img.getAttribute("loading") === "lazy") {
          img.setAttribute("loading", "eager");
        }
      });
    }, 1200);
  }

  delayScriptLoading();
  blockScriptLoading();
  optimizeImages();
})();
