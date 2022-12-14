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
            <h2 className="title">Hello, I'm Sarah 👋🏼</h2>
            <p>
              I am a software developer working at Variant in Trondheim. I like
              to knit, crochet, cook food for my daughter and watch trash on TV.
              I believe there are too few women in technology, and I try to do
              an extra effort in closing the gender gap in the IT industry. I am
              part of the <a href="https://tenknorge.com/">TENK</a> team in
              Trondheim where we organize{" "}
              <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a>{" "}
              which is a 2 day programming camp for 13-18 year old girls.
            </p>
          </article>
          <img
            src="/media/sarah-lilla.jpg"
            alt="Sarah"
            className="clip-circle"
          />
        </section>
        <section className="projects" id="projects">
          <h2>Projects</h2>
          <article className="card">
            <h3>TENK Tech Camp</h3>
            <p>
              <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a>{" "}
              is a 2 day programming camp for 13-18 year old girls in Norway. It
              is run in three cities (as per 2022), and consists of workshops
              and motivational talks which has the goal of inspiring more girls
              to choose technology related studies and eventually work in the IT
              industry.
            </p>
          </article>
          <article className="card">
            <h3>Dukkling</h3>
            <p>
              I became a mom in 2021 and experienced the highs and lows of the
              fourth trimester. I was often overwhelmed with the amount of
              information and tasks needed to be done continuously in addition
              to taking care of my daughter. I was missing an app that kept
              track of all the things I needed to do in order to make my future
              self more prepared and on top of things. In the first 6 months I
              was in a bubble and couldn't really focus on anything other than
              my family of three. After some time there were less sleepless
              nights and also time to reflect and think of ideas for tools to
              enter this new life as a first-time mom.
              <br />
              <br />
              In May 2022 I was contacted by a doctor and an influencer with an
              idea to make an app for moms to help them clear out the mess in
              their head by organizing tasks, events, reminders, tips and hints
              into a digital tool. Now we are a team of four working on creating
              this app temorarily (or permanently) called{" "}
              <a href="https://dukkling.com">Dukkling</a>.
            </p>
          </article>
          <article className="card">
            <h3>FoodforSophia</h3>
            <p>
              I run an Instagram account called{" "}
              <a href="https://www.instagram.com/foodforsophia/">
                @foodforSophia
              </a>{" "}
              where I share the food Sophia eats. She has both milk allergy and
              egg allergy, so we are making almost all food from scratch. We try
              to eat more organic and less ultra-processed food.
            </p>
            <div className="card__images">
              <img
                src="/media/foodforsophia.png"
                alt="Food Sophia eats"
                className="clip-circle"
              />
            </div>
          </article>
          <article className="card">
            <h3>Knitting and crocheting</h3>
            <div className="card__images">
              <img
                src="/media/DALL-E_2022-10-07_22.10.59_a_dream_within_a_dream_in_a_balloon_cyberpunk.png"
                alt="DALL-E: A dream within a dream in a balloon."
                className="clip-circle"
              />
              <img
                src="/media/DALL-E_2022-10-07_22.11.09_a_dream_within_a_dream_in_a_balloon_2_cyberpunk.png"
                alt="DALL-E: A dream within a dream in a balloon."
                className="clip-circle"
              />
              <img
                src="media/DALL-E_2022-10-07_22.10.24_a_dream_within_a_dream_in_an_ocean_cyberpunk.png"
                alt="DALL-E: A dream within a dream in an ocean."
                className="clip-circle"
              />
            </div>
          </article>
        </section>
        <section className="contact" id="contact">
          <h2>Contact</h2>
          <p>
            ✉️ E-mail:{" "}
            <a href="mailto:sarah.serussi@gmail.com">sarah.serussi@gmail.com</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
