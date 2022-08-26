export default function VerbCounter({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div className="text-xl mb-4">
      {step <= total ? (
        `${step} / ${total}`
      ) : (
        <span className="text-red-400">Correction</span>
      )}
    </div>
  );
}
