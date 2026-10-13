import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Gift, Heart, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import cake from "@/assets/birthday-cake.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "For You — Happy birthday!" },
    { name: "description", content: "Open a birthday surprise filled with love notes, little wishes, and a little magic." },
    { property: "og:title", content: "For You — Happy birthday!" },
    { property: "og:description", content: "A birthday surprise filled with love, wishes, and a little magic." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const chapters = ["The letter", "Little love notes", "Your wishes", "With all my love"];
const notes = ["The way you make ordinary days feel extraordinary.", "Your big heart, and all the little kindnesses.", "Your laugh. Especially the one you can't hold back.", "The world is a brighter place with you in it."];
const wishes = ["A year of beautiful little beginnings.", "More belly laughs and less worrying.", "The courage to follow your biggest dreams.", "Love that finds you in the smallest moments.", "Every bit of happiness your heart can hold."];

function Index() {
  const [step, setStep] = useState(-1);
  const [letterOpen, setLetterOpen] = useState(false);
  const [note, setNote] = useState<number | null>(null);
  const [wish, setWish] = useState(-1);
  const [burst, setBurst] = useState(0);
  function celebrate() { setBurst((value) => value + 1); }
  function restart() { setStep(-1); setLetterOpen(false); setNote(null); setWish(-1); celebrate(); }

  return (
    <div className={`birthday-site chapter-${step}`}>
      <div className="confetti" key={burst} aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <i key={i} />)}</div>
      <header className="site-header">
        <a href="/" className="wordmark" aria-label="For You home"><span className="brand-heart"><Heart size={17} fill="currentColor" /></span>for you<span className="wordmark-dot">.</span></a>
        <span className="header-note">a little celebration, a lot of love</span>
        <Button variant="ghost" className="celebrate-control" onClick={celebrate} aria-label="Throw confetti" title="Throw confetti"><Sparkles size={18} /><span>Let’s celebrate</span></Button>
      </header>

      <main className="birthday-main">
        <span className="side-note side-left" aria-hidden="true">TODAY IS ALL ABOUT YOU</span>
        <span className="side-note side-right" aria-hidden="true">A LITTLE MOMENT OF MAGIC</span>

        {step === -1 && <section className="welcome scene" key="welcome">
          <div className="eyebrow"><span /> A GIFT FOR YOU <span /></div>
          <h1>Happy birthday!</h1>
          <p className="handwritten welcome-script">for being so <span>beautifully you</span></p>
          <p className="intro">Someone threw a little party just for you.</p>
          <div className="cake-stage"><span className="cake-sparkle sparkle-one">✧</span><img className="cake-image" src={cake} alt="A pink and lavender birthday cake with macarons and five glowing candles" width={1024} height={1024} /><span className="cake-sparkle sparkle-two">✧</span><span className="cake-caption handwritten">a wish is waiting for you</span><span className="caption-arrow">⤴</span></div>
          <Button variant="birthday" onClick={() => { setStep(0); celebrate(); }}><Gift size={21} />Open my gift<ArrowRight size={19} /></Button>
          <p className="made-with">a little surprise, made with <Heart size={11} fill="currentColor" /></p>
        </section>}

        {step === 0 && <section className="scene letter-scene" key="letter">
          <div className="eyebrow">WORDS FROM THE HEART</div><h1>A letter for you</h1><p className="handwritten scene-subtitle">Some things deserve to be written down.</p>
          <div className={`envelope ${letterOpen ? "is-open" : ""}`}>
            <div className="letter-paper">{letterOpen ? <><span className="handwritten salutation">Dear birthday human,</span><p>Today is a little reminder of something the world should celebrate every day: you.</p><p>Your kindness, your laughter, and your wonderfully one-of-a-kind heart make life sweeter for everyone around you.</p><p>May this next chapter bring you unexpected adventures, soft places to land, and so many reasons to smile.</p><span className="handwritten signature">With all my love ♡</span></> : <><Heart className="letter-heart" size={34} /><span className="handwritten">A few words, just for you.</span></>}</div>
            <div className="envelope-front" /><Button className="wax-seal" variant="round" onClick={() => setLetterOpen(!letterOpen)} aria-label={letterOpen ? "Close letter" : "Open letter"}>{letterOpen ? <X size={24} /> : <Heart size={25} />}</Button>
          </div>
          {!letterOpen && <Button variant="ghost" className="letter-open" onClick={() => setLetterOpen(true)}>Open the envelope <ArrowRight size={16} /></Button>}
        </section>}

        {step === 1 && <section className="scene love-scene" key="love"><div className="eyebrow">THE LITTLE THINGS</div><h1>What I love about you</h1><p className="handwritten scene-subtitle">So many reasons. Here are just a few.</p><div className="love-grid">{notes.map((text, i) => <Button key={text} variant="ghost" className={`love-note love-note-${i} ${note === i ? "revealed" : ""}`} onClick={() => setNote(note === i ? null : i)} aria-label={`Reveal love note ${i + 1}`}><span className="note-number">0{i + 1}</span>{note === i ? <span className="note-message">{text}</span> : <><Heart size={42} fill="currentColor" /><span className="handwritten">a little love note</span></>}</Button>)}</div></section>}

        {step === 2 && <section className="scene wishes-scene" key="wishes"><div className="eyebrow">MAKE A WISH</div><h1>Wishes for your new year</h1><p className="handwritten scene-subtitle">A little jar of good things to come.</p><Button variant="ghost" className="wish-jar" onClick={() => { setWish((value) => (value + 1) % wishes.length); celebrate(); }} aria-label="Open a birthday wish"><span className="jar-lid" /><span className="jar-bow">🎀</span><span className="jar-glass">{Array.from({ length: 12 }, (_, i) => <span key={i}>★</span>)}</span><span className="jar-label handwritten">wishes for you</span></Button><p className="wish-message handwritten" aria-live="polite">{wish < 0 ? "May all your wishes find their way to you." : wishes[wish]}</p><Button variant="outline" className="wish-button" onClick={() => { setWish((value) => (value + 1) % wishes.length); celebrate(); }}><Sparkles size={17} />One more wish</Button></section>}

        {step === 3 && <section className="scene finale-scene" key="finale"><div className="final-cake"><img src={cake} alt="Your birthday cake" width={1024} height={1024} /></div><div className="eyebrow">HERE’S TO YOUR NEXT CHAPTER</div><h1>Happy birthday!</h1><p className="handwritten finale-script">With all my love, always.</p><div className="final-hearts" aria-hidden="true">♡ <span>♥</span> ♡</div><Button variant="birthday" onClick={restart}><RotateCcw size={19} />Watch again</Button></section>}

        {step >= 0 && <nav className="chapter-nav" aria-label="Birthday gift chapters"><Button variant="round" onClick={() => setStep(step - 1)} aria-label="Previous chapter"><ArrowLeft size={21} /></Button><div className="chapter-progress"><span className="chapter-name">{chapters[step]}</span><div className="chapter-dots">{chapters.map((label, i) => <Button key={label} variant="ghost" className={`chapter-dot ${i === step ? "active" : ""}`} onClick={() => { setStep(i); if (i === 3) celebrate(); }} aria-label={`Go to ${label}`} aria-current={i === step ? "step" : undefined} />)}</div></div><span className="chapter-count">{step + 1}<span> / 4</span></span><Button variant="round" className="next-chapter" disabled={step === 3} onClick={() => { setStep(step + 1); if (step === 2) celebrate(); }} aria-label="Next chapter"><ArrowRight size={21} /></Button></nav>}
      </main>
      <footer className="site-footer"><span>A DAY AS SPECIAL AS YOU ARE</span><Heart size={13} /><span>MADE WITH LOVE, JUST FOR YOU</span></footer>
    </div>
  );
}
