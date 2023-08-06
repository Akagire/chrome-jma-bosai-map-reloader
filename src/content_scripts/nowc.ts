const findReloadButton = (): HTMLElement | undefined => {
  const xpathResult = document.evaluate(
    '//i[contains(@class, "material-icons") and contains(text(), "update")]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  if (xpathResult.snapshotLength <= 0) return;

  return xpathResult.snapshotItem(0) as HTMLElement;
};

const isViewingLatestResult = (): boolean => {
  // div.pointer の 3 番目の textContent とカーソルの chip の textContent が一致しているかどうかを見れば良さそう
  const elements = document.getElementsByClassName('pointer');
  if (elements.length !== 5) {
    console.error(
      '[JBMR] Viewing latest result check failed. Element count unmatch.'
    );
    return false;
  }
  const latestTime = elements[3].textContent!;

  const chip = document.evaluate(
    '//div[contains(@aria-label, "時刻スライダー")]/div[contains(@class, "noUi-tooltip")]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  if (chip.snapshotLength === 0) {
    console.error('[JBMR] Viewing latest result check failed. Chip not found.');
    return false;
  }
  const chipTime = chip.snapshotItem(0)!.textContent!;

  return latestTime === chipTime;
};

const reload = () => {
  const reloadButton = findReloadButton();
  if (reloadButton === undefined) {
    console.info('[JBMR] No reload button found.');
    return;
  }
  if (!isViewingLatestResult()) {
    console.info("[JBMR] You don't watching latest analysis. Skip reload.");
    return;
  }
  console.log('[JBMR] Reload nowcast.');
  (reloadButton as HTMLElement).click();
};

// NOTE: ここで非同期処理を行う場合は true を返す必要がある
// https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sendresponse_%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E9%9D%9E%E5%90%8C%E6%9C%9F%E3%81%AE%E5%BF%9C%E7%AD%94%E3%81%AE%E9%80%81%E4%BF%A1
// NOTE: ここでは async/await 記法は利用できないので注意
// https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'nowc') {
    reload();
  }
});
