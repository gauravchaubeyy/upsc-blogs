import Link from "next/link"; // Make sure Link is imported

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white p-8">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-[5rem]">
          UPSC <span className="text-blue-500">Blogs</span>
        </h1>
      </div>

      <div className="mt-8">
        <Link
          href={`/upsc-blogs`}
          className="flex h-full items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-6 text-xl font-medium
                           hover:bg-neutral-700 hover:border-blue-500 transition-colors duration-200 shadow-lg"
        >
          Blogs
        </Link>
      </div>
    </main>
  );
}