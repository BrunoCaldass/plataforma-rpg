import { useState } from "react";
import { Save, Scroll, Swords, Shield, Footprints } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CharacterHeader from "@/components/rpg/CharacterHeader";
import AttributeCard from "@/components/rpg/AttributeCard";
import ArmorSection from "@/components/rpg/ArmorSection";
import StatusSection from "@/components/rpg/StatusSection";
import SurvivalTrack from "@/components/rpg/SurvivalTrack";
import SkillsSection, { Skill } from "@/components/rpg/SkillsSection";
import SectionTitle from "@/components/rpg/SectionTitle";

const SKILL_NAMES = [
  "Arremesso","Armadilhas","Camuflagem","Mentalidade","Artes Marciais","Atletismo",
  "Luta","Conhecimento","Engenharia","Condução","Cosmologia","Intuição",
  "Atuação","Acrobacia","Furtividade","História","Investigação","Animais",
  "Diplomacia","Medicina","Enganação","Iniciativa","Mecânica","Mineração",
  "Intimidação","Pontaria","Percepção","Natureza","Reflexo","Tática",
  "Religião","Roubo","Avaliação","Sobrevivência",
];

const Index = () => {
  const { toast } = useToast();

  const [header, setHeader] = useState({
    nome: "Tharion Corvobreu",
    vulgo: "O Cinzento",
    raca: "Meio-Elfo",
    origem: "Floresta Sombria",
    jogador: "Lucas",
    habilidadeRacial: "Visão no Escuro",
    classe: "Ranger das Sombras",
  });

  const [attributes, setAttributes] = useState({
    forca: 14,
    agilidade: 16,
    intelecto: 12,
    sabedoria: 15,
    carisma: 10,
    constituicao: 13,
  });

  const [armor, setArmor] = useState({
    elmo: 2, bracelete: 1, peitoral: 4, grevas: 2, botas: 1,
  });

  const [vigor, setVigor] = useState({ atual: 28, max: 35 });
  const [sanidade, setSanidade] = useState({ atual: 18, max: 22 });
  const [observacoes, setObservacoes] = useState("Ferimento no ombro esquerdo. Carrega um amuleto élfico.");

  const [sanidadeTrack, setSanidadeTrack] = useState(6);
  const [fomeTrack, setFomeTrack] = useState(3);

  const [skills, setSkills] = useState<Skill[]>(
    SKILL_NAMES.map((name, i) => ({
      name,
      trained: [0, 4, 14, 25, 26, 33].includes(i),
      bonus: [0, 4, 14, 25, 26, 33].includes(i) ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 3),
    }))
  );

  const handleSave = () => {
    console.log("Ficha salva:", { header, attributes, armor, vigor, sanidade, observacoes, skills });
    toast({ title: "Ficha Salva!", description: "Sua ficha foi salva com sucesso." });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Title */}
      <div className="max-w-5xl mx-auto mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold gold-text tracking-widest uppercase">
          Ficha de Personagem
        </h1>
        <div className="mt-2 mx-auto w-48 section-divider" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* SEÇÃO 1: Cabeçalho */}
        <section>
          <SectionTitle icon={Scroll} title="Informações" />
          <CharacterHeader data={header} onChange={(f, v) => setHeader((p) => ({ ...p, [f]: v }))} />
        </section>

        {/* SEÇÃO 2: Atributos */}
        <section>
          <SectionTitle icon={Swords} title="Atributos" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.entries(attributes) as [string, number][]).map(([key, val]) => (
              <AttributeCard
                key={key}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
                value={val}
                onChange={(v) => setAttributes((p) => ({ ...p, [key]: v }))}
              />
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: Equipamento e Defesa */}
        <section>
          <SectionTitle icon={Shield} title="Equipamento & Defesa" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArmorSection armor={armor} onChange={(f, v) => setArmor((p) => ({ ...p, [f]: v }))} />
            <StatusSection
              vigor={vigor}
              sanidade={sanidade}
              observacoes={observacoes}
              onVigorChange={(f, v) => setVigor((p) => ({ ...p, [f]: v }))}
              onSanidadeChange={(f, v) => setSanidade((p) => ({ ...p, [f]: v }))}
              onObservacoesChange={setObservacoes}
            />
          </div>
        </section>

        {/* SEÇÃO 4: Trilhas */}
        <section>
          <SectionTitle icon={Footprints} title="Trilhas de Sobrevivência" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SurvivalTrack
              label="Trilha de Sanidade"
              total={10}
              filled={sanidadeTrack}
              color="bg-sanity"
              onToggle={(i) => setSanidadeTrack(i < sanidadeTrack ? i : i + 1)}
            />
            <SurvivalTrack
              label="Trilha de Fome"
              total={10}
              filled={fomeTrack}
              color="bg-blood"
              onToggle={(i) => setFomeTrack(i < fomeTrack ? i : i + 1)}
            />
          </div>
        </section>

        {/* SEÇÃO 5: Perícias */}
        <section>
          <SkillsSection
            skills={skills}
            onToggleTrained={(i) =>
              setSkills((p) => p.map((s, j) => (j === i ? { ...s, trained: !s.trained } : s)))
            }
            onBonusChange={(i, v) =>
              setSkills((p) => p.map((s, j) => (j === i ? { ...s, bonus: v } : s)))
            }
          />
        </section>

        {/* Spacer for FAB */}
        <div className="h-20" />
      </div>

      {/* FAB Salvar */}
      <button
        onClick={handleSave}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full font-display font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50"
      >
        <Save className="w-5 h-5" />
        Salvar Ficha
      </button>
    </div>
  );
};

export default Index;
