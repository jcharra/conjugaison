import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold p-5">Conjugaison</h1>
      <Link to="/randomVerb">Zufälliges Verb</Link>
    </div>
  );
}
