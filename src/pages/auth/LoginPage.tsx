import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../../hooks/auth/useLogin";
import logo2 from "../../assets/logo2.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    try {
      await loginMutation.mutateAsync({ email, password: pass });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/");
    } catch (error: any) {
      let message = "Connexion impossible";
      if (!navigator.onLine) message = "Le navigateur est hors ligne";
      else if (!error?.response && error?.code === "ERR_NETWORK") message = "Requête bloquée avant réponse serveur";
      else if (!error?.response) message = "Aucune réponse HTTP reçue";
      else if (error.response.status === 400) message = error.response.data?.error || "Requête invalide";
      else if (error.response.status === 401) message = error.response.data?.error || "Identifiants invalides";
      else if (error.response.status === 403) message = error.response.data?.error || "Accès refusé";
      else if (error.response.status === 404) message = "Route /auth/login introuvable";
      else if (error.response.status === 500) message = error.response.data?.error || "Erreur serveur";
      else message = error?.response?.data?.error || error?.response?.data?.message || error?.message || message;

      setErrorMessage(message);
    }
  }

  return (
    <div className="login-page">
      {/* ── Left panel ── */}
      <div className="login-left">
        <div className="login-logo-area">
          <img src={logo2} alt="CESIZen" style={{ width: 180, display: "block", margin: "0 auto 16px" }} />
          <div className="login-accent-bar" />
          <div className="login-logo-tagline">L'application de votre santé mentale</div>
        </div>
        <p className="login-left-quote">
          "Gérer son stress, c'est reprendre le contrôle de son quotidien — un souffle à la fois."
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <h1 className="login-heading">Espace administrateur</h1>
          <p className="login-subheading">Connectez-vous pour accéder au back-office.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cesizen.fr"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                className="form-input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {errorMessage && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                <span>⚠</span> {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loginMutation.isPending}
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}
            >
              {loginMutation.isPending ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}