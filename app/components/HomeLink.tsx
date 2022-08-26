import { Link } from "@remix-run/react";

export default function HomeLink() {
  return (
    <div className="mt-6 text-gray-400">
      <span>🏠</span>
      <Link className="text-sm ml-2" to="/">
        Home
      </Link>
    </div>
  );
}
