import PropTypes from "prop-types";

function FilterBar({ tipos, tipoActivo, onSeleccionar }) {
  return (
    /*
     *  Fragment como contendor del componente
     */
    <>
      <nav className="filter-bar" aria-label="Filtrar por tipo">
        <button
          className={`filter-btn ${tipoActivo === "Todos" ? "active" : ""}`}
          onClick={() => onSeleccionar("Todos")}
        >
          Todos
        </button>

        {/*
         * Generamos un por cada tipo , sin hardcodear ni hacer codigo a lo wey
         */}
        {tipos.map((tipo) => (
          <button
            key={tipo}
            className={`filter-btn ${tipoActivo === tipo ? "active" : ""}`}
            onClick={() => onSeleccionar(tipo)}
          >
            {tipo}
          </button>
        ))}
      </nav>
    </>
  );
}

FilterBar.propTypes = {
  tipos: PropTypes.arrayOf(PropTypes.string).isRequired,
  tipoActivo: PropTypes.string.isRequired,
  onSeleccionar: PropTypes.func.isRequired,
};

export default FilterBar;
