import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router";
import { traducirTipo } from "../pokemonTypes";
import "../styles/app.css";
import "../styles/Detail.css";

const URL_API = "https://pokeapi.co/api/v2";
const RELACIONES = [
  { clave: "double_damage_to", titulo: "Inflige daño doble (×2)" },
  { clave: "half_damage_to", titulo: "Inflige la mitad de daño (×0.5)" },
  { clave: "no_damage_to", titulo: "No causa daño (×0)" },
  { clave: "double_damage_from", titulo: "Recibe daño doble (×2)" },
  { clave: "half_damage_from", titulo: "Recibe la mitad de daño (×0.5)" },
  { clave: "no_damage_from", titulo: "Es inmune al daño (×0)" },
];

function TypeDetail() {
  const { nombre } = useParams();
  const [resultado, setResultado] = useState(null);
  const cargando = resultado?.nombre !== nombre;
  const { tipo, error } = cargando ? {} : resultado;

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${URL_API}/type/${encodeURIComponent(nombre)}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!controller.signal.aborted) setResultado({ nombre, tipo: data });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResultado({
          nombre,
          error: error.response?.status === 404
            ? "No se encontró el tipo solicitado."
            : "No se pudo cargar la información del tipo. Intenta recargar la página.",
        });
      });

    return () => controller.abort();
  }, [nombre]);

  const nombreTraducido = tipo?.names.find((entrada) => entrada.language.name === "es")?.name
    ?? traducirTipo(tipo?.name);

  return (
    <main className="app">
      <Link className="detail-link" to="/">← Volver a la Pokédex</Link>
      {cargando && <p className="estado" role="status">Cargando información del tipo...</p>}
      {error && <p className="estado estado--error" role="alert">{error}</p>}

      {tipo && (
        <>
          <header className="detail-header">
            <div>
              <h1 className="detail-title">Tipo {nombreTraducido}</h1>
              <p>Nombre: {nombreTraducido} · Generación: {tipo.generation.name.replace("generation-", "").toUpperCase()}</p>
              <p>Clase de daño original: {({ physical: "Físico", special: "Especial", status: "Estado" })[tipo.move_damage_class?.name] ?? "No disponible"}</p>
            </div>
          </header>

          <h2>Relaciones de daño</h2>
          <p>Multiplicadores frente a un solo tipo; las combinaciones de dos tipos pueden modificarlos.</p>
          <div className="detail-grid">
            {RELACIONES.map(({ clave, titulo }) => (
              <section className="detail-panel" key={clave}>
                <h3>{titulo}</h3>
                {tipo.damage_relations[clave].length === 0 ? <p>Ninguno.</p> : (
                  <div className="detail-tags">
                    {tipo.damage_relations[clave].map((relacion) => (
                      <Link className="detail-tag" key={relacion.name} to={`/tipo/${relacion.name}`}>
                        {traducirTipo(relacion.name)}
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <section className="detail-panel">
            <h2>Pokémon de este tipo ({tipo.pokemon.length})</h2>
            {tipo.pokemon.length === 0 ? <p>No hay Pokémon registrados para este tipo.</p> : (
              <ul className="detail-list">
                {tipo.pokemon.map(({ pokemon }) => (
                  <li key={pokemon.name}>
                    <Link className="detail-link" to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="detail-panel">
            <h2>Movimientos de este tipo ({tipo.moves.length})</h2>
            {tipo.moves.length === 0 ? <p>No hay movimientos registrados para este tipo.</p> : (
              <ul className="detail-list">
                {tipo.moves.map((move) => <li key={move.name}>{move.name}</li>)}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default TypeDetail;
