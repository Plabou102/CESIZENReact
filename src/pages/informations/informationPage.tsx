// src/pages/informations/InformationsPage.tsx

import { useEffect, useState } from "react";
import {
  getAllInformations,
  createInformation,
  updateInformation,
  deleteInformation,
} from "../../services/api/information.service";
import type { Information, CreateInformationPayload } from "../../types/information/information.types";

const emptyForm: CreateInformationPayload = {
  title: "",
  summary: "",
  content: "",
  category: "",
  imageUrl: "",
};

export default function InformationsPage() {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState<CreateInformationPayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchInformations = async () => {
    try {
      setLoading(true);
      const data = await getAllInformations();
      setInformations(data);
    } catch {
      setError("Erreur lors du chargement des informations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInformations(); }, []);

  const handleOpenCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };

  const handleOpenEdit = (info: Information) => {
    setEditingId(info.id);
    setForm({
      title: info.title,
      summary: info.summary,
      content: info.content,
      category: info.category,
      imageUrl: info.imageUrl ?? "",
    });
    setShowForm(true);
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async () => {
    if (!form.title || !form.summary || !form.content || !form.category) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      setSubmitting(true);
      editingId !== null
        ? await updateInformation(editingId, form)
        : await createInformation(form);
      await fetchInformations();
      handleCancel();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (info: Information) => {
    try {
      await updateInformation(info.id, { isActive: !info.isActive });
      await fetchInformations();
    } catch {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette information ?")) return;
    try {
      await deleteInformation(id);
      await fetchInformations();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <span>◈</span> Chargement des informations…
    </div>
  );

  if (error) return (
    <div className="alert alert-error" style={{ maxWidth: 480 }}>
      <span>⚠</span> {error}
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Informations</h1>
          <p className="page-subtitle">
            Gérez les pages et contenus d'information accessibles au public.
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <span aria-hidden="true">+</span> Nouvelle information
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <span className="form-panel-title">
              {editingId ? "Modifier l'information" : "Nouvelle information"}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>✕ Annuler</button>
          </div>

          <div className="form-panel-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="f-title">
                  Titre <span className="form-label-hint">(obligatoire)</span>
                </label>
                <input
                  id="f-title"
                  className="form-input"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Titre de la page d'information"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-category">
                  Catégorie <span className="form-label-hint">(obligatoire)</span>
                </label>
                <input
                  id="f-category"
                  className="form-input"
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="ex. Prévention, Stress, Bien-être…"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="f-summary">
                Résumé <span className="form-label-hint">(obligatoire)</span>
              </label>
              <input
                id="f-summary"
                className="form-input"
                type="text"
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="Courte description affichée en aperçu"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="f-content">
                Contenu <span className="form-label-hint">(obligatoire)</span>
              </label>
              <textarea
                id="f-content"
                className="form-textarea form-input"
                value={form.content}
                rows={6}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="Contenu complet de la page…"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="f-image">
                URL de l'image <span className="form-label-hint">(optionnel)</span>
              </label>
              <input
                id="f-image"
                className="form-input"
                type="text"
                value={form.imageUrl ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="form-panel-footer">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Enregistrement…" : editingId ? "Mettre à jour" : "Créer l'information"}
            </button>
            <button className="btn btn-ghost" onClick={handleCancel}>Annuler</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {informations.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <div className="empty-state-icon">◈</div>
                    <div className="empty-state-title">Aucune information créée</div>
                    <div className="empty-state-text">
                      Cliquez sur « Nouvelle information » pour commencer.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              informations.map((info) => (
                <tr key={info.id}>
                  <td style={{ fontWeight: 600 }}>{info.title}</td>
                  <td>
                    <span className="badge" style={{ background: "var(--c-surface-2)", color: "var(--c-text-muted)" }}>
                      {info.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${info.isActive ? "badge-success" : "badge-danger"}`}>
                      {info.isActive ? "● Actif" : "○ Inactif"}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(info)}>
                        Modifier
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(info)}>
                        {info.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(info.id)}>
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