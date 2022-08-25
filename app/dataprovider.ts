import { Cookie, TypedResponse } from "@remix-run/node";
import { FrenchAux, GendersMF, getConjugation, Numbers } from "french-verbs";
import { VerbsInfo } from "french-verbs-lefff";
import Lefff from "french-verbs-lefff/dist/conjugations.json";
import { userSettings } from "./cookies";

export function randomChoice(arr: any[]) {
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

export const DISPLAY_NAME_FOR_TENSE: Map<string, string> = new Map([
  ["PRESENT", "Présent"],
  ["FUTUR", "Futur"],
  ["IMPARFAIT", "Imparfait"],
  ["CONDITIONNEL_PRESENT", "Conditionnel"],
  ["SUBJONCTIF_PRESENT", "Subjonctif présent"],
  ["PASSE_SIMPLE", "Passé simple"],
  ["IMPERATIF_PRESENT", "Impératif"],
  ["SUBJONCTIF_IMPARFAIT", "Subjonctif imparfait"],
  ["PASSE_COMPOSE", "Passé composé"],
  ["PLUS_QUE_PARFAIT", "Plus-que-parfait"],
]);

export function getRandomTense(tenses: string[]) {
  return randomChoice(tenses);
}

export function getRandomVerb() {
  return randomChoice(Object.keys(Lefff));
}

export function getRandomPerson() {
  return Math.floor(Math.random() * 6);
}

export function getConjugatedForms(
  verb: string,
  tense: string,
  person: string
): string[] {
  if (tense === "PASSE_COMPOSE" || tense === "PLUS_QUE_PARFAIT") {
    const possibleAnswers = [];
    for (const aux of ["AVOIR", "ETRE"]) {
      for (const gender of ["M", "F"]) {
        for (const num of ["S", "P"]) {
          possibleAnswers.push(
            getConjugation(
              Lefff as VerbsInfo,
              verb as string,
              tense as string,
              parseInt(person as string),
              {
                // these do not matter for other tenses
                aux: aux as FrenchAux,
                agreeGender: gender as GendersMF,
                agreeNumber: num as Numbers,
              },
              false
            )
          );
        }
      }
    }

    return possibleAnswers;
  } else {
    return [
      getConjugation(
        Lefff as VerbsInfo,
        verb as string,
        tense as string,
        parseInt(person as string),
        {
          // these do not matter for other tenses
          aux: "AVOIR",
          agreeGender: "M",
          agreeNumber: "S",
        },
        false
      ),
    ];
  }
}

export interface UserSettings {
  activeTenses: string[];
  untilNoErrors: boolean;
  unitLength: number;
  unitStep: number;
  unitErrors: string[];
}

const defaultSettings: UserSettings = {
  activeTenses: TENSES,
  untilNoErrors: true,
  unitLength: 20,
  unitStep: 1,
  unitErrors: [],
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

  return Object.assign(defaultSettings, cookie.settings);
}

function isUserSettings(
  obj: UserSettings | TypedResponse
): obj is UserSettings {
  return (<UserSettings>obj).activeTenses !== undefined;
}

export async function writeRequestCookie(
  request: Request,
  updatedValues: UserSettings
): Promise<Cookie> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userSettings.parse(cookieHeader)) || {};
  cookie.settings = Object.assign(cookie.settings || {}, updatedValues);
  return cookie;
}

export function encodeQuestion(verb: string, tense: string, person: string) {
  return `${verb}__${tense}__${person}`;
}

export function decodeQuestion(encoded: string) {
  const parts = encoded.split("__");
  return { verb: parts[0], tense: parts[1], person: parseInt(parts[2]) };
}
