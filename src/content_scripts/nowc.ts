const reloadInterval = 1000 * 60 * 2.5; // 2.5分

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

const main = () => {
  setInterval(() => {
    reload();
  }, reloadInterval);
  console.log('[JBMR] Start nowcast auto reload.');
};

window.addEventListener('load', main);
window.removeEventListener('unload', main);
