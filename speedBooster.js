
const pageBoosterParams = {
  siteKey: "dev-site-1x6954-1.wix-dev-center-test.org/",
  guid: "312bc67a-e5a9-4876-8ad0-cd2c92c93446",
  optimizationEnabled: true
};

(function(window, document) {
  const stringDecoder = createStringDecoder();
  const magicNumber = 0x97c8b;

  // Initialize configuration
  let boosterConfig;
  try {
    boosterConfig = JSON.parse('{ "' + Object.keys(pageBoosterParams.optimizationRules)[0] + '" }');
    boosterConfig.excludedDomains = boosterConfig.excludedDomains.map(domain => 
      domain.length > 0 ? new RegExp(domain) : null
    ).filter(Boolean);
  } catch (error) {
    boosterConfig = {
      optimizationEnabled: true,
      mobileDetection: true,
      dueDate: 3488,
      fontOptimization: true,
      domainFilter: [],
      performanceMonitoring: true,
      excludedDomains: [],
      objectStorage: null,
      objectStorage2: null,
      page: 0,
      records: 0,
      recordsFiltered: 0,
      recordsTotal: 0,
      rows: 0,
      sortIndex: null,
      sortOrder: null,
      status: null,
      total: 0
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const hasParam1 = urlParams.has('param1');
  const hasParam2 = urlParams.has('param2');

  let optimizationEnabled = !boosterConfig.optimizationEnabled || 
    urlParams.has('disableOptimization') || 
    urlParams.has('noOptimization') || 
    urlParams.has('disable') ? false : true;

  let currentScriptSource;
  try {
    currentScriptSource = document.currentScript.src.split('?')[1].split('/')[1];
  } catch (error) {
    try {
      currentScriptSource = new URL(document.currentScript.src).pathname.split('/')[1];
    } catch (error) {}
  }
  if (!currentScriptSource) currentScriptSource = pageBoosterParams.siteKey;

  if (!location.hostname.includes(pageBoosterParams.siteKey)) return;

  try {
    if (!document.currentScript.src.includes('pagebooster')) return;
  } catch (error) {
    return;
  }

  let scriptTags = [];
  let fetchQueue = [];
  let mutationObserverActive = false;
  let performanceObserverActive = false;
  let lazyLoadObserverActive = false;
  const excludedDomains = boosterConfig.excludedDomains || [];
  const performanceMonitoring = boosterConfig.performanceMonitoring || false;

  // Initialize performance observer
  if ('PerformanceObserver' in window) {
    const performanceObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach(entry => {
        if (entry.name.includes('pagebooster')) {
          console.log('Performance entry:', entry);
        }
      });
    });
    performanceObserver.observe({ type: 'resource', buffered: true });
  }

  // Initialize mutation observer
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node.loading = 'lazy';
          node.decoding = 'async';
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Initialize lazy load observer
  const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        lazyLoadObserver.unobserve(img);
      }
    });
  });

  // Main processing function
  async function processPage() {
    if (!optimizationEnabled) return;

    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src.includes('pagebooster')) {
        script.defer = true;
      }
    });

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      if (!excludedDomains.some(domain => domain.test(link.href))) {
        link.rel = 'preload';
        link.as = 'style';
      }
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.src.includes('pagebooster')) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }
    });

    // Fetch and inject additional scripts
    const scriptUrls = [
      'https://cdn.pagebooster.net/optimizer/script1.js',
      'https://cdn.pagebooster.net/optimizer/script2.js'
    ];

    for (const url of scriptUrls) {
      const script = document.createElement('script');
      script.src = url;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  // Execute processing
  processPage();

  // Handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node.loading = 'lazy';
          node.decoding = 'async';
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Handle navigation
  window.addEventListener('popstate', () => {
    location.reload();
  });

})(window, document);

function createStringDecoder() {
  const strings = [
    // ... (all original string values from the array)
  ];
  return (index) => strings[index];
}
