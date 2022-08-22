interface TargetWordProps {
  verb: string;
  tense: string;
  person: number;
}

const pronouns = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

export default function TargetWord({ verb, tense, person }: TargetWordProps) {
  return (
    <>
      <div className="text-3xl mb-2 border-lime-100">{verb}</div>
      <div className="text-green-400 font-extrabold">{tense}</div>

      <div>
        {(person % 3) + 1}. Person {person > 2 ? "Plural" : "Singular"}
      </div>
      <div className="font-bold">{pronouns[person]} ...</div>
    </>
  );
}
