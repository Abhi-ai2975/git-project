export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-indigo-600 dark:text-indigo-500">MentorPlatform</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
          The open-source platform connecting developers with experienced mentors.
          Sign in to get personalized codebase reviews and mentorship.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Connect</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Find mentors that match your exact tech stack and language preferences.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Grow</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Get real feedback on your pinned repositories and coding habits.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contribute</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Become a mentor yourself and give back to the open source community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
