interface SurvivalTrackProps {
  label: string;
  total: number;
  filled: number;
  color: string;
  onToggle: (index: number) => void;
}

const SurvivalTrack = ({ label, total, filled, color, onToggle }: SurvivalTrackProps) => (
  <div className="card-rpg p-4">
    <span className="block text-xs font-display uppercase tracking-widest text-muted-foreground mb-3">
      {label}
    </span>
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onToggle(i)}
          className={`w-8 h-8 rounded border-2 transition-all duration-150 ${
            i < filled
              ? `${color} border-transparent scale-105`
              : "bg-secondary border-border hover:border-muted-foreground"
          }`}
        />
      ))}
    </div>
    <span className="block text-xs text-muted-foreground mt-2">
      {filled} / {total}
    </span>
  </div>
);

export default SurvivalTrack;
