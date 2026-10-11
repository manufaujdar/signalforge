import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const port = Number(process.env.BROWSER_TEST_PORT || 3196);
const origin = `http://127.0.0.1:${port}`;
async function ready(server) {
  for (let i=0;i<150;i++) {
    if (server.exitCode !== null) throw new Error('Local Worker exited before readiness');
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw new Error('Local Worker did not become ready');
}
async function stopWorker(server) {
  if (server.exitCode !== null || server.signalCode !== null) return;
  await new Promise((resolve, reject) => {
    const force = setTimeout(() => server.kill('SIGKILL'), 3000);
    const deadline = setTimeout(() => {
      clearTimeout(force);
      reject(new Error('Local Worker did not stop within five seconds'));
    }, 5000);
    server.once('exit', () => {
      clearTimeout(force);
      clearTimeout(deadline);
      resolve();
    });
    server.kill('SIGTERM');
  });
}
(async()=>{
  const server=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--ip','127.0.0.1','--port',String(port),'--inspector-port',String(port+100)], {env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:'.wrangler/browser-test.log'},stdio:'ignore'});
  let browser;
  try {
    await ready(server);
    browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(origin);
    await page.getByRole('button', { name: 'Workspace preferences', exact: true }).click();
    await page.getByLabel('Default platform').selectOption('LinkedIn');
    await page.getByLabel('Default enhancement').selectOption('2');
    await page.getByRole('button', { name: 'Apply preferences', exact: true }).click();
    assert.match(await page.getByRole('dialog').textContent(), /saved on this device and applied/);
    await page.getByRole('button', { name: 'Close preferences', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'LinkedIn', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.match(await page.locator('.composer-meta').textContent(), /3000 characters/);
    assert.match(await page.locator('.variant-active').textContent(), /Conversation/);
    assert.equal(await page.getByLabel('Goal', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Audience', { exact: true }).count(), 0);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('signalforge-workspace-preferences')));
    assert.deepEqual(stored, { platform: 'LinkedIn', direction: 2 });
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.platform-row .selected')?.textContent === 'LinkedIn');
    assert.match(await page.locator('.variant-active').textContent(), /Conversation/);
    await page.setViewportSize({ width: 390, height: 680 });
    await page.getByRole('button', { name: 'Workspace preferences', exact: true }).click();
    assert.ok(await page.getByRole('dialog').isVisible());
    const box = await page.getByRole('dialog').boundingBox();
    assert.ok(box.y >= 0 && box.y + box.height <= 680);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.getByRole('button', { name: 'Reset defaults', exact: true }).click();
    assert.equal(await page.getByLabel('Default platform').inputValue(), 'X');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), false);
    assert.equal(await page.getByRole('button', { name: 'Workspace preferences', exact: true }).evaluate(e => e === document.activeElement), true);
    assert.deepEqual(errors, []);
    await context.close();
    const blocked = await browser.newContext({ viewport: { width: 390, height: 680 } });
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Synthetic denied storage', 'SecurityError'); } }));
    const blockedPage = await blocked.newPage(); const blockedErrors = []; blockedPage.on('pageerror', e => blockedErrors.push(e.message));
    await blockedPage.route('**/*', route=>new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await blockedPage.goto(origin);
    await blockedPage.getByRole('button', { name: 'Workspace preferences', exact: true }).click();
    await blockedPage.getByLabel('Default platform').selectOption('Instagram');
    await blockedPage.getByRole('button', { name: 'Apply preferences', exact: true }).click();
    assert.match(await blockedPage.getByRole('dialog').textContent(), /applied to this tab, but could not be saved/);
    await blockedPage.getByRole('button', { name: 'Close preferences', exact: true }).click();
    assert.equal(await blockedPage.getByRole('button', { name: 'Instagram', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.deepEqual(blockedErrors, []);
    await blocked.close();
    console.log('Production synthetic browser regressions passed');
  } finally {
    if(browser) await browser.close();
    await stopWorker(server);
  }
})().catch(error=>{console.error(error);process.exitCode=1});
