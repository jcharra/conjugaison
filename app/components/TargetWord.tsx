import { DISPLAY_NAME_FOR_TENSE, PRONOUNS } from "~/dataprovider";

interface TargetWordProps {
  verb: string;
  tense: string;
  person: number;
  currentInput: string;
}

const startsWithVocal = (s: string) => {
  return (
    ["a", "e", "i", "o", "u", "è", "é", "ê", "â", "û", "î", "ô", "y"].indexOf(
      s[0]
    ) > -1
  );
};

export default function TargetWord({
  verb,
  tense,
  person,
  currentInput,
}: TargetWordProps) {
  let intro = PRONOUNS[person];

  if (person === 0 && startsWithVocal(currentInput)) {
    intro = "J'";
  }

  return (
    <>
      <div className="text-3xl mb-2 border-lime-100">{verb}</div>
      <div className="text-green-400 font-extrabold">
        {DISPLAY_NAME_FOR_TENSE.get(tense) || tense}
      </div>

      <div>
        {(person % 3) + 1}. personne {person > 2 ? "pluriel" : "singulier"}
      </div>
      <div className="font-bold">{intro} ...</div>
    </>
  );
}
