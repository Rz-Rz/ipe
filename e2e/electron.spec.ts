// The Electron application launches under the display of the machine, opens a project, and shows
// a unit: the smoke test of the desktop surface (definition of done of ENG-0003, criterion 2).
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { _electron as electron, expect, test } from "@playwright/test";

test("the application opens a project given on its environment and shows the first unit", async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "ipe-electron-"));
  await fs.writeFile(path.join(folder, "chapter-1.md"), "The harbour was quiet.\n", "utf8");
  const app = await electron.launch({
    args: [path.resolve("apps/desktop/dist/main/main.cjs"), "--no-sandbox"],
    env: { ...process.env, IPE_OPEN_PROJECT: folder },
  });
  try {
    const window = await app.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    await expect(window).toHaveTitle("IPE");
    // Nothing is typed: the shell names the project, the interface opens it through the channel.
    await expect(window.getByTestId("project-title")).toHaveText(path.basename(folder));
    await expect(window.getByTestId("folder")).toHaveValue(folder);
    await expect(window.getByTestId("unit-title")).toHaveText(["chapter-1"]);
    await expect(window.locator(".cm-content")).toContainText("The harbour was quiet.");
    await expect(window.getByTestId("save-state")).toHaveText("saved");
    await window.screenshot({ path: "test-results/screenshots/10-electron-application.png" });
    const usesChannel = await window.evaluate(() => typeof (window as unknown as { ipe?: unknown }).ipe === "object");
    expect(usesChannel, "the interface talks through the message channel, not the bridge").toBe(true);
  } finally {
    await app.close();
  }
});
