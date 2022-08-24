import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import ActionButton from "~/components/ActionButton";
import { userSettings } from "~/cookies";
import {
  DISPLAY_NAME_FOR_TENSE,
  getSettingsFromRequest,
  TENSES,
  UserSettings,
} from "~/dataprovider";

export const loader: LoaderFunction = async ({ request }) => {
  return getSettingsFromRequest(request);
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userSettings.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  const activeTenses = TENSES.filter((t) => bodyParams.get(t) === "on");
  cookie.settings = { activeTenses };

  return redirect("/randomVerb", {
    headers: {
      "Set-Cookie": await userSettings.serialize(cookie),
    },
  });
};

export default function Settings() {
  const settings: UserSettings = useLoaderData();
  const [activeTenses, setActiveTenses] = useState(settings.activeTenses);

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
      <div>
        <h1 className="text-3xl mb-4">Einstellungen</h1>
      </div>
      <div className="text-left">
        <Form
          method="post"
          onSubmit={(e) => !activeTenses.length && e.preventDefault()}
        >
          <div>
            {TENSES.map((t) => (
              <div className="my-1" key={t}>
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
              className="mr-4 underline"
              onClick={() => setActiveTenses(TENSES)}
            >
              Alle wählen
            </span>{" "}
            <span className="underline" onClick={() => setActiveTenses([])}>
              Alle entfernen
            </span>
          </div>
          <ActionButton disabled={!activeTenses.length}>
            <input
              type="submit"
              value="Speichern"
              disabled={!activeTenses.length}
            />
          </ActionButton>
        </Form>
      </div>
    </>
  );
}
