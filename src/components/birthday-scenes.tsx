import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import cakeUnlit from "@/assets/birthday-cake-unlit.png";
import turntable from "@/assets/birthday-turntable.png";
import { birthdayConfig } from "@/birthday-config";
import { breathStrength, candlesAfterProgress, HOLD_DURATION_MS } from "@/lib/birthday-candles";

export function SongScene() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    try { await player.play(); setError(""); }
    catch { setError("This song couldn’t play. Please try again."); }
  }
  return <section className="scene song-scene">
    <Button variant="ghost" className={`turntable-control ${playing ? "is-playing" : ""}`} onClick={toggle} aria-label={playing ? "Pause song" : "Play song"}><img src={turntable} alt="Pink record player with a lavender vinyl and a heart" width={1024} height={1024} /><span className="record-light" aria-hidden="true" /></Button>
    <div className="moment-copy"><div className="eyebrow">PRESS PLAY</div><h1>Our song</h1><div className="song-controls"><Button variant="round" className="song-play" onClick={toggle} aria-label={playing ? "Pause song" : "Play song"}>{playing ? <Pause /> : <Play />}</Button><span>{birthdayConfig.song.title}</span><Button variant="ghost" size="icon" aria-label="Restart song" title="Restart song" onClick={() => { if (audio.current) audio.current.currentTime = 0; }}><RotateCcw /></Button></div>{error && <p role="alert">{error}</p>}</div>
    <audio ref={audio} src={birthdayConfig.song.src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError("The song is unavailable. Check your configured song file."); }} />
  </section>;
}

export function CandleScene({ onCelebrate }: { onCelebrate: () => void }) {
  const [remaining, setRemaining] = useState(5);
  const [holding, setHolding] = useState(false);
  const [listening, setListening] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const progress = useRef(0);
  const frame = useRef(0);
  const stopMicrophone = useRef<() => void>(() => {});
  const mounted = useRef(true);
  const completed = useRef(false);
  const celebrate = useRef(onCelebrate);
  celebrate.current = onCelebrate;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; cancelAnimationFrame(frame.current); stopMicrophone.current(); }; }, []);
  function advance(amount: number) {
    if (completed.current) return;
    progress.current = Math.min(1, progress.current + amount);
    const count = candlesAfterProgress(progress.current); setRemaining(count);
    if (count === 0) { completed.current = true; cancelAnimationFrame(frame.current); stopMicrophone.current(); setListening(false); setHolding(false); celebrate.current(); }
  }
  function stopHold() { cancelAnimationFrame(frame.current); setHolding(false); }
  function startHold() {
    if (completed.current) return;
    stopMicrophone.current(); setListening(false); cancelAnimationFrame(frame.current); setHolding(true);
    let previous = performance.now();
    function tick(time: number) { advance((time - previous) / HOLD_DURATION_MS); previous = time; if (!completed.current) frame.current = requestAnimationFrame(tick); }
    frame.current = requestAnimationFrame(tick);
  }
  async function microphone() {
    if (listening) { stopMicrophone.current(); setListening(false); return; }
    setRequesting(true); setMessage("");
    let stream: MediaStream | undefined; let context: AudioContext | undefined;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unavailable");
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      if (!mounted.current) { stream.getTracks().forEach(track => track.stop()); return; }
      context = new AudioContext(); await context.resume();
      if (!mounted.current) { stream.getTracks().forEach(track => track.stop()); await context.close(); return; }
      const analyser = context.createAnalyser(); analyser.fftSize = 1024;
      const source = context.createMediaStreamSource(stream); source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const activeStream = stream; const activeContext = context;
      let stopped = false; let timeout = 0;
      stopMicrophone.current = () => { if (stopped) return; stopped = true; cancelAnimationFrame(frame.current); window.clearTimeout(timeout); source.disconnect(); activeStream.getTracks().forEach(track => track.stop()); void activeContext.close(); };
      timeout = window.setTimeout(() => { stopMicrophone.current(); if (mounted.current) { setListening(false); setMessage("Try again, or use Hold to blow out the candles."); } }, 30000);
      setListening(true); let previous = performance.now();
      function analyse(time: number) { if (stopped || !mounted.current) return; analyser.getByteTimeDomainData(samples); if (breathStrength(samples) > .07) advance(Math.min(100, time - previous) / 1000); previous = time; if (!completed.current && !stopped) frame.current = requestAnimationFrame(analyse); }
      frame.current = requestAnimationFrame(analyse);
    } catch { stream?.getTracks().forEach(track => track.stop()); if (context && context.state !== "closed") void context.close(); if (mounted.current) setMessage("Microphone access is unavailable. Use Hold instead."); }
    finally { if (mounted.current) setRequesting(false); }
  }
  return <section className={`scene candles-scene ${remaining === 0 ? "candles-out" : ""}`}>
    <div className="candle-cake"><img src={cakeUnlit} alt={remaining === 0 ? "Birthday cake with all candles blown out" : `Birthday cake with ${remaining} glowing candles`} width={1024} height={1024} /><div className="cake-flames" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`flame flame-${i} ${i < 5 - remaining ? "extinguished" : ""}`} />)}</div></div>
    <div className="moment-copy"><div className="candle-heading"><div className="eyebrow">MAKE A WISH</div><span aria-label={`${remaining} candles lit`} className="mini-candles">{Array.from({ length: 5 }, (_, i) => <span className={i < remaining ? "lit" : ""} key={i}>▮</span>)}</span></div><h1>Blow out the candles</h1>
      {remaining > 0 ? <><div className="blow-controls"><Button variant="birthday" onClick={microphone} disabled={requesting || holding}><Mic />{requesting ? "Connecting…" : listening ? "Stop listening" : "Microphone"}</Button><Button variant="outline" className={`hold-control ${holding ? "is-holding" : ""}`} disabled={requesting} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); startHold(); }} onPointerUp={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold} onKeyDown={event => { if ((event.key === " " || event.key === "Enter") && !event.repeat) { event.preventDefault(); startHold(); } }} onKeyUp={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); stopHold(); } }} onBlur={stopHold}><Wind />{holding ? "Blowing…" : "Hold"}</Button></div><p className="mic-privacy">The microphone only listens for your breath, right here on your device. Nothing is recorded.</p></> : <div className="candles-success"><p className="handwritten">Your wish is on its way. ♡</p><Button variant="outline" onClick={() => { progress.current = 0; completed.current = false; setRemaining(5); setMessage(""); }}><RotateCcw />Light the candles again</Button></div>}
      <p className="candle-status" role="status">{message || (listening ? "Listening… Make a wish and gently blow." : remaining === 0 ? "All five candles are out!" : "")}</p>
    </div>
  </section>;
}