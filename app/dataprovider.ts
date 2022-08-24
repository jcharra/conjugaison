import { json, TypedResponse } from "@remix-run/node";
import { getConjugation } from "french-verbs";
import { VerbsInfo } from "french-verbs-lefff";
import Lefff from "french-verbs-lefff/dist/conjugations.json";
import { userSettings } from "./cookies";

function randomChoice(arr: any[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

export const TENSES = [
  "PRESENT",
  "FUTUR",
  "IMPARFAIT",
  "PASSE_SIMPLE",
  "CONDITIONNEL_PRESENT",
  "IMPERATIF_PRESENT",
  "SUBJONCTIF_PRESENT",
  "SUBJONCTIF_IMPARFAIT",
  "PASSE_COMPOSE",
  "PLUS_QUE_PARFAIT",
];

export function getRandomTense(tenses: string[]) {
  return randomChoice(tenses);
}

export function getRandomVerb() {
  return randomChoice(Object.keys(Lefff));
}

export function getRandomPerson() {
  return Math.floor(Math.random() * 6);
}

export function getConjugatedForm(verb: string, tense: string, person: string) {
  return getConjugation(
    Lefff as VerbsInfo,
    verb as string,
    tense as string,
    parseInt(person as string),
    {
      aux: "ETRE",
      agreeGender: "F", // TODO: respect passé composé
      agreeNumber: "S",
    },
    false
  );
}

export interface UserSettings {
  activeTenses: string[];
}

const defaultSettings: UserSettings = {
  activeTenses: TENSES,
};

export async function getSettingsFromRequest(
  request: Request
): Promise<UserSettings> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userSettings.parse(cookieHeader)) || {};

  if (!cookie || !cookie.settings || !isUserSettings(cookie.settings)) {
    console.log("No settings found in", cookie);
    return defaultSettings;
  }

  return cookie.settings;
}

function isUserSettings(
  obj: UserSettings | TypedResponse
): obj is UserSettings {
  return (<UserSettings>obj).activeTenses !== undefined;
}
