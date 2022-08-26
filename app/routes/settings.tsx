import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import SubmitButton from "~/components/SubmitButton";
import { userSettings } from "~/cookies";
import {
  DISPLAY_NAME_FOR_TENSE,
  getSettingsFromRequest,
  TENSES,
  UserSettings,
  writeRequestCookie,
} from "~/dataprovider";

const MIN_UNIT_LENGTH = 1;
const MAX_UNIT_LENGTH = 100;

export const loader: LoaderFunction = async ({ request }) => {
  return getSettingsFromRequest(request);
};

export const action: ActionFunction = async ({ request }) => {
  const bodyParams = await request.formData();

  const activeTenses = TENSES.filter((t) => bodyParams.get(t) === "on");
  const unitLength = parseInt(bodyParams.get("unitLength") as string);
  const untilNoErrors = bodyParams.get("untilNoErrors") === "on";

  const updatedCookie = await writeRequestCookie(request, {
    unitStep: 1,
    unitErrors: [],
    unitErrorsCorrected: [],
    activeTenses,
    unitLength,
    untilNoErrors,
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await userSettings.serialize(updatedCookie),
    },
  });
};

export default function Settings() {
  const settings: UserSettings = useLoaderData();
  const [activeTenses, setActiveTenses] = useState(settings.activeTenses);
  const [unitLength, setUnitLength] = useState(settings.unitLength);
  const [untilNoErrors, setUntilNoErrors] = useState(settings.untilNoErrors);

  const toggleTense = useCallback(
    (val: string) => {
      if (activeTenses.indexOf(val) >= 0) {
        setActiveTenses((activeTenses) =>
          activeTenses.filter((t) => t !== val)
        );
      } else {
        setActiveTenses((activeTenses) => activeTenses.concat(val));
      }
    },
    [activeTenses]
  );

  return (
    <>
      <div className="text-left">
        <Form
          method="post"
          onSubmit={(e) => !activeTenses.length && e.preventDefault()}
        >
          <div>
            <h2 className="text-2xl mb-4">Temps</h2>
          </div>
          <div>
            {TENSES.map((t) => (
              <div className="my-2" key={t}>
                <input
                  type="checkbox"
                  name={t}
                  id={t}
                  checked={activeTenses.indexOf(t) >= 0}
                  onChange={() => toggleTense(t)}
                />{" "}
                <label htmlFor={t}>{DISPLAY_NAME_FOR_TENSE.get(t) || t}</label>
              </div>
            ))}
          </div>
          <div className="my-4">
            <span
              className="mr-4 underline cursor-pointer"
              onClick={() => setActiveTenses(TENSES)}
            >
              Sélectionner tous
            </span>{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setActiveTenses([])}
            >
              Desélectionner tous
            </span>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl mb-4">Training</h2>
          </div>
          <div className="mb-4">
            <button
              disabled={unitLength === MIN_UNIT_LENGTH}
              className={
                "bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 rounded-full px-3 py-1 mr-4 text-white font-extrabold inline cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault();
                setUnitLength((len) => Math.max(MIN_UNIT_LENGTH, len - 1));
              }}
            >
              -
            </button>
            <div className="font-bold w-21 inline-block text-center">
              {unitLength} {unitLength === 1 ? "verbe" : "verbes"}
            </div>
            <button
              disabled={unitLength === MAX_UNIT_LENGTH}
              className={
                "bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 rounded-full px-3 py-1 ml-4 text-white font-extrabold inline cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault();
                setUnitLength((len) => Math.min(MAX_UNIT_LENGTH, len + 1));
              }}
            >
              +
            </button>
            <input
              type="hidden"
              name="unitLength"
              id="unitLength"
              value={unitLength}
            />
          </div>
          <div className="mb-6">
            <input
              type="checkbox"
              name="untilNoErrors"
              id="untilNoErrors"
              checked={!!untilNoErrors}
              onChange={() => setUntilNoErrors((val) => !val)}
            />{" "}
            <label htmlFor="untilNoErrors">
              Demander à nouveau les erreurs à la fin
            </label>
          </div>

          <SubmitButton
            disabled={!activeTenses.length}
            caption={"Enregistrer"}
          />
        </Form>
      </div>
    </>
  );
}
