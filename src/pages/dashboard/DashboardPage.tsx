import { useMe } from "../../hooks/auth/useMe";
import { useNavigate } from "react-router-dom";

const CARDS = [
  {
    to: "/users",
    icon: "◎",
    title: "Utilisateurs",
    description: "Gérer les comptes utilisateurs et administrateurs, activer ou désactiver des comptes.",
    color: "var(--c-primary)",
    bg: "var(--c-primary-dim)",
  },
  {
    to: "/informations",
    icon: "◈",
    title: "Informations",
    description: "Modifier les contenus des pages et menus d'information accessibles au public.",
    color: "var(--c-warning)",
    bg: "var(--c-warning-bg)",
  },
  {
    to: "/breathing-exercises",
    icon: "◉",
    title: "Exercices de respiration",
    description: "Créer et configurer les exercices de cohérence cardiaque proposés aux utilisateurs.",
    color: "var(--c-primary-lt)",
    bg: "var(--c-primary-dim)",
  },
];

export default function DashboardPage() {
  const { data: user } = useMe();
  const navigate = useNavigate();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  })();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}{user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="page-subtitle">
            Bienvenue dans le back-office CESIZen. Que souhaitez-vous gérer ?
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {CARDS.map((card) => (
          <button
            key={card.to}
            onClick={() => navigate(card.to)}
            style={{
              background: "var(--c-surface)",
              border: "1px solid var(--c-border)",
              borderRadius: "var(--radius-lg)",
              padding: "28px 24px",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow 150ms ease, transform 150ms ease",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-sm)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: card.color,
              }}
            >
              {card.icon}
            </div>

            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--c-text)", marginBottom: 6 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--c-text-muted)", lineHeight: 1.6 }}>
                {card.description}
              </div>
            </div>

            <div style={{ marginTop: "auto", fontSize: 13, fontWeight: 600, color: card.color }}>
              Accéder →
            </div>
          </button>
        ))}
      </div>
    </>
  );
}