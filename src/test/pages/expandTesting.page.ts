import { page } from "../helper/browser/browser";
import { expect } from "playwright/test";

export const eleUsingLinkText = (text: string) => page.locator(`//a[normalize-space(text())="${text}"]`);
export const eleUsingText = (text: string) => page.locator(`//*[normalize-space(text())="${text}"]`).last();