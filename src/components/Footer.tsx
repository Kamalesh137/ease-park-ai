import { Car } from "lucide-react";

const Footer = () => (
  <footer className="border-t py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-display font-bold">
        <Car className="h-5 w-5 text-primary" />
        ParkVision<span className="text-primary">AI</span>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 ParkVisionAI. AI-Powered Parking System.</p>
    </div>
  </footer>
);

export default Footer;
