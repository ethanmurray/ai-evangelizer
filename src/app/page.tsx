import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center px-8 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Hello World!
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to the AI Evangelizer Leaderboard
          </p>
          <div className="text-lg text-gray-500 dark:text-gray-400">
            Track badges, climb the ranks, and celebrate achievements
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🏆 Leaderboard</h3>
              <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🎖️ Badges</h3>
              <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📊 Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
