import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-parking.jpg";

const HeroSection = () => (
  <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
    <div className="container relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-card animate-fade-up">
            <span className="h-2 w-2 rounded-full bg-accent" />
            AI-Powered Parking Management
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Smart Parking with{" "}
            <span className="text-gradient">Computer Vision</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Real-time vehicle detection, automated slot tracking, and intelligent analytics — powered by YOLO and deep learning models.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Play className="h-4 w-4" /> Watch Demo
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <span className="flex items-center gap-1.5"><span className="font-display font-bold text-2xl text-foreground">98%</span> Detection Accuracy</span>
            <span className="flex items-center gap-1.5"><span className="font-display font-bold text-2xl text-foreground">&lt;50ms</span> Response Time</span>
          </div>
        </div>
        <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-2xl overflow-hidden shadow-card-hover border">
            <img src={heroImg} alt="AI parking lot detection with vehicle bounding boxes" className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-card border p-4 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-sm">24</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Spots</p>
                <p className="font-display font-semibold">24 / 50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
