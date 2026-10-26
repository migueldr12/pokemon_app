import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router";
import { traducirTipo } from "../pokemonTypes";
import "../styles/app.css";
import "../styles/Detail.css";

const URL_API = "https://pokeapi.co/api/v2";

function PokemonDetail() {
  const { nombre } = useParams();
  const [resultado, setResultado] = useState(null);
  const cargando = resultado?.nombre !== nombre;
  const { pokemon, especie, error } = cargando ? {} : resultado;

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${URL_API}/pokemon/${encodeURIComponent(nombre)}`, {
        signal: controller.signal,
      })
      .then(async ({ data }) => {
        const respuesta = await axios.get(data.species.url, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setResultado({ nombre, pokemon: data, especie: respuesta.data });
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResultado({
          nombre,
          error: error.response?.status === 404
            ? "No se encontró el Pokémon solicitado."
            : "No se pudo cargar la información del Pokémon. Intenta recargar la página.",
        });
      });

    return () => controller.abort();
  }, [nombre]);

  const descripcion = especie?.flavor_text_entries.find(
    (entrada) => entrada.language.name === "es",
  ) ?? especie?.flavor_text_entries.find(
    (entrada) => entrada.language.name === "en",
  );
  const categoria = especie?.genera.find((entrada) => entrada.language.name === "es");
  const imagen = pokemon?.sprites.other?.["official-artwork"]?.front_default
    ?? pokemon?.sprites.front_default;

  return (
    <main className="app">
      <Link className="detail-link" to="/">← Volver a la Pokédex</Link>
      {cargando && <p className="estado" role="status">Cargando información del Pokémon...</p>}
      {error && <p className="estado estado--error" role="alert">{error}</p>}

      {pokemon && (
        <>
          <header className="detail-header">
            {imagen && <img className="detail-image" src={imagen} alt={pokemon.name} />}
            <div>
              <span>#{String(pokemon.id).padStart(3, "0")}</span>
              <h1 className="detail-title">{pokemon.name}</h1>
              {categoria && <p>{categoria.genus}</p>}
              {descripcion && <p>{descripcion.flavor_text.replace(/[\n\f\r]/g, " ")}</p>}
              <div className="detail-tags">
                {pokemon.types.map(({ type }) => (
                  <Link className="detail-tag" key={type.name} to={`/tipo/${type.name}`}>
                    {traducirTipo(type.name)}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <div className="detail-grid">
            <section className="detail-panel">
              <h2>Información general</h2>
              <dl className="detail-data">
                <div><dt>Altura</dt><dd>{pokemon.height / 10} m</dd></div>
                <div><dt>Peso</dt><dd>{pokemon.weight / 10} kg</dd></div>
                <div><dt>Experiencia base</dt><dd>{pokemon.base_experience ?? "No disponible"}</dd></div>
                <div><dt>Hábitat</dt><dd>{especie.habitat?.name ?? "Desconocido"}</dd></div>
                <div><dt>Generación</dt><dd>{especie.generation.name}</dd></div>
                <div><dt>Tasa de captura</dt><dd>{especie.capture_rate} / 255</dd></div>
                <div><dt>Felicidad base</dt><dd>{especie.base_happiness ?? "No disponible"}</dd></div>
                <div><dt>Crecimiento</dt><dd>{especie.growth_rate.name}</dd></div>
                <div><dt>Grupos huevo</dt><dd>{especie.egg_groups.map((grupo) => grupo.name).join(", ") || "Ninguno"}</dd></div>
                <div><dt>Clasificación</dt><dd>{especie.is_mythical ? "Mítico" : especie.is_legendary ? "Legendario" : "Común"}</dd></div>
              </dl>
            </section>

            <section className="detail-panel">
              <h2>Estadísticas base</h2>
              <dl className="detail-data">
                {pokemon.stats.map(({ stat, base_stat, effort }) => (
                  <div key={stat.name}>
                    <dt>{stat.name}</dt>
                    <dd>{base_stat} <small>(EV: {effort})</small></dd>
                  </div>
                ))}
                <div><dt>Total</dt><dd>{pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</dd></div>
              </dl>
              <h2>Habilidades</h2>
              <ul>
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <li key={ability.name}>{ability.name}{is_hidden ? " (oculta)" : ""}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="detail-panel">
            <h2>Variedades</h2>
            <div className="detail-tags">
              {especie.varieties.map(({ pokemon: variedad }) => (
                <Link className="detail-tag" key={variedad.name} to={`/pokemon/${variedad.name}`}>
                  {variedad.name}
                </Link>
              ))}
            </div>
          </section>

          <section className="detail-panel">
            <h2>Movimientos ({pokemon.moves.length})</h2>
            {pokemon.moves.length === 0 ? <p>No hay movimientos registrados.</p> : (
              <ul className="detail-list">
                {pokemon.moves.map(({ move }) => <li key={move.name}>{move.name}</li>)}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default PokemonDetail;
