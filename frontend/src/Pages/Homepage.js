import React from "react";
import "../utils/HomePage.css";

const HomePage = () => {
  return (
    <>
      <div className="society-animations" id="societyAnimations"></div>

      <header className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">Stu-Cob-E</span>
          </h1>
          <p>
            Your go-to platform for college societies and student engagement.
          </p>
        </div>
      </header>

      <div className="main-content">
        <section className="feature">
          <h2>Society Forum</h2>
          <p>
            Societies can create and maintain official pages to share
            announcements, updates, and opportunities.
          </p>
          <ul>
            <li>
              Post information about current events, new initiatives, and
              projects.
            </li>
            <li>List temporary recruitment openings for freelance projects.</li>
          </ul>
        </section>

        <section className="feature">
          <h2>Society Events</h2>
          <p>
            Publish upcoming events with details such as date, time, location,
            and description. Tag events by category for easy filtering.
          </p>
        </section>

        <section className="feature">
          <h2>Calendar</h2>
          <p>
            The integrated calendar allows students to keep track of upcoming
            events, set reminders, and filter by society and event type.
          </p>
        </section>

        <section className="feature">
          <h2>Chat</h2>
          <p>
            Students can connect with society members and fellow students via
            direct messages. All users are verified with college email login.
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;
