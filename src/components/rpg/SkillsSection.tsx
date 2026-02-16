import { BookOpen } from "lucide-react";
import SectionTitle from "./SectionTitle";

export interface Skill {
  name: string;
  trained: boolean;
  bonus: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  onToggleTrained: (index: number) => void;
  onBonusChange: (index: number, value: number) => void;
}

const SkillsSection = ({ skills, onToggleTrained, onBonusChange }: SkillsSectionProps) => (
  <div>
    <SectionTitle icon={BookOpen} title="Perícias & Aptidões" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {skills.map((skill, i) => (
        <div key={skill.name} className="flex items-center gap-2 card-rpg px-3 py-2">
          <button
            onClick={() => onToggleTrained(i)}
            className={`w-4 h-4 rounded-sm border-2 flex-shrink-0 transition-colors ${
              skill.trained
                ? "bg-primary border-primary"
                : "border-muted-foreground hover:border-foreground"
            }`}
          >
            {skill.trained && (
              <svg viewBox="0 0 14 14" className="w-full h-full text-primary-foreground">
                <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className={`text-sm flex-1 truncate ${skill.trained ? "gold-text font-semibold" : "text-secondary-foreground"}`}>
            {skill.name}
          </span>
          <input
            type="number"
            value={skill.bonus}
            onChange={(e) => onBonusChange(i, Number(e.target.value))}
            className="input-rpg w-12 text-center text-xs font-bold"
          />
        </div>
      ))}
    </div>
  </div>
);

export default SkillsSection;
