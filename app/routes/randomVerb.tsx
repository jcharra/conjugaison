import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { getConjugation } from "french-verbs";
import { VerbsInfo } from "french-verbs-lefff";
import Lefff from "french-verbs-lefff/dist/conjugations.json";
import { useState } from "react";
import ActionButton from "~/components/ActionButton";
import TargetWord from "~/components/TargetWord";

function randomChoice(arr: any[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

function getRandomTense() {
  // PRESENT, FUTUR, IMPARFAIT, PASSE_SIMPLE, CONDITIONNEL_PRESENT,
  // IMPERATIF_PRESENT, SUBJONCTIF_PRESENT, SUBJONCTIF_IMPARFAIT,
  // PASSE_COMPOSE, PLUS_QUE_PARFAIT
  return randomChoice([
    "PRESENT",
    "FUTUR",
    "IMPARFAIT",
    "CONDITIONNEL_PRESENT",
  ]);
}

function getRandomVerb() {
  return randomChoice(Object.keys(Lefff));
}

function getRandomPerson() {
  return Math.floor(Math.random() * 6);
}

function copyVerbIntoInput(verb: string) {
  const input: HTMLInputElement = document.getElementById(
    "answer"
  ) as HTMLInputElement;
  input.value = verb;
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
  const transition = useTransition();
  const [input, setInput] = useState("");

  return (
    <Form method="post" onSubmit={(e) => !input && e.preventDefault()}>
      <TargetWord verb={randomVerb} tense={randomTense} person={randomPerson} />
      <input type="hidden" name="person" value={randomPerson} />
      <input type="hidden" name="tense" value={randomTense} />
      <input type="hidden" name="verb" value={randomVerb} />

      <div className="mt-3 ml-2 mr-14">
        <div
          onClick={() => copyVerbIntoInput(randomVerb)}
          className="py-1 px-3 text-gray-400 inline ml-1 font-extrabold hover:text-gray-700 cursor-pointer text-3xl"
        >
          &#x2398;
        </div>
        <input
          autoComplete="off"
          autoCapitalize="off"
          maxLength={25}
          className="rounded-md border-2 w-30 p-2"
          type="text"
          name="answer"
          autoFocus
          id="answer"
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>
      <ActionButton disabled={!input}>
        <input
          type="submit"
          value={transition.state === "idle" ? "Abschicken" : "Warte ..."}
          disabled={transition.state !== "idle"}
        />
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
