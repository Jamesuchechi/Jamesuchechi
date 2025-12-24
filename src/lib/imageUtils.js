export const isNetlifyBlobUrl = (url) =>
  typeof url === 'string' && url.includes('/.netlify/blobs/');
