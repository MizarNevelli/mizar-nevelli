import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/", text: "Mizar" },
  { path: "/about", text: "About" },
  { path: "/closures", text: "Closures" },
  { path: "/event-loop", text: "event loop" },
  { path: "/event-bubbling", text: "Event bubbling" },
  { path: "/contact", text: "Contact" },
];

for (const { path, text } of ROUTES) {
  test(`${path} loads without error and shows expected content`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(path);
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
    expect(errors, `JS errors on ${path}: ${errors.join(", ")}`).toHaveLength(
      0
    );
  });
}
