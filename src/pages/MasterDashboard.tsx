// ============================================================
// pages/MasterDashboard.tsx — Painel do Mestre
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Crown,
    Users,
    Edit3,
    Eye,
    Shield,
    Swords,
    Heart,
    Brain,
    Search,
    LogOut,
    Scroll,
    ChevronDown,
    ChevronUp,
    MoreVertical,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import type { PlayerCharacterSheet } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// ── Mock Data: Fichas de Jogadores ─────────────────────────
const MOCK_SHEETS: PlayerCharacterSheet[] = [
    {
        id: "sheet-001",
        userId: "user-001",
        playerName: "Lucas Silva",
        playerEmail: "lucas@email.com",
        characterName: "Tharion Corvobreu",
        characterAlias: "O Cinzento",
        characterClass: "Ranger das Sombras",
        race: "Meio-Elfo",
        origin: "Floresta Sombria",
        level: 7,
        vigor: { current: 28, max: 35 },
        sanity: { current: 18, max: 22 },
        lastActive: "2026-02-21T14:30:00",
        isOnline: true,
    },
    {
        id: "sheet-002",
        userId: "user-002",
        playerName: "Ana Costa",
        playerEmail: "ana@email.com",
        characterName: "Lyra Flamejante",
        characterAlias: "A Feiticeira Rúnica",
        characterClass: "Maga Elemental",
        race: "Humana",
        origin: "Torre Arcana",
        level: 9,
        vigor: { current: 20, max: 24 },
        sanity: { current: 30, max: 30 },
        lastActive: "2026-02-21T16:45:00",
        isOnline: true,
    },
    {
        id: "sheet-003",
        userId: "user-003",
        playerName: "Pedro Ramos",
        playerEmail: "pedro@email.com",
        characterName: "Gronak Martelo Sangrento",
        characterAlias: "O Sem-Piedade",
        characterClass: "Bárbaro Berserker",
        race: "Meio-Orc",
        origin: "Estepes Vermelhas",
        level: 6,
        vigor: { current: 42, max: 48 },
        sanity: { current: 8, max: 15 },
        lastActive: "2026-02-20T22:10:00",
        isOnline: false,
    },
    {
        id: "sheet-004",
        userId: "user-004",
        playerName: "Mariana Lopes",
        playerEmail: "mari@email.com",
        characterName: "Seraphina Luzargenta",
        characterAlias: "A Curandeira",
        characterClass: "Clériga da Aurora",
        race: "Aasimar",
        origin: "Templo Celestial",
        level: 8,
        vigor: { current: 26, max: 28 },
        sanity: { current: 25, max: 25 },
        lastActive: "2026-02-21T17:00:00",
        isOnline: true,
    },
    {
        id: "sheet-005",
        userId: "user-005",
        playerName: "Thiago Mendes",
        playerEmail: "thiago@email.com",
        characterName: "Kael Sombrafina",
        characterAlias: "Dedos Rápidos",
        characterClass: "Ladino Assassino",
        race: "Halfling",
        origin: "Subúrbios de Valdris",
        level: 5,
        vigor: { current: 15, max: 22 },
        sanity: { current: 12, max: 18 },
        lastActive: "2026-02-19T20:30:00",
        isOnline: false,
    },
];

// ── Helper ─────────────────────────────────────────────────
function StatusBar({
    current,
    max,
    color,
    icon: Icon,
    label,
}: {
    current: number;
    max: number;
    color: string;
    icon: typeof Heart;
    label: string;
}) {
    const pct = Math.round((current / max) * 100);
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                    <Icon className="w-3 h-3" />
                    {label}
                </span>
                <span className="font-mono text-foreground">
                    {current}/{max}
                </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function formatLastActive(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
}

// ── Component ──────────────────────────────────────────────
const MasterDashboard = () => {
    const { state, logout } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [expandedSheet, setExpandedSheet] = useState<string | null>(null);

    const filteredSheets = MOCK_SHEETS.filter(
        (s) =>
            s.characterName.toLowerCase().includes(search.toLowerCase()) ||
            s.playerName.toLowerCase().includes(search.toLowerCase()) ||
            s.characterClass.toLowerCase().includes(search.toLowerCase())
    );

    const onlineCount = MOCK_SHEETS.filter((s) => s.isOnline).length;

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleEditSheet = (sheet: PlayerCharacterSheet) => {
        toast.info(`Abrindo ficha de ${sheet.characterName}…`);
        // Futuro: navigate(`/sheet/${sheet.id}/edit`)
        navigate("/");
    };

    const handleViewSheet = (sheet: PlayerCharacterSheet) => {
        toast.info(`Visualizando ficha de ${sheet.characterName}…`);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* ── Top Bar ────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/30">
                            <Crown className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-display text-lg gold-text tracking-wider uppercase leading-tight">
                                Painel do Mestre
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {state.user?.displayName ?? state.user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="hidden sm:inline-flex border-primary/30 text-primary text-xs gap-1"
                        >
                            <Crown className="w-3 h-3" />
                            Mestre
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/")}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Scroll className="w-4 h-4 mr-1" />
                            Minha Ficha
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="card-rpg">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-display font-bold gold-text">
                                    {MOCK_SHEETS.length}
                                </p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Jogadores
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-rpg">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-health/10 border border-health/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-health" />
                            </div>
                            <div>
                                <p className="text-2xl font-display font-bold text-health">
                                    {onlineCount}
                                </p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Online Agora
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-rpg">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-arcane/10 border border-arcane/20 flex items-center justify-center">
                                <Swords className="w-6 h-6 text-arcane" />
                            </div>
                            <div>
                                <p className="text-2xl font-display font-bold text-arcane">
                                    {Math.round(
                                        MOCK_SHEETS.reduce((a, s) => a + s.level, 0) /
                                        MOCK_SHEETS.length
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Nível Médio
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search + Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-display gold-text tracking-wider uppercase">
                            Fichas dos Aventureiros
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Gerencie as fichas de todos os jogadores da sua mesa.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, classe…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-rpg pl-9 h-10"
                        />
                    </div>
                </div>

                {/* ── Sheet Cards ──────────────────────────────────── */}
                <div className="space-y-3">
                    {filteredSheets.length === 0 ? (
                        <Card className="card-rpg">
                            <CardContent className="p-12 text-center">
                                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground">
                                    Nenhum aventureiro encontrado.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredSheets.map((sheet) => {
                            const isExpanded = expandedSheet === sheet.id;
                            return (
                                <Card
                                    key={sheet.id}
                                    className="card-rpg group hover:border-primary/20 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Main Row */}
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-4 p-4">
                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border flex items-center justify-center font-display text-lg gold-text uppercase">
                                                    {sheet.characterName.charAt(0)}
                                                </div>
                                                {/* Online indicator */}
                                                <div
                                                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${sheet.isOnline ? "bg-health" : "bg-muted-foreground/40"
                                                        }`}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-display text-base gold-text truncate">
                                                        {sheet.characterName}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px] px-1.5 uppercase tracking-wider"
                                                    >
                                                        Nv. {sheet.level}
                                                    </Badge>
                                                    {sheet.isOnline && (
                                                        <Badge className="text-[10px] px-1.5 bg-health/15 text-health border-health/20">
                                                            Online
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {sheet.characterClass} • {sheet.race}
                                                </p>
                                                <p className="text-xs text-muted-foreground/60 mt-0.5">
                                                    {sheet.playerName} — {formatLastActive(sheet.lastActive)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEditSheet(sheet)}
                                                    className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-display text-xs uppercase tracking-wider shadow-[0_0_10px_-3px_hsl(var(--gold)/0.2)] hover:shadow-[0_0_15px_-3px_hsl(var(--gold)/0.4)] transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                                    Editar Ficha
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleViewSheet(sheet)}
                                                    className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                    Ver
                                                </Button>

                                                {/* Mobile dropdown */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild className="sm:hidden">
                                                        <Button variant="ghost" size="icon" className="w-8 h-8">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditSheet(sheet)}>
                                                            <Edit3 className="w-4 h-4 mr-2" />
                                                            Editar Ficha
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewSheet(sheet)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Visualizar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                {/* Expand toggle */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-muted-foreground"
                                                    onClick={() =>
                                                        setExpandedSheet(isExpanded ? null : sheet.id)
                                                    }
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Detail */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="px-4 pb-4 pt-0 border-t border-border/50">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            Vulgo
                                                        </p>
                                                        <p className="text-sm text-foreground font-medium">
                                                            {sheet.characterAlias}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            Origem
                                                        </p>
                                                        <p className="text-sm text-foreground font-medium">
                                                            {sheet.origin}
                                                        </p>
                                                    </div>
                                                    <StatusBar
                                                        current={sheet.vigor.current}
                                                        max={sheet.vigor.max}
                                                        color="bg-health"
                                                        icon={Heart}
                                                        label="Vigor"
                                                    />
                                                    <StatusBar
                                                        current={sheet.sanity.current}
                                                        max={sheet.sanity.max}
                                                        color="bg-sanity"
                                                        icon={Brain}
                                                        label="Sanidade"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground/60 mt-3">
                                                    E-mail: {sheet.playerEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default MasterDashboard;
