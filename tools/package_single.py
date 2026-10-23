"""Package the ARISEVERSE prototype (website + learning portal + media) into ONE self-contained HTML file.

Structure of the output:
  shell page  ->  full-screen iframe (srcdoc) showing either the website or the portal
  - media (images/videos) embedded once as base64 JSON; resolved to blob: URLs on demand
  - both inner pages embedded as base64 (so their own <script> tags need no escaping)
  - links index.html#x / portal.html#x are intercepted and swap the iframe's page
  - AVStore is shared through the shell, so the website's application reaches the portal
Usage (from the repository root): python3 tools/package_single.py . dist/ARISEVERSE-Prototype.html
"""
import base64, json, os, re, sys

src, out = sys.argv[1], sys.argv[2]
read = lambda p: open(os.path.join(src, p), encoding='utf-8').read()

# ---------- runtime injected into both inner pages, right after data.js ----------
RUNTIME = r"""
(function () {
  var P = window.parent;
  function R(p) { try { return (P && P.__avResolve) ? P.__avResolve(p) : p; } catch (e) { return p; } }
  var m = window.AV && AV.media;
  if (m) {
    var img = m.img, person = m.person, video = m.video;
    m.img = function (n) { return R(img(n)); };
    m.person = function (n) { return R(person(n)); };
    m.video = function (n) { var v = video(n); return { src: R(v.src), poster: R(v.poster) }; };
    m.phase = m.phase.map(R);
  }
  // Storage shared with the other page through the shell (localStorage may be blocked for local files)
  var mem; try { mem = P.__avMem; } catch (e) { /* no shell */ }
  mem = mem || {};
  window.__avMem = mem;
  window.AVStore = {
    get: function (k, f) {
      if (Object.prototype.hasOwnProperty.call(mem, k)) return mem[k];
      try { var v = localStorage.getItem('av:' + k); return v == null ? f : JSON.parse(v); } catch (e) { return f; }
    },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('av:' + k, JSON.stringify(v)); } catch (e) { /* in-memory only */ } }
  };
  // Media written into the page markup
  [].forEach.call(document.querySelectorAll('[data-av-src],[data-av-poster]'), function (el) {
    if (el.hasAttribute('data-av-poster')) el.setAttribute('poster', R(el.getAttribute('data-av-poster')));
    if (el.hasAttribute('data-av-src')) el.setAttribute('src', R(el.getAttribute('data-av-src')));
  });
  [].forEach.call(document.querySelectorAll('video'), function (v) { if (v.querySelector('source[src]')) v.load(); });
  // Links between the website and the portal
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var mm = /^(index|portal)\.html(#[\w\/-]*)?$/.exec(a.getAttribute('href'));
    if (!mm) return;
    e.preventDefault(); e.stopPropagation();
    P.postMessage({ av: 'go', app: mm[1] === 'index' ? 'site' : 'portal', hash: mm[2] || '' }, '*');
  }, true);
})();
"""

# Sets the starting view; <base> keeps "#route" links inside the inner page
HEAD = ('<base href="about:srcdoc">\n<script>window.__AV_START=__AV_START__;(function(h){if(!h||location.hash)return;'
        'try{history.replaceState(null,"",h);}catch(e){try{location.hash=h;}catch(x){}}})(window.__AV_START);</script>\n')

def inline(html, js_patches=None):
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + HEAD, 1)
    assert '__AV_START__' in html
    for css in re.findall(r'<link rel="stylesheet" href="(assets/[\w.-]+\.css)">', html):
        html = html.replace(f'<link rel="stylesheet" href="{css}">', '<style>\n' + read(css) + '\n</style>', 1)
    for js in re.findall(r'<script src="(assets/[\w.-]+\.js)"></script>', html):
        code = read(js)
        for a, b in (js_patches or {}).get(js, []):
            assert a in code, (js, a[:50]); code = code.replace(a, b, 1)
        tag = '<script>\n' + code + '\n</script>'
        if js == 'assets/data.js':
            tag += '\n<script>' + RUNTIME + '</script>'
        html = html.replace(f'<script src="{js}"></script>', tag, 1)
    html = html.replace('src="media/', 'data-av-src="media/').replace('poster="media/', 'data-av-poster="media/')
    assert 'href="assets/' not in html and 'src="assets/' not in html
    return html

site = inline(read('index.html'))
portal = inline(read('portal.html'), {'assets/portal.js': [(
    "try { Object.keys(localStorage).filter(k => k.indexOf('av:') === 0).forEach(k => localStorage.removeItem(k)); }",
    "try { const mm = window.__avMem; if (mm) Object.keys(mm).forEach(k => delete mm[k]); } catch (e) { /* no shell */ }\n    "
    "try { Object.keys(localStorage).filter(k => k.indexOf('av:') === 0).forEach(k => localStorage.removeItem(k)); }")]})

# ---------- media ----------
MIME = {'.webp': 'image/webp', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png'}
media = {}
for d in ('img', 'people', 'video'):
    for f in sorted(os.listdir(os.path.join(src, 'media', d))):
        ext = os.path.splitext(f)[1]
        if ext in MIME:
            media[f'media/{d}/{f}'] = [MIME[ext], base64.b64encode(open(os.path.join(src, 'media', d, f), 'rb').read()).decode()]
used = set(re.findall(r'media/(?:img|people|video)/[\w-]+\.\w+', site + portal))
dynamic = {'media/img/', 'media/people/', 'media/video/'}  # helper-built paths are resolved at runtime
missing = [u for u in used if u not in media]
assert not missing, missing

b64 = lambda s: base64.b64encode(s.encode('utf-8')).decode()
SHELL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ARISEVERSE — Website &amp; Learning Portal (Prototype)</title>
<style>
  html, body { margin: 0; height: 100%; background: #121110; overflow: hidden; }
  #app { position: fixed; inset: 0; width: 100%; height: 100%; border: 0; display: block; background: #121110; }
  #boot { position: fixed; inset: 0; display: grid; place-items: center; color: #D4B27C; font: 600 12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: .24em; text-transform: uppercase; }
</style>
</head>
<body>
<div id="boot">Loading ARISEVERSE prototype…</div>
<iframe id="app" title="ARISEVERSE website and learning portal prototype" allow="autoplay; fullscreen"></iframe>
<script type="application/json" id="av-media">__MEDIA__</script>
<script type="text/plain" id="av-site">__SITE__</script>
<script type="text/plain" id="av-portal">__PORTAL__</script>
<script>
(function () {
  var media = JSON.parse(document.getElementById('av-media').textContent), cache = {};
  function bytes(b64) { var s = atob(b64), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  window.__avResolve = function (p) {
    var e = media[p]; if (!e) return p;
    if (cache[p]) return cache[p];
    var url; try { url = URL.createObjectURL(new Blob([bytes(e[1])], { type: e[0] })); } catch (x) { url = 'data:' + e[0] + ';base64,' + e[1]; }
    return (cache[p] = url);
  };
  window.__avMem = {};
  function page(id) { return new TextDecoder('utf-8').decode(bytes(document.getElementById(id).textContent.trim())); }
  var docs = { site: page('av-site'), portal: page('av-portal') };
  var frame = document.getElementById('app');
  function show(app, hash) {
    if (!/^#[\\w\\/-]*$/.test(hash || '')) hash = '';
    frame.srcdoc = docs[app].replace('__AV_START__', JSON.stringify(hash || ''));
  }
  frame.addEventListener('load', function () { var b = document.getElementById('boot'); if (b) b.parentNode.removeChild(b); });
  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow) return;
    var d = e.data || {};
    if (d.av === 'go' && docs[d.app]) show(d.app, d.hash);
  });
  show('site', '');
})();
</script>
</body>
</html>
"""
doc = SHELL.replace('__MEDIA__', json.dumps(media, separators=(',', ':'))).replace('__SITE__', b64(site)).replace('__PORTAL__', b64(portal))
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
open(out, 'w', encoding='utf-8').write(doc)
print('media files:', len(media), '| referenced in markup:', len(used))
print('site page KB:', len(site) // 1024, '| portal page KB:', len(portal) // 1024)
print('output MB:', round(os.path.getsize(out) / 1e6, 2), '->', out)
