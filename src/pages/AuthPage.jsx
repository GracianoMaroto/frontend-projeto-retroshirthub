import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

const demoAccounts = [
  {
    name: 'Ana Silva',
    email: 'ana@retroshirt.com',
    password: 'retroana123',
    team: 'Flamengo',
    city: 'São Paulo'
  },
  {
    name: 'Mateus Costa',
    email: 'mateus@retroshirt.com',
    password: 'vintage2024',
    team: 'Corinthians',
    city: 'Rio de Janeiro'
  },
  {
    name: 'Juliana Rocha',
    email: 'juliana@retroshirt.com',
    password: 'goldenhub',
    team: 'Palmeiras',
    city: 'Belo Horizonte'
  }
];

function AuthPage({ onAuth }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    favoriteTeam: '',
    bio: '',
    avatar: ''
  });
  const [error, setError] = useState('');

  function handleDemoClick(account) {
    setForm((current) => ({
      ...current,
      name: account.name,
      email: account.email,
      password: account.password,
      city: account.city,
      favoriteTeam: account.team
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);

      onAuth(response);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <p className="eyebrow">Acesse sua conta</p>
        <h2>{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta RetroShirt'}</h2>
        <p>
          Use os usuários de demonstração ou cadastre-se para salvar favoritos, seguir rankings e simular compras com seu perfil.
        </p>

        <div className="auth-toggle">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Entrar
          </button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Cadastrar
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Nome
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </label>
              <label>
                Cidade
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
              </label>
              <label>
                Time favorito
                <input value={form.favoriteTeam} onChange={(event) => setForm({ ...form, favoriteTeam: event.target.value })} />
              </label>
              <label>
                Bio
                <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} rows="3" />
              </label>
              <label>
                Avatar (URL)
                <input value={form.avatar} onChange={(event) => setForm({ ...form, avatar: event.target.value })} />
              </label>
            </>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            Senha
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>

          <button type="submit">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </section>

      <section className="auth-side">
        <h3>Usuários de demonstração</h3>
        <p>Escolha um perfil para testar o fluxo completo do site.</p>
        <div className="demo-card-grid">
          {demoAccounts.map((account) => (
            <article key={account.email} className="demo-card">
              <div>
                <h4>{account.name}</h4>
                <p>{account.city}</p>
              </div>
              <p>Time favorito: {account.team}</p>
              <button type="button" onClick={() => handleDemoClick(account)}>Usar conta</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AuthPage;