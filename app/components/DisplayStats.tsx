export default function DisplayStats({
  stepsNeeded,
  unitLength,
  errors,
}: {
  stepsNeeded: number;
  unitLength: number;
  errors: string[];
}) {
  return (
    <div>
      <h1>STATS</h1>
      <div>Fehler: {stepsNeeded - unitLength}</div>
    </div>
  );
}
