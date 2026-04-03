import { useEffect, useState } from "react";
import {
  getAllBreathingExercises,
  createBreathingExercise,
  updateBreathingExercise,
  deactivateBreathingExercise,
  reactivateBreathingExercise,
  deleteBreathingExercise,
} from "../../services/api/breathingExercise.service";
import type {
  BreathingExercise,
  CreateBreathingExercisePayload,
} from "../../types/breathingExercise/breathingExercise.types";

const emptyForm: CreateBreathingExercisePayload = {
  label: "",
  description: "",
  inhaleDuration: 0,
  holdDuration: 0,
  exhaleDuration: 0,
  totalDuration: 0,
};

const DURATION_FIELDS = [
  { key: "inhaleDuration" as const, label: "Inspiration", unit: "s" },
  { key: "holdDuration"   as const, label: "Apnée",       unit: "s" },
  { key: "exhaleDuration" as const, label: "Expiration",  unit: "s" },
];

export default function BreathingExercisesPage() {
  const [exercises, setExercises] = useState<BreathingExercise[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState<CreateBreathingExercisePayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setExercises(await getAllBreathingExercises());
    } catch {
      setError("Erreur lors du chargement des exercices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (ex: BreathingExercise) => {
    setEditingId(ex.id);
    setForm({
      label: ex.label, description: ex.description,
      inhaleDuration: ex.inhaleDuration, holdDuration: ex.holdDuration,
      exhaleDuration: ex.exhaleDuration, totalDuration: ex.totalDuration,
    });
    setShowForm(true);
  };

  const cancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleDuration = (field: "inhaleDuration" | "holdDuration" | "exhaleDuration", value: number) => {
    setForm((prev) => {
      const u = { ...prev, [field]: value };
      u.totalDuration = u.inhaleDuration + u.holdDuration + u.exhaleDuration;
      return u;
    });
  };

  const handleSubmit = async () => {
    if (!form.label || !form.description) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      setSubmitting(true);
      editingId !== null
        ? await updateBreathingExercise(editingId, form)
        : await createBreathingExercise(form);
      await fetchExercises();
      cancel();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (ex: BreathingExercise) => {
    try {
      ex.isActive
        ? await deactivateBreathingExercise(ex.id)
        : await reactivateBreathingExercise(ex.id);
      await fetchExercises();
    } catch { alert("Erreur lors de la mise à jour."); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet exercice définitivement ?")) return;
    try {
      await deleteBreathingExercise(id);
      await fetchExercises();
    } catch { alert("Erreur lors de la suppression."); }
  };

  if (loading) return (
    <div className="loading-screen">
      <span>◉</span> Chargement des exercices…
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
          <h1 className="page-title">Exercices de respiration</h1>
          <p className="page-subtitle">
            Gérez les exercices de cohérence cardiaque proposés aux utilisateurs.
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={openCreate}>
            <span aria-hidden="true">+</span> Nouvel exercice
          </button>
        )}
      </div>

      {/* ── Form panel ── */}
      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <span className="form-panel-title">
              {editingId ? "Modifier l'exercice" : "Nouvel exercice de respiration"}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={cancel}>✕ Annuler</button>
          </div>

          <div className="form-panel-body">
            <div className="form-group">
              <label className="form-label" htmlFor="f-label">
                Libellé <span className="form-label-hint">(obligatoire)</span>
              </label>
              <input
                id="f-label"
                className="form-input"
                type="text"
                value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="ex. Cohérence cardiaque 5-5"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="f-desc">
                Description <span className="form-label-hint">(obligatoire)</span>
              </label>
              <textarea
                id="f-desc"
                className="form-textarea form-input"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Décrivez le rythme et les bénéfices de cet exercice…"
              />
            </div>

            <div className="form-row-3">
              {DURATION_FIELDS.map(({ key, label }) => (
                <div className="form-group" key={key}>
                  <label className="form-label" htmlFor={`f-${key}`}>
                    {label} <span className="form-label-hint">(secondes)</span>
                  </label>
                  <input
                    id={`f-${key}`}
                    className="form-input"
                    type="number"
                    min={0}
                    value={form[key]}
                    onChange={(e) => handleDuration(key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Durée totale calculée</label>
              <input
                className="form-input"
                type="number"
                value={form.totalDuration}
                disabled
              />
            </div>
          </div>

          <div className="form-panel-footer">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Enregistrement…" : editingId ? "Mettre à jour" : "Créer l'exercice"}
            </button>
            <button className="btn btn-ghost" onClick={cancel}>Annuler</button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Inspiration</th>
              <th>Apnée</th>
              <th>Expiration</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon">◉</div>
                    <div className="empty-state-title">Aucun exercice créé</div>
                    <div className="empty-state-text">
                      Cliquez sur « Nouvel exercice » pour commencer.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              exercises.map((ex) => (
                <tr key={ex.id}>
                  <td style={{ fontWeight: 600 }}>{ex.label}</td>
                  <td><span className="duration-pill">{ex.inhaleDuration}s</span></td>
                  <td><span className="duration-pill">{ex.holdDuration}s</span></td>
                  <td><span className="duration-pill">{ex.exhaleDuration}s</span></td>
                  <td>
                    <span className="badge" style={{ background: "var(--c-accent-dim)", color: "var(--c-text)" }}>
                      {ex.totalDuration}s
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ex.isActive ? "badge-success" : "badge-danger"}`}>
                      {ex.isActive ? "● Actif" : "○ Inactif"}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ex)}>
                        Modifier
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(ex)}>
                        {ex.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ex.id)}>
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