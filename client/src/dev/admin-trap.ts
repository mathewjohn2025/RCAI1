// Step 9: If anything still fires, catch the culprit instantly (dev trap)
const originalFetch = window.fetch;
(window as any).fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  const url = String(input);
  if (url.includes('/api/admin/')) {
    console.trace('ADMIN API CALL TRACE →', url);
    console.warn('🚨 UNAUTHORIZED ADMIN API CALL DETECTED:', url);
    console.warn('This call should be prevented by adminLoader!');
  }
  return originalFetch.call(this, input, init);
};