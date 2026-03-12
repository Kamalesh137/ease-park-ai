import { useMemo, useState, useEffect } from "react";
import { Car, CarFront, CircleParking, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { generateSlots, type ParkingSlot, type SlotStatus, ZONES } from "@/data/mockData";

const statusConfig: Record<SlotStatus, { color: string; label: string }> = {
  available: { color: "bg-accent", label: "Available" },
  occupied: { color: "bg-destructive", label: "Occupied" },
  reserved: { color: "bg-primary", label: "Reserved" },
  disabled: { color: "bg-muted-foreground/40", label: "Disabled" },
};

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={cn("rounded-lg p-2.5", accent ?? "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", accent ? "text-primary-foreground" : "text-primary")} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [activeZone, setActiveZone] = useState<string>("all");

  useEffect(() => {
    setSlots(generateSlots());
    const interval = setInterval(() => setSlots(generateSlots()), 15000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const total = slots.length;
    const occupied = slots.filter((s) => s.status === "occupied").length;
    const available = slots.filter((s) => s.status === "available").length;
    const reserved = slots.filter((s) => s.status === "reserved").length;
    return { total, occupied, available, reserved, rate: total ? Math.round((occupied / total) * 100) : 0 };
  }, [slots]);

  const filtered = activeZone === "all" ? slots : slots.filter((s) => s.zone === activeZone);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={CircleParking} label="Total Slots" value={stats.total} sub="Across all zones" />
          <StatCard icon={Car} label="Occupied" value={stats.occupied} sub={`${stats.rate}% occupancy`} accent="bg-destructive" />
          <StatCard icon={Zap} label="Available" value={stats.available} sub="Ready for parking" accent="bg-accent" />
          <StatCard icon={AlertTriangle} label="Reserved" value={stats.reserved} sub="Pre-booked slots" accent="bg-primary" />
        </div>

        {/* Zone filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground mr-1">Zone:</span>
          {["all", ...ZONES].map((z) => (
            <button
              key={z}
              onClick={() => setActiveZone(z)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeZone === z ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {z === "all" ? "All Zones" : `Zone ${z}`}
            </button>
          ))}

          {/* Legend */}
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            {Object.entries(statusConfig).map(([key, { color, label }]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-sm", color)} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Slot grid */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Live Parking Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
              {filtered.map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "relative aspect-square rounded-md flex flex-col items-center justify-center text-[10px] font-medium transition-all cursor-default group",
                    statusConfig[slot.status].color,
                    slot.status === "available" ? "text-accent-foreground" : "",
                    slot.status === "occupied" ? "text-destructive-foreground" : "",
                    slot.status === "reserved" ? "text-primary-foreground" : "",
                    slot.status === "disabled" ? "text-muted opacity-60" : ""
                  )}
                  title={slot.vehiclePlate ? `${slot.id} — ${slot.vehiclePlate}` : slot.id}
                >
                  <CarFront className="h-3.5 w-3.5 mb-0.5 opacity-80" />
                  <span>{slot.id}</span>

                  {/* Tooltip on hover */}
                  {slot.vehiclePlate && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-card text-card-foreground border rounded-md px-2 py-1 text-[10px] shadow-card whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      {slot.vehiclePlate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently parked */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recently Parked Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slots
                .filter((s) => s.status === "occupied" && s.vehiclePlate)
                .slice(0, 8)
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-destructive/10 flex items-center justify-center">
                        <Car className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.vehiclePlate}</p>
                        <p className="text-xs text-muted-foreground">Slot {s.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {s.entryTime ? new Date(s.entryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
