import { FC } from "react";
import Container from "../../components/Container";

/*
 * Intranet — utilitarian internal employee portal. Compact utility bar (search + user chip)
 * over a dense functional navigation bar. All font-sans (Inter via the intranet theme).
 */
const navItems = ["Home", "Desk Tools", "Policies", "Directory", "Help"] as const;

const IntranetHeader: FC = () => (
  <header className="font-sans">
    {/* Top utility bar */}
    <div className="bg-primary text-white">
      <Container>
        <div className="flex flex-col gap-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-accent text-sm font-bold text-white">
              GV
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Granite View <span className="font-normal text-white/60">· Employee Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative block">
              <span className="sr-only">Search the intranet</span>
              <svg
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 3 3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search the intranet…"
                className="w-full rounded border border-white/20 bg-white/10 py-1.5 pl-8 pr-3 text-sm text-white placeholder:text-white/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                JA
              </span>
              <span className="hidden text-sm font-medium text-white/90 sm:inline">Jared Alonzo</span>
            </div>
          </div>
        </div>
      </Container>
    </div>

    {/* Main navigation bar */}
    <nav className="bg-white border-b border-muted/40">
      <Container>
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 py-1 text-sm font-medium">
          {navItems.map((item, index) => {
            const active = index === 0;
            return (
              <li key={item}>
                <a
                  href="#"
                  aria-current={active ? "page" : undefined}
                  className={`block border-b-2 px-3 py-2.5 uppercase tracking-wide transition-colors ${
                    active
                      ? "border-accent text-primary"
                      : "border-transparent text-secondary hover:text-accent"
                  }`}
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  </header>
);

export default IntranetHeader;
