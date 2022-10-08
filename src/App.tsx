import React from "react";
import "./App.scss";

const App = () => {
  return (
    <div className="app">
      <header className="app__header">
        <h1>sarahserussi.com</h1>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main className="app__body">
        <section className="about" id="about">
          <article className="text">
            <h2 className="title">About</h2>
            <p>
              Hello, I'm Sarah. I am a software developer working at Variant in
              Trondheim. I like to knit, crochet, cook food for my daughter and
              watch trash on TV. I believe there are too few women in
              technology, and I try to do an extra effort in closing the gender
              gap in the IT industry. I am part of the{" "}
              <a href="https://tenknorge.com/">TENK</a> team in Trondheim where
              we organize{" "}
              <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a>{" "}
              which is a 2 day programming camp for 13-18 year old girls.
            </p>
          </article>
          <img
            src="/media/DALL-E_2022-10-07_22.10.59_a_dream_within_a_dream_in_a_balloon_cyberpunk.png"
            alt="A dream within a dream, DALL-E prompt"
            className="clip-circle"
          />
        </section>
        <section className="projects" id="projects">
          <h2>Projects</h2>
          <h3>TENK Tech Camp</h3>
          <p>
            <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a> is
            a 2 day programming camp for 13-18 year old girls in Norway. It is
            run in three cities (as per 2022), and consists of workshops and
            motivational talks which has the goal of inspiring more girls to
            choose technology related studies and eventually work in the IT
            industry.
          </p>
          <h3>Juno</h3>
          <p>
            I became a mom in 2021 and experienced the highs and lows of the
            fourth trimester. I was often overwhelmed with the amount of
            information and tasks needed to be done continuously in addition to
            taking care of my daughter. I was missing an app that kept track of
            all the things I needed to do in order to make my future self more
            prepared and on top of things. In the first 6 months I was in a
            bubble and couldn't really focus on anything other than my family of
            three. After some time there were less sleepless nights and also
            time to reflect and think of ideas for tools to enter this new life
            as a first-time mom.
          </p>
          <p>
            In May 2022 I was contacted by a doctor and an influencer with an
            idea to make an app for moms to help them clear out the mess in
            their head by organizing tasks, events, reminders, tips and hints
            into a digital tool.
          </p>
        </section>
        <section className="contact" id="contact">
          <h2>Contact</h2>
        </section>
      </main>
    </div>
  );
};

export default App;
