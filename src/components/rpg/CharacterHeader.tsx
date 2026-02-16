interface CharacterHeaderProps {
  data: {
    nome: string;
    vulgo: string;
    raca: string;
    origem: string;
    jogador: string;
    habilidadeRacial: string;
    classe: string;
  };
  onChange: (field: string, value: string) => void;
}

const Field = ({
  label,
  value,
  onChange,
  span = 1,
  large = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  span?: number;
  large?: boolean;
}) => (
  <div className={span === 2 ? "md:col-span-2" : ""}>
    <label className="block text-xs font-display uppercase tracking-widest text-muted-foreground mb-1.5">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input-rpg w-full ${large ? "text-xl font-display font-bold gold-text" : "text-sm"}`}
    />
  </div>
);

const CharacterHeader = ({ data, onChange }: CharacterHeaderProps) => (
  <div className="card-rpg p-5">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Field label="Nome do Personagem" value={data.nome} onChange={(v) => onChange("nome", v)} span={2} large />
      <Field label="Vulgo" value={data.vulgo} onChange={(v) => onChange("vulgo", v)} />
      <Field label="Classe" value={data.classe} onChange={(v) => onChange("classe", v)} />
      <Field label="Raça" value={data.raca} onChange={(v) => onChange("raca", v)} />
      <Field label="Origem" value={data.origem} onChange={(v) => onChange("origem", v)} />
      <Field label="Jogador" value={data.jogador} onChange={(v) => onChange("jogador", v)} />
      <Field label="Habilidade Racial" value={data.habilidadeRacial} onChange={(v) => onChange("habilidadeRacial", v)} />
    </div>
  </div>
);

export default CharacterHeader;
