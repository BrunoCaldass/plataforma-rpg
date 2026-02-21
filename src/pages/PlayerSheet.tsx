// ============================================================
// pages/PlayerSheet.tsx — Ficha do Jogador (com header de nav)
// ============================================================
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Save,
    Scroll,
    Swords,
    Shield,
    Footprints,
    LogOut,
    Crown,
    LayoutDashboard,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import CharacterHeader from "@/components/rpg/CharacterHeader";
import AttributeCard from "@/components/rpg/AttributeCard";
import ArmorSection from "@/components/rpg/ArmorSection";
import StatusSection from "@/components/rpg/StatusSection";
import SurvivalTrack from "@/components/rpg/SurvivalTrack";
import SkillsSection, { Skill } from "@/components/rpg/SkillsSection";
import SectionTitle from "@/components/rpg/SectionTitle";

const SKILL_NAMES = [
    "Arremesso", "Armadilhas", "Camuflagem", "Mentalidade", "Artes Marciais", "Atletismo",
    "Luta", "Conhecimento", "Engenharia", "Condução", "Cosmologia", "Intuição",
    "Atuação", "Acrobacia", "Furtividade", "História", "Investigação", "Animais",
    "Diplomacia", "Medicina", "Enganação", "Iniciativa", "Mecânica", "Mineração",
    "Intimidação", "Pontaria", "Percepção", "Natureza", "Reflexo", "Tática",
    "Religião", "Roubo", "Avaliação", "Sobrevivência",
];

const PlayerSheet = () => {
    const { state, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // ── State da Ficha ───────────────────────────────────────
    const [header, setHeader] = useState({
        nome: "Tharion Corvobreu",
        vulgo: "O Cinzento",
        raca: "Meio-Elfo",
        origem: "Floresta Sombria",
        jogador: state.user?.displayName ?? "Jogador",
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

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isMaster = state.user?.role === "master";

    return (
        <div className="min-h-screen bg-background">
            {/* ── Top Bar ──────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Scroll className="w-5 h-5 text-primary" />
                        <div>
                            <span className="font-display text-sm gold-text tracking-wider uppercase">
                                Ficha de Personagem
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                                — {state.user?.displayName}
                            </span>
                        </div>
                        {isMaster && (
                            <Badge variant="outline" className="border-destructive/40 text-destructive text-[10px] gap-1 ml-1">
                                <Crown className="w-2.5 h-2.5" />
                                Mestre
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isMaster && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/master-dashboard")}
                                className="text-muted-foreground hover:text-foreground text-xs"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Painel Mestre</span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                        >
                            <LogOut className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Sair</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── Sheet Content ────────────────────────────────── */}
            <div className="py-8 px-4">
                <div className="max-w-5xl mx-auto mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-display font-bold gold-text tracking-widest uppercase">
                        Ficha de Personagem
                    </h1>
                    <div className="mt-2 mx-auto w-48 section-divider" />
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    <section>
                        <SectionTitle icon={Scroll} title="Informações" />
                        <CharacterHeader data={header} onChange={(f, v) => setHeader((p) => ({ ...p, [f]: v }))} />
                    </section>

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

                    <div className="h-20" />
                </div>
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

export default PlayerSheet;
