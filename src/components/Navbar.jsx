import { NavLink } from 'react-router-dom';

function Navbar({ auth, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">RetroShirt Hub</p>
        <h1>Camisas retrô com personalidade, raridade e ranking.</h1>
      </div>

      <div className="topbar-actions">
        <nav className="nav-links">
          <NavLink to="/" end>Catálogo</NavLink>
          <NavLink to="/populares">Populares</NavLink>
          <NavLink to="/favoritos">Favoritos</NavLink>
        </nav>

        {auth?.user ? (
          <div className="user-pill">
            <img src={auth.user.avatar} alt={auth.user.name} className="user-avatar" />
            <div>
              <strong>{auth.user.name}</strong>
              <span>{auth.user.favoriteTeam}</span>
            </div>
            <button type="button" onClick={onLogout}>Sair</button>
          </div>
        ) : (
          <NavLink to="/auth" className="cta-button">Entrar</NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;