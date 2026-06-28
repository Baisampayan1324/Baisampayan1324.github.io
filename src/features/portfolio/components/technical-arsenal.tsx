import ScrollFloat from "@/components/ui/scroll-float";
import TechSpheres from "./tech-spheres";

export function TechnicalArsenal() {
  return (
    <section id="technical-arsenal" className="relative w-full bg-background border-t border-border/50 px-6 md:px-12 pt-24 md:pt-32 pb-0">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <ScrollFloat containerClassName="text-foreground" textClassName="text-foreground">
            Tools and frameworks I use to ship AI systems
          </ScrollFloat>
        </header>
      </div>

      {/* Scroll-driven spheres: scatter → circle → bottom arc. Hover a ball for its name. */}
      <TechSpheres />
    </section>
  );
}
