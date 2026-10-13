import PropTypes from "prop-types";
import "../styles/PokemonCard.css";

function PokemonCard({ id, nombre, imagen, tipos, altura, peso, stats, color }) {
  return (
    <article className="card" style={{ "--card-color": color }}>
      <div className="card__header">
        <img className="card__sprite" src={imagen} alt={nombre} loading="lazy" />
        <div>
          <span className="card__id">#{String(id).padStart(3, "0")}</span>
          <h2 className="card__title">{nombre}</h2>
        </div>
      </div>

      <div className="card__badges">
        {tipos.map((tipo) => (
          <span key={tipo} className="card__badge">
            {tipo}
          </span>
        ))}
      </div>

      <ul className="card__stats">
        {stats.map((s) => (
          <li key={s.nombre}>
            <span>{s.nombre}</span>
            <strong>{s.valor}</strong>
          </li>
        ))}
      </ul>

      <footer className="card__footer">
        <span>
          Altura <strong>{altura} m</strong>
        </span>
        <span>
          Peso <strong>{peso} kg</strong>
        </span>
      </footer>
    </article>
  );
}

PokemonCard.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  imagen: PropTypes.string.isRequired,
  tipos: PropTypes.arrayOf(PropTypes.string).isRequired,
  altura: PropTypes.number.isRequired,
  peso: PropTypes.number.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      valor: PropTypes.number.isRequired,
    }),
  ).isRequired,
  color: PropTypes.string.isRequired,
};

export default PokemonCard;
