import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { traducirTipo } from "../pokemonTypes";
import FilterBar from "../components/FilterBar";
import PokemonCard from "../components/PokemonCard";
import "../styles/app.css";

const COLORES_TIPO = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const URL_API = "https://pokeapi.co/api/v2";
const CLAVE_TIPO_ACTIVO = "pokemon-app:tipo-activo";

function recuperarTipoActivo() {
  try {
    // Recupera la última selección; la primera vez se muestran todos.
    return localStorage.getItem(CLAVE_TIPO_ACTIVO) || "Todos";
  } catch {
    // La aplicación sigue funcionando si el navegador bloquea el almacenamiento.
    return "Todos";
  }
}

function Home() {
  const [types, setTypes] = useState([]);
  const [tipoActivo, setTipoActivo] = useState(recuperarTipoActivo);
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Guarda el filtro cada vez que cambia para conservarlo al recargar.
      localStorage.setItem(CLAVE_TIPO_ACTIVO, tipoActivo);
    } catch {
      // Si no se puede guardar, el filtro continúa funcionando en memoria.
    }
  }, [tipoActivo]);

  const seleccionarTipo = (tipo) => {
    setTipoActivo(tipo);
    setCargando(true);
    setError(null);
    setPokemones([]);
  };

  useEffect(() => {
    axios.get(`${URL_API}/type`).then((response) => {
      setTypes(response.data.results);
    });
  }, []);

  useEffect(() => {
    let cancelado = false;

    const url =
      tipoActivo === "Todos"
        ? `${URL_API}/pokemon?limit=150`
        : `${URL_API}/type/${tipoActivo}`;

    axios
      .get(url)
      .then((response) => {
        const lista =
          tipoActivo === "Todos"
            ? response.data.results
            : response.data.pokemon.map((p) => p.pokemon);

        return Promise.all(lista.map((p) => axios.get(p.url)));
      })
      .then((respuestas) => {
        if (cancelado) return;
        setPokemones(respuestas.map((r) => r.data));
      })
      .catch(() => {
        if (cancelado) return;
        setError("No se pudieron cargar los pokémon.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [tipoActivo]);

  return (
    <main className="app">
      <FilterBar
        tipos={types.map((t) => t.name)}
        tipoActivo={tipoActivo}
        onSeleccionar={seleccionarTipo}
      />

      {tipoActivo !== "Todos" && (
        <p>
          <Link className="detail-link" to={`/tipo/${tipoActivo}`}>
            Ver información del tipo {traducirTipo(tipoActivo)}
          </Link>
        </p>
      )}

      {cargando && <p className="estado">Cargando pokémon...</p>}
      {error && <p className="estado estado--error">{error}</p>}

      <section className="grid">
        {pokemones.map((p) => (
          <PokemonCard
            key={p.id}
            id={p.id}
            nombre={p.name}
            imagen={
              p.sprites.other?.["official-artwork"]?.front_default ??
              p.sprites.front_default
            }
            tipos={p.types.map((t) => t.type.name)}
            altura={p.height / 10}
            peso={p.weight / 10}
            stats={p.stats.map((s) => ({
              nombre: s.stat.name,
              valor: s.base_stat,
            }))}
            color={COLORES_TIPO[p.types[0].type.name] ?? "#777"}
          />
        ))}
      </section>

      {!cargando && !error && pokemones.length === 0 && (
        <p className="estado">Selecciona un tipo para ver los pokémon.</p>
      )}
    </main>
  );
}

export default Home;
