import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">Not found</h1>
      <p className="text-muted mb-6">That anime or episode doesn't exist — or Consumet couldn't find it.</p>
      <Link href="/" className="text-accent hover:text-accentHover">← Back home</Link>
    </div>
  );
}
