import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getConjugation } from "french-verbs";
import { VerbsInfo } from "french-verbs-lefff";
import Lefff from "french-verbs-lefff/dist/conjugations.json";
import ActionButton from "~/components/ActionButton";
import TargetWord from "~/components/TargetWord";

function randomChoice(arr: any[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

function getRandomTense() {
  // PRESENT, FUTUR, IMPARFAIT, PASSE_SIMPLE, CONDITIONNEL_PRESENT,
  // IMPERATIF_PRESENT, SUBJONCTIF_PRESENT, SUBJONCTIF_IMPARFAIT,
  // PASSE_COMPOSE, PLUS_QUE_PARFAIT
  return randomChoice(["PRESENT", "FUTUR", "IMPARFAIT"]);
}

function getRandomVerb() {
  return randomChoice(Object.keys(Lefff));
}

function getRandomPerson() {
  return Math.floor(Math.random() * 6);
}

function appendChar(verb: string) {
  const input: HTMLInputElement = document.getElementById(
    "answer"
  ) as HTMLInputElement;
  const currentVal = input.value;
  console.log("Value:", currentVal);

  if (!currentVal) {
    const nextChar = verb.charAt(0);
    input.value = currentVal + nextChar;
  } else if (verb.startsWith(currentVal) && verb !== currentVal) {
    const nextChar = verb.charAt(currentVal.length);
    input.value = currentVal + nextChar;
  }

  input.focus();
}

export const loader: LoaderFunction = async () => {
  return {
    randomVerb: getRandomVerb(),
    randomTense: getRandomTense(),
    randomPerson: getRandomPerson(),
  };
};

export default function RandomVerbForm() {
  const { randomVerb, randomTense, randomPerson } = useLoaderData();

  return (
    <Form method="post">
      <TargetWord verb={randomVerb} tense={randomTense} person={randomPerson} />

      <input type="hidden" name="person" value={randomPerson} />
      <input type="hidden" name="tense" value={randomTense} />
      <input type="hidden" name="verb" value={randomVerb} />

      <div className="mt-3 mr-2">
        <input
          autoComplete="off"
          autoCapitalize="off"
          maxLength={25}
          className="rounded-md border-2 w-350px p-2"
          type="text"
          name="answer"
          autoFocus
          id="answer"
        ></input>
        <div
          onClick={() => appendChar(randomVerb)}
          className="bg-green-400 rounded-full py-2 px-3 w-60px text-white inline ml-2 font-extrabold"
        >
          +
        </div>
      </div>

      <ActionButton>
        <input type="submit" value="Abschicken" />
      </ActionButton>
    </Form>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const answer = formData.get("answer");
  const verb = formData.get("verb");
  const tense = formData.get("tense");
  const person = formData.get("person");

  const correctAnswer = getConjugation(
    Lefff as VerbsInfo,
    verb as string,
    tense as string,
    parseInt(person as string),
    {
      aux: "ETRE",
      agreeGender: "F",
      agreeNumber: "S",
    },
    false
  );

  return redirect(
    `evaluation?answer=${encodeURIComponent(
      answer as string
    )}&correct=${encodeURIComponent(correctAnswer as string)}`
  );
};
