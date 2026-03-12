import aiDetectionImg from "@/assets/ai-detection.png";

const steps = [
  { num: "01", title: "Capture", desc: "CCTV cameras capture real-time parking lot footage and stream it to the system." },
  { num: "02", title: "Detect", desc: "YOLOv8 model processes frames to detect vehicles and identify occupied/free slots." },
  { num: "03", title: "Track", desc: "Vehicle tracking module monitors entry/exit events and logs timestamps." },
  { num: "04", title: "Display", desc: "Frontend dashboard shows live availability, analytics, and historical data." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 bg-secondary/50">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">From Camera to Dashboard in 4 Steps</h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="shrink-0 h-12 w-12 rounded-xl bg-hero-gradient flex items-center justify-center">
                  <span className="font-display font-bold text-primary-foreground text-sm">{s.num}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <img src={aiDetectionImg} alt="AI detection visualization" className="max-w-md w-full animate-fade-in" />
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
