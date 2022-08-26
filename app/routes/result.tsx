import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import HomeLink from "~/components/HomeLink";
import { getSettingsFromRequest } from "~/dataprovider";

import {
  decodeQuestion,
  DISPLAY_NAME_FOR_TENSE,
  getConjugatedForms,
  PRONOUNS,
} from "~/dataprovider";

export const loader: LoaderFunction = async ({ request }) => {
  const settings = await getSettingsFromRequest(request);

  return {
    unitErrors: settings.unitErrors,
    unitErrorsCorrected: settings.unitErrorsCorrected,
  };
};

export default function Result() {
  const { unitErrors, unitErrorsCorrected } = useLoaderData();
  const errorCount = unitErrors.length + unitErrorsCorrected.length;

  return (
    <div className="text-center">
      <h1 className="text-2xl">Évaluation</h1>
      <div className="my-2">
        Tu as fait{" "}
        <span className="font-extrabold">
          {errorCount} {errorCount === 1 ? "erreur" : "erreurs"}
        </span>
        .{errorCount === 0 && <span className="text-green-500">Bravo! 🥳</span>}
      </div>
      {unitErrorsCorrected.length > 0 && (
        <div>
          Tu as pu corriger les erreurs suivantes:
          <ErrorList items={unitErrorsCorrected} />
        </div>
      )}
      {unitErrors.length > 0 && (
        <div>
          Tu devrais revoir les verbes suivants:
          <ErrorList items={unitErrors} />
        </div>
      )}
      <HomeLink />
    </div>
  );
}

function ErrorList({ items }: { items: string[] }) {
  return (
    <div className="my-2">
      {items.map((e) => {
        const { verb, tense, person } = decodeQuestion(e);
        return (
          <div>
            <span className="font-extrabold">{verb}</span>,{" "}
            {DISPLAY_NAME_FOR_TENSE.get(tense)}, {(person % 3) + 1}. personne{" "}
            {person > 2 ? "pluriel" : "singulier"}:{" "}
            <span className="font-extrabold text-green-500">
              {PRONOUNS[person]}{" "}
              {getConjugatedForms(verb, tense, person + "")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
