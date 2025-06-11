import Link from "next/link"; // Make sure Link is imported

export default function HomePage() {
  const TOPICS = [
    { name: "Prelims", slug: "prelims" },
    { name: "Mains", slug: "mains" },
    { name: "Interview", slug: "interview" },
    { name: "General Questions", slug: "general-questions" },
    { name: "Current Affairs", slug: "current-affairs" },
  ]; 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white p-8">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-[5rem]">
          UPSC <span className="text-blue-400">Blogs</span>
        </h1>
        <p className="text-lg text-neutral-300">
          Explore articles on various UPSC exam topics.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Browse Topics:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic) => (
            <li key={topic.slug} className="w-full">
              <Link
                href={`/blog/${topic.slug}`}
                className="flex h-full items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-6 text-xl font-medium
                           hover:bg-neutral-700 hover:border-blue-500 transition-colors duration-200 shadow-lg"
              >
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}