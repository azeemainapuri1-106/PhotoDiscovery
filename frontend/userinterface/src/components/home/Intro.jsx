import './Intro.css'

// The big "Find your next thing." hero section. Static content for now.
export default function Intro() {
  return (
    <section className="intro" aria-labelledby="page-title">
      <div className="intro__eyebrow">
        <span className="intro__eyebrow-line" />
        A little inspiration, every day
      </div>
      <div className="intro__heading-row">
        <div>
          <h1 id="page-title">
            Find your <em>next</em> thing.
          </h1>
          <p className="intro__description">
            A considered collection of photographs for wherever your curiosity
            takes you.
          </p>
        </div>
        <div className="intro__note" aria-label="Curated by people, for people">
          <span className="intro__note-mark">✳</span>
          <span>
            Curated with care
            <br />
            <strong>Made to be kept</strong>
          </span>
        </div>
      </div>
    </section>
  )
}
