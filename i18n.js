/* DokoOita ホームページ：表示言語の切り替え（日本語・English・한국어・简体中文・繁體中文）
   決め方：①URLの ?lang=（例：?lang=en）→ ②前に選んだ言語 → ③ブラウザ（スマホ）の言語 → ④それ以外は English */
(function () {
  var codes = ["ja", "en", "ko", "zh-Hans", "zh-Hant"];
  var KEY = "dokoita_lang";
  var root = document.documentElement;
  function match(s) {
    if (!s) return null;
    var low = String(s).toLowerCase();
    for (var i = 0; i < codes.length; i++) { if (codes[i].toLowerCase() === low) return codes[i]; }
    if (low === "jp" || low.indexOf("ja") === 0) return "ja";
    if (low.indexOf("ko") === 0) return "ko";
    if (low.indexOf("zh") === 0) { return /hant|tw|hk|mo/.test(low) ? "zh-Hant" : "zh-Hans"; }
    if (low.indexOf("en") === 0) return "en";
    return null;
  }
  function pick() {
    var q = (location.search.match(/[?&]lang=([^&#]+)/) || [])[1];
    var found = match(q);
    if (found) return found;
    found = match((location.hash || "").replace("#", ""));
    if (found && codes.indexOf(found) >= 0 && /^#(ja|en|ko|zh-hans|zh-hant)$/i.test(location.hash)) return found;
    try { found = match(localStorage.getItem(KEY)); if (found) return found; } catch (e) {}
    var n = ((navigator.languages && navigator.languages[0]) || navigator.language || "en");
    return match(n) || "en";
  }
  var current = pick();
  root.setAttribute("data-lang", current);
  root.lang = current;
  function setMeta(sel, attr, val) { var el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); }
  function apply(code) {
    current = code;
    root.setAttribute("data-lang", code);
    root.lang = code;
    var bs = document.querySelectorAll("nav.langs button");
    for (var i = 0; i < bs.length; i++) { bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-lang") === code ? "true" : "false"); }
    var t = (window.PAGE_I18N || {})[code];
    if (t) {
      if (t.title) document.title = t.title;
      setMeta('meta[name="description"]', "content", t.desc);
      setMeta('meta[property="og:title"]', "content", t.ogtitle || t.title);
      setMeta('meta[property="og:description"]', "content", t.ogdesc || t.desc);
    }
    var els = document.querySelectorAll("[data-alt-" + code + "]");
    for (var j = 0; j < els.length; j++) { els[j].setAttribute("alt", els[j].getAttribute("data-alt-" + code)); }
    els = document.querySelectorAll("[data-aria-" + code + "]");
    for (var k = 0; k < els.length; k++) { els[k].setAttribute("aria-label", els[k].getAttribute("data-aria-" + code)); }
    var pl = document.querySelectorAll('a[href^="privacy.html"]');
    for (var m = 0; m < pl.length; m++) { pl[m].setAttribute("href", "privacy.html#" + code); }
  }
  document.addEventListener("DOMContentLoaded", function () {
    apply(current);
    var bs = document.querySelectorAll("nav.langs button");
    for (var i = 0; i < bs.length; i++) {
      bs[i].addEventListener("click", function () {
        var c = this.getAttribute("data-lang");
        apply(c);
        try { localStorage.setItem(KEY, c); } catch (e) {}
      });
    }
  });
})();
