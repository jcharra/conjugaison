import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold pt-5">Conjugaison</h1>
      <div className="p-5">
        Trainiere Deine französischen Konjugations-Skills
      </div>
      <Link
        className="rounded-full bg-blue-600 text-white p-3"
        to="/randomVerb"
      >
        Training starten
      </Link>
    </div>
  );
}
