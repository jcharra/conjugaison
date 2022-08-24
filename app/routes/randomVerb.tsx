import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import {
  getRandomVerb,
  getRandomTense,
  getRandomPerson,
  getConjugatedForm,
  getSettingsFromRequest,
} from "~/dataprovider";
import { useState } from "react";
import ActionButton from "~/components/ActionButton";
import TargetWord from "~/components/TargetWord";

function copyVerbIntoInput(verb: string) {
  const input: HTMLInputElement = document.getElementById(
    "answer"
  ) as HTMLInputElement;
  input.value = verb;
  input.focus();
}

export const loader: LoaderFunction = async ({ request }) => {
  const settings = await getSettingsFromRequest(request);

  return {
    randomVerb: getRandomVerb(),
    randomTense: getRandomTense(settings.activeTenses),
    randomPerson: getRandomPerson(),
  };
};

export default function RandomVerbForm() {
  const { randomVerb, randomTense, randomPerson } = useLoaderData();
  const transition = useTransition();
  const [input, setInput] = useState("");

  return (
    <Form
      className="text-center"
      method="post"
      onSubmit={(e) => !input && e.preventDefault()}
    >
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
      <div className="mt-6 text-gray-400">
        <span>&#9881;</span>
        <Link className="text-sm ml-2" to="/settings">
          Einstellungen
        </Link>
      </div>
    </Form>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const answer = formData.get("answer");
  const verb = formData.get("verb") as string;
  const tense = formData.get("tense") as string;
  const person = formData.get("person") as string;

  const correctAnswer = getConjugatedForm(verb, tense, person);

  return redirect(
    `evaluation?answer=${encodeURIComponent(
      answer as string
    )}&correct=${encodeURIComponent(correctAnswer as string)}`
  );
};
