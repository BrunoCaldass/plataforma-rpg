import { Heart, Brain } from "lucide-react";

interface StatusSectionProps {
  vigor: { atual: number; max: number };
  sanidade: { atual: number; max: number };
  observacoes: string;
  onVigorChange: (field: "atual" | "max", v: number) => void;
  onSanidadeChange: (field: "atual" | "max", v: number) => void;
  onObservacoesChange: (v: string) => void;
}

const StatBar = ({
  label,
  icon: Icon,
  atual,
  max,
  color,
  onChange,
}: {
  label: string;
  icon: typeof Heart;
  atual: number;
  max: number;
  color: string;
  onChange: (field: "atual" | "max", v: number) => void;
}) => (
  <div className="card-rpg p-4">
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={atual}
        onChange={(e) => onChange("atual", Number(e.target.value))}
        className="input-rpg w-20 text-center text-xl font-bold"
      />
      <span className="text-muted-foreground font-display">/</span>
      <input
        type="number"
        value={max}
        onChange={(e) => onChange("max", Number(e.target.value))}
        className="input-rpg w-20 text-center text-xl font-bold"
      />
    </div>
    <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color === "text-health" ? "bg-health" : "bg-sanity"}`}
        style={{ width: `${max > 0 ? Math.min((atual / max) * 100, 100) : 0}%` }}
      />
    </div>
  </div>
);

const StatusSection = ({
  vigor,
  sanidade,
  observacoes,
  onVigorChange,
  onSanidadeChange,
  onObservacoesChange,
}: StatusSectionProps) => (
  <div className="space-y-4">
    <StatBar label="Vigor" icon={Heart} atual={vigor.atual} max={vigor.max} color="text-health" onChange={onVigorChange} />
    <StatBar label="Sanidade" icon={Brain} atual={sanidade.atual} max={sanidade.max} color="text-sanity" onChange={onSanidadeChange} />
    <div className="card-rpg p-4">
      <label className="block text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
        Observações
      </label>
      <textarea
        value={observacoes}
        onChange={(e) => onObservacoesChange(e.target.value)}
        rows={4}
        className="input-rpg w-full resize-none text-sm"
      />
    </div>
  </div>
);

export default StatusSection;
