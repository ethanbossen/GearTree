// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import {
  Guitars,
  Artists,
  Amps,
  type Guitar,
  type ArtistBrief,
  type AmplifierBrief,
} from "../api";

function Admin() {
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [artists, setArtists] = useState<ArtistBrief[]>([]);
  const [amps, setAmps] = useState<AmplifierBrief[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [guitar, setGuitar] = useState<Guitar | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all guitars/artists/amps to choose from
  useEffect(() => {
    Guitars.list().then(setGuitars).catch(console.error);
    Artists.list().then(setArtists).catch(console.error);
    Amps.list().then(setAmps).catch(console.error);
  }, []);

  // When user picks a guitar, fetch details
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    Guitars.get(selectedId)
      .then(setGuitar)
      .finally(() => setLoading(false));
  }, [selectedId]);

  const handleChange = (field: keyof Guitar, value: any) => {
    if (!guitar) return;
    setGuitar((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!guitar) return;
    setSaving(true);
    try {
      // only send editable fields
      const payload = {
        name: guitar.name,
        summary: guitar.summary,
        type: guitar.type,
        yearStart: guitar.yearStart,
        yearEnd: guitar.yearEnd,
        artistIds: guitar.artists?.map((a) => a.id) ?? [],
        relatedIds: guitar.relatedGuitars?.map((g) => g.id) ?? [],
      };

      await Guitars.patch(guitar.id, payload);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Admin: Edit Guitar</h1>

      {/* Select Guitar */}
      <div>
        <label className="block text-sm font-medium">Select Guitar</label>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- Choose a guitar --</option>
          {guitars.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading guitar...</p>}

      {guitar && (
        <>
          {/* Basic fields */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={guitar.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Summary</label>
            <textarea
              value={guitar.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Type</label>
              <input
                value={guitar.type || ""}
                onChange={(e) => handleChange("type", e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Year Start</label>
              <input
                type="number"
                value={guitar.yearStart ?? ""}
                onChange={(e) =>
                  handleChange("yearStart", Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Year End</label>
              <input
                type="number"
                value={guitar.yearEnd ?? ""}
                onChange={(e) =>
                  handleChange("yearEnd", Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          {/* Relationships */}
          <div>
            <label className="block text-sm font-medium">Artists</label>
            <select
              multiple
              value={guitar.artists?.map((a) => String(a.id)) ?? []}
              onChange={(e) =>
                handleChange(
                  "artists",
                  Array.from(e.target.selectedOptions).map((opt) => ({
                    id: Number(opt.value),
                    name: opt.label,
                  }))
                )
              }
              className="border rounded px-2 py-1 w-full h-32"
            >
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

      
          <div>
            <label className="block text-sm font-medium">Related Guitars</label>
            <select
              multiple
              value={guitar.relatedGuitars?.map((g) => String(g.id)) ?? []}
              onChange={(e) =>
                handleChange(
                  "relatedGuitars",
                  Array.from(e.target.selectedOptions).map((opt) => ({
                    id: Number(opt.value),
                    name: opt.label,
                  }))
                )
              }
              className="border rounded px-2 py-1 w-full h-32"
            >
              {guitars
                .filter((g) => g.id !== guitar.id)
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
}

export default Admin;
