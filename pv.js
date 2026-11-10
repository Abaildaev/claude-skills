// OpusJake first-party page-view beacon. Cookieless: it sends only the current
// path + referrer. The server (/api/public/pageview) derives device, country,
// and a daily-rotating visitor hash from the request — nothing identifying is
// stored. Injected into every public HTML surface (app.html, the blog, and the
// React root). Fires once on load: the public pages are entry points reached by
// a direct load, not deep in-app SPA flows, so on-load is the right granularity.
(function () {
  try {
    var path = location.pathname || "/";

    // Never count local or LAN hosts: the endpoint stores every host in the
    // live page_views table, so dev servers and phones testing over wifi would
    // otherwise show up as real traffic. booking.js carries the same rule.
    if (/^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$|\.local$|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname)) return;

    // Never track the admin portal, the API itself, or automated/headless hits.
    if (path.indexOf("/hq-f7b945") === 0) return;
    if (path.indexOf("/api/") === 0) return;
    if (navigator.webdriver) return;

    var payload = JSON.stringify({ path: path, referrer: document.referrer || "" });
    var url = "/api/public/pageview";

    // Same-origin POST. keepalive lets it finish even if the user navigates away
    // immediately; sendBeacon is the fallback for browsers without fetch.
    if (window.fetch) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        credentials: "omit",
      }).catch(function () {});
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon(url, payload);
    }
  } catch (e) {
    // Analytics must never break the page.
  }
})();
