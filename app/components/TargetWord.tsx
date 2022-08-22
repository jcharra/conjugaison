interface TargetWordProps {
  verb: string;
  tense: string;
  person: number;
}

export default function TargetWord({ verb, tense, person }: TargetWordProps) {
  return (
    <>
      <div className="text-3xl mb-2 border-lime-100">{verb}</div>
      <div className="text-green-400">{tense}</div>

      <div>
        {(person % 3) + 1}. Person {person > 2 ? "Plural" : "Singular"}
      </div>
    </>
  );
}
