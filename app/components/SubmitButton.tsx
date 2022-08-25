export default function SubmitButton({
  caption,
  disabled,
}: {
  caption: string;
  disabled: boolean;
}) {
  return (
    <button
      className={`mt-4 ${
        disabled ? " bg-gray-300" : "bg-blue-600 hover:bg-blue-800"
      } px-6 py-2 w-200px text-white rounded-full inline-block cursor-pointer`}
    >
      <input type="submit" value={caption} disabled={disabled} />
    </button>
  );
}
