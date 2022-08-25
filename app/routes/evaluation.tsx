import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DisplayStats from "~/components/DisplayStats";
import LinkButton from "~/components/LinkButton";
import { getSettingsFromRequest } from "~/dataprovider";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const settings = await getSettingsFromRequest(request);

  return {
    answer: (url.searchParams.get("answer") || "").toLowerCase(),
    correct: (url.searchParams.get("correct") || "").toLowerCase(),
    stepsNeeded: settings.unitStep,
    unitLength: settings.unitLength,
    errors: settings.unitErrors,
  };
};

export default function Right() {
  const { answer, correct, stepsNeeded, unitLength, errors } = useLoaderData();
  const finished = stepsNeeded >= unitLength && errors.length === 0;

  return (
    <div className="text-center">
      {correct !== answer ? (
        <>
          <h1 className="text-3xl text-red-500">Falsch</h1>
          <div className="mt-2">
            Deine Antwort:{" "}
            <span className="font-extrabold text-red-300">{answer}</span>
          </div>
          <div className="mt-2">
            Richtig war:{" "}
            <span className="font-extrabold text-green-500">{correct}</span>
          </div>
        </>
      ) : (
        <h1 className="text-3xl text-green-400">Korrekt</h1>
      )}
      {finished && (
        <DisplayStats
          stepsNeeded={stepsNeeded}
          unitLength={unitLength}
          errors={errors}
        />
      )}
      <LinkButton
        to="/training"
        caption={!finished ? "Nächstes Verb" : "Training abschließen"}
      />
    </div>
  );
}
