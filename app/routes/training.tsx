import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useRef, useState, useCallback } from "react";
import HomeLink from "~/components/HomeLink";
import SubmitButton from "~/components/SubmitButton";
import TargetWord from "~/components/TargetWord";
import VerbCounter from "~/components/VerbCounter";
import { userSettings } from "~/cookies";
import {
  decodeQuestion,
  encodeQuestion,
  getConjugatedForms,
  getRandomPerson,
  getRandomTense,
  getRandomVerb,
  getSettingsFromRequest,
  randomChoice,
  writeRequestCookie,
} from "~/dataprovider";

export const loader: LoaderFunction = async ({ request }) => {
  const settings = await getSettingsFromRequest(request);

  if (settings.unitStep > settings.unitLength) {
    if (settings.unitErrors.length > 0) {
      const randomError = randomChoice(settings.unitErrors);
      const { verb, tense, person } = decodeQuestion(randomError);

      return {
        unitStep: settings.unitStep,
        unitLength: settings.unitLength,
        randomVerb: verb,
        randomTense: tense,
        randomPerson: person,
      };
    } else {
      return redirect("/");
    }
  }

  return {
    unitStep: settings.unitStep,
    unitLength: settings.unitLength,
    randomVerb: getRandomVerb(),
    randomTense: getRandomTense(settings.activeTenses),
    randomPerson: getRandomPerson(),
  };
};

export default function Training() {
  const { unitStep, unitLength, randomVerb, randomTense, randomPerson } =
    useLoaderData();
  const transition = useTransition();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [input]);

  const addVerbToInput = useCallback(() => {
    if (input.indexOf(randomVerb) === -1) {
      setInput((inp) => inp + randomVerb);
    }
  }, [input]);

  return (
    <>
      <VerbCounter step={unitStep} total={unitLength} />
      <TargetWord
        verb={randomVerb}
        tense={randomTense}
        person={randomPerson}
        currentInput={input}
      />
      <Form
        className="text-center"
        method="post"
        onSubmit={(e) => !input && e.preventDefault()}
      >
        <input type="hidden" name="person" value={randomPerson} />
        <input type="hidden" name="tense" value={randomTense} />
        <input type="hidden" name="verb" value={randomVerb} />

        <div className="mt-3 ml-2 mr-14">
          <div
            onClick={addVerbToInput}
            className="py-1 px-3 text-gray-400 inline ml-1 font-extrabold hover:text-gray-700 cursor-pointer text-3xl"
          >
            &#x2398;
          </div>
          <input
            ref={inputRef}
            autoComplete="off"
            autoCapitalize="off"
            maxLength={25}
            className="rounded-md border-2 w-30 p-2"
            type="text"
            name="answer"
            autoFocus
            id="answer"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(".", ""));
            }}
            onKeyUp={(e) => {
              if (e.key === "." && input.indexOf(randomVerb) === -1) {
                addVerbToInput();
              }
            }}
          ></input>
        </div>
        <SubmitButton
          disabled={transition.state !== "idle" || !input || input.length === 0}
          caption={transition.state === "idle" ? "Envoyer" : "Analyse ..."}
        />
        <HomeLink />
      </Form>
    </>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const answer = formData.get("answer") as string;
  const verb = formData.get("verb") as string;
  const tense = formData.get("tense") as string;
  const person = formData.get("person") as string;

  const settings = await getSettingsFromRequest(request);
  const correctAnswers = getConjugatedForms(verb, tense, person);

  let correctAnswer;
  let updatedErrors = settings.unitErrors;
  let updatedErrorsCorrected = settings.unitErrorsCorrected;

  const encodedQuestion = encodeQuestion(verb, tense, person);

  if (correctAnswers.indexOf(answer) > -1) {
    // CORRECT ANSWER

    if (updatedErrors.indexOf(encodedQuestion) > -1) {
      updatedErrors = updatedErrors.filter((q) => q !== encodedQuestion);

      if (updatedErrorsCorrected.indexOf(encodedQuestion) === -1) {
        updatedErrorsCorrected = updatedErrorsCorrected.concat(encodedQuestion);
      }
    }

    correctAnswer = answer;
  } else {
    // INCORRECT ANSWER

    if (updatedErrors.indexOf(encodedQuestion) === -1) {
      updatedErrors = settings.unitErrors.concat(encodedQuestion);
    }

    if (updatedErrorsCorrected.indexOf(encodedQuestion) > -1) {
      updatedErrorsCorrected = updatedErrorsCorrected.filter(
        (e) => e !== encodedQuestion
      );
    }

    correctAnswer = correctAnswers[0];
  }

  const updatedCookie = await writeRequestCookie(request, {
    ...settings,
    unitErrors: updatedErrors,
    unitErrorsCorrected: updatedErrorsCorrected,
    unitStep: settings.unitStep + 1,
  });

  return redirect(
    `evaluation?answer=${encodeURIComponent(
      answer as string
    )}&correct=${encodeURIComponent(correctAnswer as string)}`,
    {
      headers: {
        "Set-Cookie": await userSettings.serialize(updatedCookie),
      },
    }
  );
};
