import { page } from "../helper/browser/browser";
import { expect } from "playwright/test";

export const eleUsingLinkText = (text: string) => page.locator(`//a[normalize-space(text())="${text}"]`);
export const eleUsingText = (text: string) => page.locator(`//*[normalize-space(text())="${text}"]`).first();
export const eleUsingId = (id: string) => page.locator(`//input[@id="${id}"]`).first();
export const eleUsingPlaceholder = (placeholder: string) => page.locator(`//input[@placeholder="${placeholder}"]`).first();
export const textBoxUsingLabel = (labelText: string) => page.locator(`//label[normalize-space(text())="${labelText}"]/following-sibling::*//input`).first(); 
export const dropdownUsingLabel = (labelText: string) => page.locator(`//label[text()="${labelText}"]/following-sibling::*//select`);