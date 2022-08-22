export default function ActionButton({ children }: { children: JSX.Element }) {
  return (
    <div className="mt-4 bg-blue-600 px-6 py-2 w-200px text-white rounded-full inline-block">
      {children}
    </div>
  );
}
