import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import ActionButton from "~/components/ActionButton";
import { userSettings } from "~/cookies";
import { getSettingsFromRequest, TENSES, UserSettings } from "~/dataprovider";

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
    <div>
      <h1 className="text-3xl mb-4">Einstellungen</h1>
      <Form method="post">
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
              <label htmlFor={t}>{t}</label>
            </div>
          ))}
        </div>
        <ActionButton>
          <input type="submit" value="Speichern" />
        </ActionButton>
      </Form>
    </div>
  );
}
