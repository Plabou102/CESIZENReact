import { Outlet, Link, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/auth/useLogout";
import { useMe } from "../../hooks/auth/useMe";
import logo1 from "../../assets/logo1.png";

const NAV_ITEMS = [
  { to: "/", label: "Tableau de bord", icon: "⊞" },
  { to: "/users", label: "Utilisateurs", icon: "◎" },
  { to: "/informations", label: "Informations", icon: "◈" },
  { to: "/breathing-exercises", label: "Exercices de respiration", icon: "◉" },
];

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useLogout();
  const { data: user } = useMe();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "A";

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Administrateur";

  const currentLabel =
    NAV_ITEMS.find((n) =>
      n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to)
    )?.label ?? "CESIZen";

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo1} alt="CESIZen" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <div>
              <div className="sidebar-logo-name">CESIZen</div>
              <div className="sidebar-logo-tagline">Back-office admin</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                <span className="nav-link-icon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div style={{ padding: "0 8px 12px", fontSize: 13, color: "rgba(255,255,255,.60)" }}>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,.85)" }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontSize: 11, marginTop: 2 }}>{user.email}</div>
            </div>
          )}
          <button className="nav-link" onClick={logout} style={{ color: "rgba(255,255,255,.70)" }}>
            <span className="nav-link-icon" aria-hidden="true">⇤</span>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-area">
        <header className="topbar">
          <span className="topbar-title">{currentLabel}</span>
          <div className="topbar-right">
            <div className="avatar-chip">
              <div className="avatar">{initials}</div>
              {fullName}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}