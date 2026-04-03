// src/pages/users/UsersPage.tsx

import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
} from "../../services/api/user.service";
import type { User, CreateUserPayload } from "../../types/user/user.types";

const emptyForm: CreateUserPayload = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "USER",
};

export default function UsersPage() {
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState<CreateUserPayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };

  const handleOpenEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: "", role: user.role });
    setShowForm(true);
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!editingId && !form.password) {
      alert("Le mot de passe est obligatoire.");
      return;
    }
    try {
      setSubmitting(true);
      if (editingId !== null) {
        const { password, ...rest } = form;
        await updateUser(editingId, rest);
      } else {
        await createUser(form);
      }
      await fetchUsers();
      handleCancel();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Erreur lors de l'enregistrement.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      user.isActive ? await deactivateUser(user.id) : await reactivateUser(user.id);
      await fetchUsers();
    } catch {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <span>◎</span> Chargement des utilisateurs…
    </div>
  );

  if (error) return (
    <div className="alert alert-error" style={{ maxWidth: 480 }}>
      <span>⚠</span> {error}
    </div>
  );

  return (
    <>
      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">
            Gérez les comptes utilisateurs et administrateurs de la plateforme.
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <span aria-hidden="true">+</span> Nouvel utilisateur
          </button>
        )}
      </div>

      {/* ── Form panel ── */}
      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <span className="form-panel-title">
              {editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>✕ Annuler</button>
          </div>

          <div className="form-panel-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="f-firstname">
                  Prénom <span className="form-label-hint">(obligatoire)</span>
                </label>
                <input
                  id="f-firstname"
                  className="form-input"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="Jean"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-lastname">
                  Nom <span className="form-label-hint">(obligatoire)</span>
                </label>
                <input
                  id="f-lastname"
                  className="form-input"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="f-email">
                  Email <span className="form-label-hint">(obligatoire)</span>
                </label>
                <input
                  id="f-email"
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="jean.dupont@mail.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-role">
                  Rôle <span className="form-label-hint">(obligatoire)</span>
                </label>
                <select
                  id="f-role"
                  className="form-input form-select"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as "USER" | "ADMIN" }))}
                >
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            {!editingId && (
              <div className="form-group">
                <label className="form-label" htmlFor="f-password">
                  Mot de passe <span className="form-label-hint">(obligatoire à la création)</span>
                </label>
                <input
                  id="f-password"
                  className="form-input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          <div className="form-panel-footer">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Enregistrement…" : editingId ? "Mettre à jour" : "Créer l'utilisateur"}
            </button>
            <button className="btn btn-ghost" onClick={handleCancel}>Annuler</button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">◎</div>
                    <div className="empty-state-title">Aucun utilisateur enregistré</div>
                    <div className="empty-state-text">
                      Cliquez sur « Nouvel utilisateur » pour commencer.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--c-text-muted)" }}>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === "ADMIN" ? "badge-warning" : ""}`}
                      style={user.role !== "ADMIN" ? { background: "var(--c-surface-2)", color: "var(--c-text-muted)" } : {}}>
                      {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
                      {user.isActive ? "● Actif" : "○ Inactif"}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(user)}>
                        Modifier
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(user)}>
                        {user.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}