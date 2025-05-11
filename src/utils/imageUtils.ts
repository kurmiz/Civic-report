/**
 * Adds a timestamp to a URL to prevent caching
 * @param url The URL to add a timestamp to
 * @returns The URL with a timestamp parameter
 */
export const addTimestampToUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  const timestamp = new Date().getTime();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};
