import { Users, Share2, MessageSquare } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="container mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          What is Corclo?
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Everything you need in a modern social platform.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Fitur 1 */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <Users className="h-10 w-10 text-blue-400" />
          <h3 className="mt-4 text-xl font-semibold">Connect</h3>
          <p className="mt-2 text-gray-400">
            Find and connect with people who share your interests.
          </p>
        </div>
        {/* Fitur 2 */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <Share2 className="h-10 w-10 text-green-400" />
          <h3 className="mt-4 text-xl font-semibold">Share</h3>
          <p className="mt-2 text-gray-400">
            Share your moments, thoughts, and creations easily.
          </p>
        </div>
        {/* Fitur 3 */}
        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <MessageSquare className="h-10 w-10 text-purple-400" />
          <h3 className="mt-4 text-xl font-semibold">Discover</h3>
          <p className="mt-2 text-gray-400">
            Discover new content, trends, and communities.
          </p>
        </div>
      </div>
    </section>
  );
}