import { useEffect, useState } from "react";
import { fetchGuitarById, patchGuitar } from "../api"; // ✅ use patch

function Admin() {
  const [guitarId, setGuitarId] = useState<number>(2); // hardcoded for now
  const [guitar, setGuitar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGuitarById(guitarId)
      .then(setGuitar)
      .finally(() => setLoading(false));
  }, [guitarId]);

  const handleChange = (field: string, value: any) => {
    setGuitar((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!guitar) return;
    setSaving(true);
    try {
      // ✅ Only send the fields we want to update
      const payload = {
        name: guitar.name,
        summary: guitar.summary,
      };

      await patchGuitar(guitar.id, payload);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin: Edit Guitar</h1>

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

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default Admin;
