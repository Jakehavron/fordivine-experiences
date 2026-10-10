from pathlib import Path
import re,hashlib,base64,json
root=Path(__file__).resolve().parents[1]/'fordivine-upload-to-github'
markup=(root/'shared/glass-navigation.html').read_text()
digest=base64.b64encode(hashlib.sha256((root/'shared/glass-navigation.js').read_bytes()).digest()).decode()
for p in root.rglob('*.html'):
 if 'kickstart' in str(p.relative_to(root)) or p.parent.name=='shared':continue
 html=p.read_text()
 if 'fd-glass-header' in html:continue
 if re.search(r'<header[^>]*class="fd-site-header',html):html=re.sub(r'<header[^>]*class="fd-site-header[\s\S]*?</header>',lambda m:markup,html,count=1)
 elif p.parent.name in ['privacy-policy','terms-of-use']:html=re.sub(r'<header>[\s\S]*?</header>',lambda m:markup,html,count=1)
 else:continue
 html=html.replace('</head>','<link rel="stylesheet" href="/shared/glass-navigation.css?v=1"></head>',1)
 html=html.replace('</body>',f'<script defer src="/shared/glass-navigation.js?v=1" integrity="sha256-{digest}"></script></body>',1)
 p.write_text(html)
p=root/'vercel.json';config=json.loads(p.read_text())
for entry in config.get('headers',[]):
 for header in entry['headers']:
  if header['key'].lower()=='content-security-policy' and "'strict-dynamic'" in header['value'] and digest not in header['value']:header['value']=header['value'].replace('script-src ',f"script-src 'sha256-{digest}' ",1)
p.write_text(json.dumps(config,indent=2)+'\n')
