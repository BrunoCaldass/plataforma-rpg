import { Shield } from "lucide-react";
import SectionTitle from "./SectionTitle";

interface ArmorSectionProps {
  armor: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const ARMOR_PIECES = [
  { key: "elmo", label: "Elmo" },
  { key: "bracelete", label: "Bracelete" },
  { key: "peitoral", label: "Peitoral" },
  { key: "grevas", label: "Grevas" },
  { key: "botas", label: "Botas" },
];

const ArmorSection = ({ armor, onChange }: ArmorSectionProps) => (
  <div>
    <SectionTitle icon={Shield} title="Armadura" />
    <div className="space-y-3">
      {ARMOR_PIECES.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between card-rpg px-4 py-2.5">
          <span className="text-sm font-display tracking-wide text-secondary-foreground">{label}</span>
          <input
            type="number"
            value={armor[key] ?? 0}
            onChange={(e) => onChange(key, Number(e.target.value))}
            className="input-rpg w-16 text-center text-sm font-bold"
          />
        </div>
      ))}
    </div>
  </div>
);

export default ArmorSection;
