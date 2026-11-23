import { useEffect, useMemo, useState } from "react";

export default function MainContent() {
  const [rareSpecies, setRareSpecies] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadThreatenedSpecies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.inaturalist.org/v1/observations?threatened=true&photos=true&per_page=36&order_by=votes",
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("iNaturalist returned an error");

        const data = await response.json();
        const uniqueSpecies = new Map();

        data.results.forEach((observation) => {
          const taxon = observation.taxon;
          if (!taxon || uniqueSpecies.has(taxon.id)) return;

          const categoryName =
            taxon.iconic_taxon_name || taxon.preferred_common_name || "Other";
          const conservation = taxon.conservation_status;

          uniqueSpecies.set(taxon.id, {
            name: taxon.preferred_common_name || taxon.name,
            scientificName: taxon.name,
            category: categoryName,
            status:
              conservation?.status_name ||
              conservation?.status ||
              "Threatened",
            location: observation.place_guess || "Location not provided",
            population: `${observation.taxon?.observations_count?.toLocaleString() || "Unknown"} observations`,
            image:
              observation.photos?.[0]?.url?.replace("square", "large") ||
              taxon.default_photo?.medium_url,
          });
        });

        setRareSpecies([...uniqueSpecies.values()]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load wildlife data from iNaturalist.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadThreatenedSpecies();
    return () => controller.abort();
  }, []);

  const categories = ["All", ...new Set(rareSpecies.map((species) => species.category))];

  const speciesToShow = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rareSpecies.filter((species) => {
      const matchesCategory = category === "All" || species.category === category;
      const matchesSearch =
        !query ||
        species.name.toLowerCase().includes(query) ||
        species.scientificName.toLowerCase().includes(query) ||
        species.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search, rareSpecies]);

  return (
    <section className="bg-[#f4f1ea] px-5 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-emerald-700">
            Wildlife Archive
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Rare creatures of our world
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explore threatened species and the places they call home.
          </p>
        </header>

        <div className="mb-7 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search species</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or location"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-full min-w-44 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <p aria-live="polite" className="rounded-xl bg-white py-12 text-center text-slate-600">
            Loading threatened species...
          </p>
        ) : error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-red-800" role="alert">
            {error}
          </p>
        ) : speciesToShow.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speciesToShow.map((species) => (
              <article
                key={species.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={species.image}
                  alt={species.name}
                  className="h-52 w-full object-cover"
                />
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold">{species.name}</h2>
                      <p className="mt-1 italic text-slate-500">{species.scientificName}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      {species.category}
                    </span>
                  </div>

                  <p className="mb-4 text-sm font-semibold text-red-700">
                    {species.status}
                  </p>

                  <dl className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <dt className="text-slate-400">Location</dt>
                      <dd className="mt-1 font-medium">{species.location}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Population</dt>
                      <dd className="mt-1 font-medium">{species.population}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-lg font-bold">No rare species found</p>
            <p className="mt-1 text-slate-500">Try a different name or category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
