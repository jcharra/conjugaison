import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LinkButton from "~/components/LinkButton";
import { getSettingsFromRequest } from "~/dataprovider";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const settings = await getSettingsFromRequest(request);

  return {
    answer: (url.searchParams.get("answer") || "").toLowerCase(),
    correct: (url.searchParams.get("correct") || "").toLowerCase(),
    settings: settings,
  };
};

export default function Right() {
  const { answer, correct, settings } = useLoaderData();
  const { unitStep, unitLength, unitErrors, untilNoErrors } = settings;
  const finished =
    unitStep >= unitLength && (unitErrors.length === 0 || !untilNoErrors);

  return (
    <div className="text-center">
      {correct !== answer ? (
        <>
          <h1 className="text-3xl text-red-500">Mauvaise réponse</h1>
          <div className="mt-2">
            Ta réponse:{" "}
            <span className="font-extrabold text-red-300">{answer}</span>
          </div>
          <div className="mt-2">
            Bonne réponse:{" "}
            <span className="font-extrabold text-green-500">{correct}</span>
          </div>
        </>
      ) : (
        <h1 className="text-3xl text-green-400">Bonne réponse 👍🏼</h1>
      )}
      {finished ? (
        <>
          <LinkButton to="/result" caption={"Terminer l'entraînement"} />
        </>
      ) : (
        <LinkButton to="/training" caption={"Verbe suivant"} />
      )}
    </div>
  );
}
