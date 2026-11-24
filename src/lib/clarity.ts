// Microsoft Clarity Client-Side Helper
// Exposes @microsoft/clarity methods for custom event tracking, tagging, and identification.
import Clarity from "@microsoft/clarity";
import { site } from "../data/site";

export function initClarity() {
  if (typeof window !== "undefined" && site.clarityProjectId) {
    try {
      Clarity.init(site.clarityProjectId);
    } catch (e) {
      console.warn("Clarity initialization skipped:", e);
    }
  }
}

export function trackClarityEvent(eventName: string) {
  if (typeof window !== "undefined" && (window as any).clarity) {
    try {
      Clarity.event(eventName);
    } catch (e) {
      // silently ignore if script blocked by adblocker
    }
  }
}

export function tagClarity(key: string, value: string) {
  if (typeof window !== "undefined" && (window as any).clarity) {
    try {
      Clarity.setTag(key, value);
    } catch (e) {}
  }
}

export { Clarity };
