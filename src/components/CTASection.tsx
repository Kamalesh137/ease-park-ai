import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section id="contact" className="py-20">
    <div className="container">
      <div className="bg-hero-gradient rounded-2xl p-10 md:p-16 text-center text-primary-foreground">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Automate Your Parking?</h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
          Deploy the AI Parking System in your lot and start saving time, reducing costs, and improving the parking experience.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" className="gap-2">
            Request a Demo <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
