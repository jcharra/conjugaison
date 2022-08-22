import { Link } from "@remix-run/react";
import ActionButton from "~/components/ActionButton";

export default function Index() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold pt-5">Conjugaison</h1>
      <div className="p-5">
        Trainiere Deine französischen Konjugations-Skills
      </div>
      <ActionButton>
        <Link to="/randomVerb">Training starten</Link>
      </ActionButton>
    </div>
  );
}
