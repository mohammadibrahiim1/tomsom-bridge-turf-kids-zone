import JSZip from 'jszip';

export interface ExportProgressCallback {
  (message: string, progress: number): void;
}

export async function downloadCpanelZip(onProgress?: ExportProgressCallback): Promise<void> {
  try {
    if (onProgress) onProgress('প্রোডাকশন ফাইলসমূহ সংগ্রহ করা হচ্ছে...', 10);

    const zip = new JSZip();

    // 1. Fetch current or built index.html
    let indexHtmlContent = '';
    try {
      const resp = await fetch('/index.html', { cache: 'no-store' });
      if (resp.ok) {
        indexHtmlContent = await resp.text();
      }
    } catch {
      // fallback
    }

    if (!indexHtmlContent || indexHtmlContent.includes('<div id="root"></div>') === false) {
      // Build a clean, self-contained index.html
      const scripts = Array.from(document.querySelectorAll('script[src]'))
        .map((s) => (s as HTMLScriptElement).getAttribute('src'))
        .filter((src): src is string => Boolean(src && !src.startsWith('chrome-extension')));

      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((l) => (l as HTMLLinkElement).getAttribute('href'))
        .filter((href): href is string => Boolean(href && !href.startsWith('chrome-extension')));

      indexHtmlContent = `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>টমছম ব্রিজ টার্ফ ও কিডস জোন | Tomsom Bridge Turf & Kids Zone</title>
    <meta name="description" content="টমছম ব্রিজ টার্ফ ও কিডস জোন, কুমিল্লা - সেরা মানের ফুটবল ও ক্রিকেট টার্ফ এবং শিশুদের জন্য বিনোদনমূলক কিডস জোন। সহজে অনলাইন বুকিং করুন।" />
    <meta name="keywords" content="টমছম ব্রিজ টার্ফ, টমছম ব্রিজ টার্ফ বুকিং, কুমিল্লা টার্ফ, কুমিল্লা ফুটবল টার্ফ, টমছম ব্রিজ কিডস জোন" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <meta property="og:title" content="টমছম ব্রিজ টার্ফ ও কিডস জোন" />
    <meta property="og:description" content="খেলাধুলা, বিনোদন ও আনন্দের এক ঠিকানা। মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা।" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    ${links.map((href) => `<link rel="stylesheet" crossorigin href="${href.startsWith('/') ? href : '/' + href}">`).join('\n    ')}
    ${scripts.map((src) => `<script type="module" crossorigin src="${src.startsWith('/') ? src : '/' + src}"></script>`).join('\n    ')}
  </head>
  <body class="font-sans antialiased bg-white text-gray-950 selection:bg-red-600 selection:text-white min-h-screen">
    <div id="root"></div>
  </body>
</html>`;
    }

    zip.file('index.html', indexHtmlContent);

    if (onProgress) onProgress('অ্যাসেটস ও স্ক্রিপ্ট ফাইল ডাউনলোড হচ্ছে...', 30);

    // 2. Discover all asset URLs (JS, CSS, images) from the DOM and index.html
    const assetUrls = new Set<string>();

    // Extract from index.html
    const matches = indexHtmlContent.matchAll(/(?:src|href)=["']([^"']+)["']/g);
    for (const match of matches) {
      const url = match[1];
      if (url && (url.startsWith('/assets/') || url.startsWith('assets/'))) {
        assetUrls.add(url.startsWith('/') ? url : '/' + url);
      }
    }

    // Extract from DOM
    document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((el) => {
      const src = (el as HTMLScriptElement).src || (el as HTMLLinkElement).href;
      if (src && src.includes('/assets/')) {
        try {
          const parsed = new URL(src);
          assetUrls.add(parsed.pathname);
        } catch {
          // ignore
        }
      }
    });

    const assetsFolder = zip.folder('assets');

    // 3. Fetch each asset
    let completed = 0;
    const totalAssets = Math.max(assetUrls.size, 1);

    for (const url of assetUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const blob = await res.blob();
          const fileName = url.replace(/^\/?assets\//, '');
          if (assetsFolder) {
            assetsFolder.file(fileName, blob);
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch asset ${url}:`, err);
      }
      completed++;
      if (onProgress) {
        onProgress(
          `অ্যাসেট প্রসেস হচ্ছে (${completed}/${totalAssets})...`,
          30 + Math.round((completed / totalAssets) * 40)
        );
      }
    }

    // 4. Add .htaccess for cPanel Apache rewrite
    const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Caching for assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;
    zip.file('.htaccess', htaccessContent);

    // 5. Add Instructions Readme
    const readmeContent = `=====================================================
টমছম ব্রিজ টার্ফ ও কিডস জোন (cPanel Deployment)
=====================================================

cPanel এ আপলোড করার নিয়ম:
1. আপনার cPanel এ লগইন করে File Manager ওপেন করুন।
2. 'public_html' ফোল্ডারে প্রবেশ করুন।
3. এই ZIP ফাইলটি আপলোড করুন এবং Extract করুন।
4. এক্সট্র্যাক্ট করার পর নিশ্চিত করুন যে index.html, .htaccess এবং assets/ ফোল্ডার সরাসরি public_html এর ভেতরে রয়েছে।
5. ব্যস! আপনার ওয়েবসাইট ডোমেইনে সরাসরি চালু হয়ে যাবে।

=====================================================
File Structure in public_html:
├── index.html
├── .htaccess
└── assets/
    ├── index-xxxx.js
    └── index-xxxx.css
=====================================================
`;
    zip.file('README_CPANEL_INSTRUCTIONS.txt', readmeContent);

    if (onProgress) onProgress('ZIP ফাইল কমপ্রেস করা হচ্ছে...', 85);

    // 6. Generate ZIP Blob
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    if (onProgress) onProgress('ডাউনলোড সম্পন্ন হচ্ছে...', 100);

    // 7. Trigger browser download
    const downloadUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'public_html-cpanel-ready.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  } catch (error: any) {
    console.error('Failed to export cPanel ZIP:', error);
    throw new Error('ZIP ডাউনলোড তৈরি করতে সমস্যা হয়েছে: ' + (error.message || error));
  }
}
