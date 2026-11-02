// GitHub badge in the header: refresh the FlexiTac repo's star and fork counts.
// The markup ships with recent counts, so the badge still reads well if the
// unauthenticated GitHub API is rate-limited or offline. Counts are cached for
// an hour per tab to stay well under the API's 60 requests/hour limit.
(function () {
  var REPO = 'FlexiTac/FlexiTac';
  var KEY = 'gh-stats:' + REPO;
  var TTL = 60 * 60 * 1000;

  var fmt = function (n) {
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);
  };

  var apply = function (s) {
    document.querySelectorAll('[data-gh-stars]').forEach(function (el) { el.textContent = fmt(s.stars); });
    document.querySelectorAll('[data-gh-forks]').forEach(function (el) { el.textContent = fmt(s.forks); });
    document.querySelectorAll('[data-gh-badge]').forEach(function (el) {
      el.setAttribute('aria-label', 'FlexiTac on GitHub: ' + s.stars + ' stars, ' + s.forks + ' forks');
    });
  };

  try {
    var cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (cached && Date.now() - cached.at < TTL) { apply(cached); return; }
  } catch (e) {}

  if (!window.fetch) return;
  fetch('https://api.github.com/repos/' + REPO, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || typeof d.stargazers_count !== 'number') return;
      var s = { stars: d.stargazers_count, forks: d.forks_count, at: Date.now() };
      apply(s);
      try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    })
    .catch(function () {});
})();
