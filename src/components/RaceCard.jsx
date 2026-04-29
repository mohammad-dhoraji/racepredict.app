        import React from 'react';
        import RaceStatusBadge from './RaceStatusBadge';
        import { formatDateRange } from '../lib/utils';

        const FLAG_SIZE = 'w-5 h-5 rounded-full object-cover';

        const CIRCUITS = {
        bahrain: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 100 L40 40 L70 20 L100 20 L100 50 L130 50 L130 20 L160 20 L160 60 L130 80 L100 80 L100 100 Z" />
            </svg>
        ),
        jeddah: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 100 L30 30 L60 20 L100 20 L120 40 L160 40 L170 60 L150 80 L100 80 L80 100 Z" />
            </svg>
        ),
        shanghai: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 60 Q60 20 100 30 Q140 40 130 70 Q120 100 80 90 Q50 80 70 50 L120 50" />
            </svg>
        ),
        suzuka: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 80 Q40 30 80 30 Q120 30 100 60 Q80 90 120 90 Q160 90 160 50 Q160 20 130 20" />
            </svg>
        ),
        miami: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 90 L40 40 L80 40 L80 70 L120 70 L120 30 L160 30 L160 90 Z" />
            </svg>
        ),
        montreal: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 70 L60 30 L90 30 L90 60 L120 60 L120 30 L150 30 L170 70 L140 90 L60 90 Z" />
            </svg>
        ),
        monaco: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 80 L50 30 L100 20 L120 50 L100 70 L140 90 L170 70 L160 40" />
            </svg>
        ),
        barcelona: (
            <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 80 L40 40 L70 20 L120 20 L120 50 L90 50 L90 70 L160 70 L160 100 L80 100 Z" />
            </svg>
        ),
        };

const RaceCard = ({ race, isNext }) => {
  if (!race) {
    return null;
  }
        const isCompleted = race.race_state === 'results_ready' || race.race_state === 'scored';
        const isLocked = race.race_state === 'locked';

        const cardClasses = [
            'group relative flex flex-col justify-between overflow-hidden rounded-lg border p-5 transition-all duration-200',
            'min-h-[200px]',
            isNext ? 'border-primary bg-primary/5 hover:bg-primary/8' : 'border-border bg-card hover:bg-muted/20',
            isCompleted && 'opacity-60',
            isLocked && 'opacity-40',
        ].filter(Boolean).join(' ');

        const formattedDate = formatDateRange(race.date || race.race_date);

        const flag = race.countryFlag || race.country;

        return (
            <div className={cardClasses}>
            {/* Top row */}
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Round {race.round}
                </span>
                <div className="flex items-center gap-2.5">
                    <span className={FLAG_SIZE}>{flag}</span>
                    <h3 className="font-f1 text-2xl font-black uppercase leading-none tracking-tight text-foreground">
                    {race.location}
                    </h3>
                </div>
                <p className="max-w-65 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {race.name}
                </p>
                {isCompleted && race.winner && (
                    <p className="font-mono text-sm text-primary font-semibold">
                    🏆 {race.winner}
                    </p>
                )}
                </div>
                <RaceStatusBadge status={race.race_state} isNext={isNext} />
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between pt-6">
                <span className="font-f1 text-lg font-bold uppercase tracking-wide text-foreground">
                {formattedDate}
                </span>
            </div>

            {/* Circuit outline */}
            {race.circuitId && CIRCUITS[race.circuitId] && (
                <div className="pointer-events-none absolute bottom-3 right-3 h-16 w-24 text-muted-foreground/15">
                {CIRCUITS[race.circuitId]}
                </div>
            )}
            </div>
        );
        };

        export default RaceCard;

