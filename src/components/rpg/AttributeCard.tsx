interface AttributeCardProps {
  name: string;
  value: number;
  onChange: (v: number) => void;
}

const getModifier = (val: number) => {
  const mod = Math.floor((val - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const AttributeCard = ({ name, value, onChange }: AttributeCardProps) => (
  <div className="card-rpg p-4 flex flex-col items-center gap-2 group hover:border-gold-dim transition-colors">
    <span className="text-xs font-display uppercase tracking-widest text-muted-foreground group-hover:gold-text transition-colors">
      {name}
    </span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="input-rpg w-16 h-16 text-center text-2xl font-display font-bold gold-text"
    />
    <span className="text-xs font-bold bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
      {getModifier(value)}
    </span>
  </div>
);

export default AttributeCard;
