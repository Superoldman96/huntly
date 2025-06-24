export async function postData(baseUrl, url = '', data = {}) {
  const fullUrl = combineUrl(baseUrl, url);
  // Default options are marked with *
  const response = await fetch(fullUrl, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // 修改为include以支持跨域认证
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

export function combineUrl(baseUrl, url) {
  if (!baseUrl.endsWith("/")) {
    baseUrl = baseUrl + '/';
  }
  if (url.startsWith("/")) {
    url = url.substring(1);
  }
  return baseUrl + url;
}

export async function getData(baseUrl, url = '') {
  return fetchData("GET", baseUrl, url);
}

export async function deleteData(baseUrl, url = '') {
  return fetchData("DELETE", baseUrl, url);
}

export async function fetchData(method, baseUrl, url = '') {
  const fullUrl = combineUrl(baseUrl, url);
  // Default options are marked with *
  const response = await fetch(fullUrl, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // 修改为include以支持跨域认证
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

export function toAbsoluteURI(uri: string, baseURI: string, documentURI: string) {
  // Leave hash links alone if the base URI matches the document URI:
  if (baseURI == documentURI && uri.charAt(0) == "#") {
    return uri;
  }

  // Otherwise, resolve against base URI:
  try {
    return new URL(uri, baseURI).href;
  } catch (ex) {
    // Something went wrong, just return the original:
  }
  return uri;
}

export function getBaseURI(doc: Document) {
  let baseURI = doc.documentURI;
  var baseElements = doc.getElementsByTagName("base");
  var href = baseElements[0] && baseElements[0].getAttribute("href");
  if (href) {
    try {
      baseURI = new URL(href, baseURI).href;
    } catch (ex) {/* Just fall back to documentURI */
    }
  }
  return baseURI;
}

// get favicon url from document
export function findSmallestFaviconUrl(docNode: Document): string {
  const linkTags = docNode.querySelectorAll('link');
  let faviconUrl = '';
  let size = Infinity;
  for (const linkTag of linkTags) {
    const rels = linkTag.getAttribute('rel')?.split(' ');
    if (rels && rels.indexOf('icon') > -1) {
      const iconSizes = linkTag.getAttribute('sizes')?.split('x');
      const iconSize = iconSizes ? parseInt(iconSizes[0] || '0') : 0;
      if (iconSize < size) {
        size = iconSize;
        faviconUrl = linkTag.getAttribute('href') || '';
      }
      if (iconSize === 0 || iconSize === 16) {
        break;
      }
    }
  }
  if (faviconUrl) {
    faviconUrl = toAbsoluteURI(faviconUrl, getBaseURI(docNode), docNode.documentURI);
  }
  return faviconUrl;
}

export function isNotBlank(str: string) {
  return (str && !/^\s*$/.test(str));
}