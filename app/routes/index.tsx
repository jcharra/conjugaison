import { Link } from "@remix-run/react";
import LinkButton from "~/components/LinkButton";

export default function Index() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold pt-5">🇫🇷 Conjugaison 🇫🇷</h1>
      <div className="p-5">
        Trainiere Deine französischen Konjugations-Skills
      </div>
      <LinkButton to="/training" caption="Training starten" />
      <div className="mt-6 text-gray-400">
        <span>⚙</span>
        <Link className="text-sm ml-2" to="/settings">
          Einstellungen
        </Link>
      </div>
    </div>
  );
}
