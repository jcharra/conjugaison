import { ActionFunction, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import SubmitButton from "~/components/SubmitButton";
import { userSettings } from "~/cookies";
import { getSettingsFromRequest, writeRequestCookie } from "~/dataprovider";

export const action: ActionFunction = async ({ request }) => {
  const settings = await getSettingsFromRequest(request);
  const resetCookie = await writeRequestCookie(request, {
    ...settings,
    unitStep: 1,
    unitErrors: [],
    unitErrorsCorrected: [],
  });

  return redirect("/training", {
    headers: {
      "Set-Cookie": await userSettings.serialize(resetCookie),
    },
  });
};

export default function Index() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold pt-5">🇫🇷 Conjugaison 🇫🇷</h1>
      <div className="p-5">
        Entraîne tes compétences en conjugaison française
      </div>
      <Form method="post">
        <SubmitButton caption="Commencer" />
      </Form>
      <div className="mt-6 text-gray-400">
        <span>⚙</span>
        <Link className="text-sm ml-2" to="/settings">
          Préférences
        </Link>
      </div>
    </div>
  );
}
