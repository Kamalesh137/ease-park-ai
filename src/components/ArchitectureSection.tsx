import { Folder, FileCode, Server, Monitor, Database, Settings, FileText, TestTube } from "lucide-react";

const folders = [
  { icon: Folder, name: "data/", desc: "Images, videos & dataset labels for training", color: "text-primary" },
  { icon: FileCode, name: "models/", desc: "Trained YOLO/CNN model weights & configs", color: "text-accent" },
  { icon: FileCode, name: "src/", desc: "Detection, tracking & processing modules", color: "text-primary" },
  { icon: Server, name: "api/", desc: "Flask/FastAPI REST endpoints", color: "text-accent" },
  { icon: Monitor, name: "frontend/", desc: "Web dashboard for monitoring", color: "text-primary" },
  { icon: Database, name: "database/", desc: "Parking records & slot availability", color: "text-accent" },
  { icon: Settings, name: "config/", desc: "Camera & model settings (YAML)", color: "text-primary" },
  { icon: TestTube, name: "tests/", desc: "Unit tests for all modules", color: "text-accent" },
];

const ArchitectureSection = () => (
  <section id="architecture" className="py-20">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-2">Architecture</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Clean Project Structure</h2>
        <p className="text-muted-foreground">Modular, production-ready folder structure for computer vision + web-based parking systems.</p>
      </div>
      <div className="max-w-3xl mx-auto bg-card rounded-2xl border shadow-card overflow-hidden">
        <div className="bg-secondary/70 px-6 py-3 border-b flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/60" />
            <span className="h-3 w-3 rounded-full bg-accent/40" />
            <span className="h-3 w-3 rounded-full bg-accent/60" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">AI_Parking_System/</span>
        </div>
        <div className="divide-y">
          {folders.map((f, i) => (
            <div key={f.name} className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <f.icon className={`h-5 w-5 ${f.color} shrink-0`} />
              <div className="min-w-0">
                <p className="font-mono font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t bg-secondary/30 flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
          <span>requirements.txt</span>
          <span>README.md</span>
          <span>run.py</span>
        </div>
      </div>
    </div>
  </section>
);

export default ArchitectureSection;
