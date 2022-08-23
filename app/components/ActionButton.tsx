export default function ActionButton({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: JSX.Element;
}) {
  return (
    <div
      className={`mt-4 ${
        disabled ? " bg-gray-300" : "bg-blue-600 hover:bg-blue-800"
      } px-6 py-2 w-200px text-white rounded-full inline-block cursor-pointer`}
    >
      {children}
    </div>
  );
}
