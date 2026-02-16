import { LucideIcon } from "lucide-react";

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
}

const SectionTitle = ({ icon: Icon, title }: SectionTitleProps) => (
  <div className="flex items-center gap-3 mb-4">
    <Icon className="w-5 h-5 text-gold" />
    <h2 className="text-lg font-display font-bold tracking-wider uppercase gold-text">
      {title}
    </h2>
    <div className="flex-1 section-divider" />
  </div>
);

export default SectionTitle;
