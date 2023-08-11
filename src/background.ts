const reloadInterval = 1000 * 60 * 5; // 5 分

const applyEvent = (tabId: number) => {
  setInterval(() => {
    chrome.tabs
      .sendMessage(tabId, { type: 'nowc' })
      .then((result) => {
        console.log('[JBMR] message sent.', result);
      })
      .catch((error) => {
        console.error('[JBMR] message sending failed.', error);
      });
  }, reloadInterval);
};

// お掃除
chrome.tabs.onRemoved.removeListener(applyEvent);

// https://blog.myntinc.com/2017/06/chromeextension-onupdated.html#google_vignette
let timer: number;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === undefined) return;

  if (changeInfo.status === 'loading') {
    if (timer) clearTimeout(timer);
    return;
  }

  const isTarget =
    tab.url && tab.url.indexOf('https://www.jma.go.jp/bosai/nowc') >= 0;
  if (!isTarget) return;

  timer = setTimeout(() => {
    console.log('[JBMR] event attaching...');
    applyEvent(tabId);
  }, 1000);
});
