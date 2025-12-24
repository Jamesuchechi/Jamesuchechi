export const isNetlifyBlobUrl = (url) =>
  typeof url === 'string' &&
  (url.includes('/.netlify/blobs/') || url.includes('/api/blob/'));

export const normalizeImageUrl = (url) => {
  if (typeof url !== 'string') return url;
  const match = url.match(/\/\.netlify\/blobs\/([^/]+)\/(.+)$/);
  if (match) {
    return `/api/blob/${match[1]}/${match[2]}`;
  }
  return url;
};
