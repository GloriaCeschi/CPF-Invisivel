import { useState } from "react";
import { Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";

const filters = [
  { id: "none", label: "Normal" },
  { id: "protanopia", label: "Protanopia" },
  { id: "deuteranopia", label: "Deuteranopia" },
  { id: "tritanopia", label: "Tritanopia" },
];

export function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("none");
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);

  const applyFilter = (id: string) => {
    const html = document.documentElement;
    html.classList.remove("a11y-protanopia", "a11y-deuteranopia", "a11y-tritanopia");
    if (id !== "none") html.classList.add(`a11y-${id}`);
    setActiveFilter(id);
  };

  const toggleContrast = () => {
    document.documentElement.classList.toggle("a11y-high-contrast");
    setHighContrast(!highContrast);
  };

  const toggleFont = () => {
    document.documentElement.classList.toggle("a11y-large-font");
    setLargeFont(!largeFont);
  };

  return (
    <>
      {/* SVG filters for color blindness simulation */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setOpen(!open)}
          className="rounded-l-lg rounded-r-none bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 h-12 w-10"
          size="icon"
        >
          <Accessibility className="h-5 w-5" />
        </Button>

        {open && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-56 rounded-lg border border-border bg-card p-4 shadow-xl animate-scale-in">
            <p className="mb-3 text-sm font-semibold text-foreground">Acessibilidade</p>

            <div className="mb-3">
              <p className="mb-1 text-xs text-muted-foreground">Filtros de cor</p>
              <div className="flex flex-col gap-1">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => applyFilter(f.id)}
                    className={`rounded px-2 py-1 text-xs text-left transition-colors ${
                      activeFilter === f.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={toggleContrast}
                className={`rounded px-2 py-1 text-xs text-left transition-colors ${
                  highContrast ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                }`}
              >
                Alto Contraste
              </button>
              <button
                onClick={toggleFont}
                className={`rounded px-2 py-1 text-xs text-left transition-colors ${
                  largeFont ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                }`}
              >
                Fonte Ampliada
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
