import { createCookie } from "@remix-run/node";

export const userSettings = createCookie("user-settings", {});
export const unitData = createCookie("unit-data", {});
