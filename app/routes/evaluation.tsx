import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  return {
    answer: (url.searchParams.get("answer") || "").toLowerCase(),
    correct: (url.searchParams.get("correct") || "").toLowerCase(),
  };
};

export default function Right() {
  const { answer, correct } = useLoaderData();

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
        <h1 className="text-3xl text-green-400">Korrekt!</h1>
      )}
      <div className="text-orange-500 rounded-full mt-2">
        <Link to="/randomVerb">Nächstes Verb</Link>
      </div>
    </div>
  );
}
