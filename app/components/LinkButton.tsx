import { Link } from "@remix-run/react";

export default function LinkButton({
  to,
  caption,
}: {
  to: string;
  caption: string;
}) {
  return (
    <Link
      className="mt-4 bg-blue-600 hover:bg-blue-800 px-6 py-2 w-200px text-white rounded-full inline-block cursor-pointer"
      to={to}
    >
      {caption}
    </Link>
  );
}
