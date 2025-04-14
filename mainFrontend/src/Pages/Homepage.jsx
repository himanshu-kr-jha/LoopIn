import React from "react";

const HomePage = () => {
  return (
    <>
      {/* Optional: Background animation container */}
      <div id="societyAnimations" className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-100" />

      {/* Hero Section */}
      <header className="bg-blue-950 text-white py-20 text-center shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to <span className="text-cyan-400">Stu-Cob-E</span>
          </h1>
          <p className="text-lg sm:text-xl">
            Your go-to platform for college societies and student engagement.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6 sm:px-12 lg:px-24 bg-white text-gray-800 space-y-16">
        {/* Feature Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900">Society Forum</h2>
          <p className="text-gray-700">
            Societies can create and maintain official pages to share announcements,
            updates, and opportunities.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Post information about current events, new initiatives, and projects.
            </li>
            <li>List temporary recruitment openings for freelance projects.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900">Society Events</h2>
          <p className="text-gray-700">
            Publish upcoming events with details such as date, time, location, and
            description. Tag events by category for easy filtering.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900">Calendar</h2>
          <p className="text-gray-700">
            The integrated calendar allows students to keep track of upcoming events,
            set reminders, and filter by society and event type.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900">Chat</h2>
          <p className="text-gray-700">
            Students can connect with society members and fellow students via direct
            messages. All users are verified with college email login.
          </p>
        </section>
      </main>
    </>
  );
};

export default HomePage;
