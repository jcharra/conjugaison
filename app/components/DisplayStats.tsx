import { decodeQuestion, DISPLAY_NAME_FOR_TENSE } from "~/dataprovider";

export default function DisplayStats({
  errors,
  errorsCorrected,
}: {
  errors: string[];
  errorsCorrected: string[];
}) {
  const errorCount = errors.length + errorsCorrected.length;

  return (
    <div className="mt-6">
      <h1 className="text-2xl">Auswertung</h1>
      <div className="my-2">
        Du hast <span className="font-extrabold">{errorCount} Fehler</span>{" "}
        gemacht.{" "}
        {errorCount === 0 && <span className="text-green-500">Bravo! 🥳</span>}
      </div>
      {errorsCorrected.length > 0 && (
        <div>
          Folgende Fehler hast Du korrigieren können:
          <ErrorList items={errorsCorrected} />
        </div>
      )}
      {errors.length > 0 && (
        <div>
          Folgende Verben solltest Du nochmal anschauen:
          <ErrorList items={errors} />
        </div>
      )}
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
            {DISPLAY_NAME_FOR_TENSE.get(tense)}, {(person % 3) + 1}. Person{" "}
            {person > 2 ? "Plural" : "Singular"}
          </div>
        );
      })}
    </div>
  );
}
