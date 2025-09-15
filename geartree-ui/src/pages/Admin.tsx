// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import {
  Guitars,
  Artists,
  Amps,
  type Guitar,
  type Artist,
  type Amplifier,
  type ArtistBrief,
  type AmplifierBrief,
} from "../api";

type TabType = 'guitars' | 'artists' | 'amplifiers';

function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('guitars');
  
  // Data lists
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [artists, setArtists] = useState<ArtistBrief[]>([]);
  const [amps, setAmps] = useState<AmplifierBrief[]>([]);
  
  // Selected items
  const [selectedGuitarId, setSelectedGuitarId] = useState<number | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [selectedAmpId, setSelectedAmpId] = useState<number | null>(null);
  
  // Current editing items
  const [currentGuitar, setCurrentGuitar] = useState<Guitar | null>(null);
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [currentAmp, setCurrentAmp] = useState<Amplifier | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    Guitars.list().then(setGuitars).catch(console.error);
    Artists.list().then(setArtists).catch(console.error);
    Amps.list().then(setAmps).catch(console.error);
  };

  // Load selected guitar details
  useEffect(() => {
    if (!selectedGuitarId) {
      setCurrentGuitar(null);
      return;
    }
    setLoading(true);
    Guitars.get(selectedGuitarId)
      .then(setCurrentGuitar)
      .finally(() => setLoading(false));
  }, [selectedGuitarId]);

  // Load selected artist details
  useEffect(() => {
    if (!selectedArtistId) {
      setCurrentArtist(null);
      return;
    }
    setLoading(true);
    Artists.get(selectedArtistId)
      .then(setCurrentArtist)
      .finally(() => setLoading(false));
  }, [selectedArtistId]);

  // Load selected amplifier details
  useEffect(() => {
    if (!selectedAmpId) {
      setCurrentAmp(null);
      return;
    }
    setLoading(true);
    Amps.get(selectedAmpId)
      .then(setCurrentAmp)
      .finally(() => setLoading(false));
  }, [selectedAmpId]);

  // Generic handlers
  const handleGuitarChange = (field: keyof Guitar, value: any) => {
    if (!currentGuitar) return;
    setCurrentGuitar(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleArtistChange = (field: keyof Artist, value: any) => {
    if (!currentArtist) return;
    setCurrentArtist(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleAmpChange = (field: keyof Amplifier, value: any) => {
    if (!currentAmp) return;
    setCurrentAmp(prev => prev ? { ...prev, [field]: value } : prev);
  };

  // Save handlers
 const handleSaveGuitar = async () => {
  if (!currentGuitar) return;
  setSaving(true);
  try {
    const payload = {
      name: currentGuitar.name,
      summary: currentGuitar.summary,
      type: currentGuitar.type,
      yearStart: currentGuitar.yearStart,
      yearEnd: currentGuitar.yearEnd === 0 ? null : currentGuitar.yearEnd,
      artistIds: currentGuitar.artists?.map((a) => a.id) ?? [],
      relatedIds: currentGuitar.relatedGuitars?.map((g) => g.id) ?? [], // Fixed: changed 'relateds' to 'relatedIds'
    };

    await Guitars.patch(currentGuitar.id, payload);
    alert("Guitar saved successfully!");
    loadAllData(); // Refresh lists
  } catch (err) {
    console.error(err);
    alert("Save failed");
  } finally {
    setSaving(false);
  }
};

  const handleSaveArtist = async () => {
    if (!currentArtist) return;
    setSaving(true);
    try {
      const payload = {
        name: currentArtist.name,
        photoUrl: currentArtist.photoUrl,
        heroPhotoUrl: currentArtist.heroPhotoUrl,
        tagline: currentArtist.tagline,
        description: currentArtist.description,
        summary: currentArtist.summary,
        bands: currentArtist.bands || [],
        otherPhotos: currentArtist.otherPhotos || [],
        guitarIds: currentArtist.guitars?.map((g) => g.id) ?? [],
        amplifierIds: currentArtist.amplifiers?.map((a) => a.id) ?? [],
      };

      await Artists.patch(currentArtist.id, payload);
      alert("Artist saved successfully!");
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAmp = async () => {
    if (!currentAmp) return;
    setSaving(true);
    try {
      const payload = {
        name: currentAmp.name,
        photoUrl: currentAmp.photoUrl,
        description: currentAmp.description,
        summary: currentAmp.summary,
        isTube: currentAmp.isTube,
        gainStructure: currentAmp.gainStructure,
        yearStart: currentAmp.yearStart,
        yearEnd: currentAmp.yearEnd,
        priceStart: currentAmp.priceStart,
        priceEnd: currentAmp.priceEnd,
        wattage: currentAmp.wattage,
        speakerConfiguration: currentAmp.speakerConfiguration,
        manufacturer: currentAmp.manufacturer,
        otherPhotos: currentAmp.otherPhotos || [],
        artistIds: currentAmp.artists?.map((a) => a.id) ?? [],
        relatedIds: currentAmp.relatedAmps?.map((a) => a.id) ?? [],
      };

      await Amps.patch(currentAmp.id, payload);
      alert("Amplifier saved successfully!");
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Helper function to handle string arrays
  const handleStringArrayChange = (
    currentArray: string[] | undefined,
    newValue: string,
    setter: (value: string[]) => void
  ) => {
    const items = newValue.split(',').map(item => item.trim()).filter(item => item);
    setter(items);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {[
          { key: 'guitars' as TabType, label: 'Guitars' },
          { key: 'artists' as TabType, label: 'Artists' },
          { key: 'amplifiers' as TabType, label: 'Amplifiers' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-600">Loading...</p>}

      {/* Guitar Tab */}
      {activeTab === 'guitars' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Guitar</label>
            <select
              value={selectedGuitarId ?? ""}
              onChange={(e) => setSelectedGuitarId(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a guitar --</option>
              {guitars.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {currentGuitar && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={currentGuitar.name || ""}
                    onChange={(e) => handleGuitarChange("name", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <input
                    value={currentGuitar.type || ""}
                    onChange={(e) => handleGuitarChange("type", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea
                  value={currentGuitar.summary || ""}
                  onChange={(e) => handleGuitarChange("summary", e.target.value)}
                  className="border rounded px-3 py-2 w-full h-24 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year Start</label>
                  <input
                    type="number"
                    value={currentGuitar.yearStart ?? ""}
                    onChange={(e) => handleGuitarChange("yearStart", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year End</label>
                  <input
                    type="number"
                    value={currentGuitar.yearEnd ?? ""}
                    onChange={(e) => handleGuitarChange("yearEnd", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Artists</label>
                  <select
                    multiple
                    value={currentGuitar.artists?.map((a) => String(a.id)) ?? []}
                    onChange={(e) =>
                      handleGuitarChange(
                        "artists",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Related Guitars</label>
                  <select
                    multiple
                    value={currentGuitar.relatedGuitars?.map((g) => String(g.id)) ?? []}
                    onChange={(e) =>
                      handleGuitarChange(
                        "relatedGuitars",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {guitars
                      .filter((g) => g.id !== currentGuitar.id)
                      .map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveGuitar}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Save Guitar"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Artist Tab */}
      {activeTab === 'artists' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Artist</label>
            <select
              value={selectedArtistId ?? ""}
              onChange={(e) => setSelectedArtistId(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose an artist --</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {currentArtist && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={currentArtist.name || ""}
                    onChange={(e) => handleArtistChange("name", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <input
                    value={currentArtist.tagline || ""}
                    onChange={(e) => handleArtistChange("tagline", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Photo URL</label>
                  <input
                    value={currentArtist.photoUrl || ""}
                    onChange={(e) => handleArtistChange("photoUrl", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Photo URL</label>
                  <input
                    value={currentArtist.heroPhotoUrl || ""}
                    onChange={(e) => handleArtistChange("heroPhotoUrl", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea
                  value={currentArtist.summary || ""}
                  onChange={(e) => handleArtistChange("summary", e.target.value)}
                  className="border rounded px-3 py-2 w-full h-24 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentArtist.description || ""}
                  onChange={(e) => handleArtistChange("description", e.target.value)}
                  className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bands (comma-separated)</label>
                <input
                  value={currentArtist.bands?.join(', ') || ""}
                  onChange={(e) => handleStringArrayChange(
                    currentArtist.bands,
                    e.target.value,
                    (bands) => handleArtistChange("bands", bands)
                  )}
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Band 1, Band 2, Band 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Other Photos (comma-separated URLs)</label>
                <input
                  value={currentArtist.otherPhotos?.join(', ') || ""}
                  onChange={(e) => handleStringArrayChange(
                    currentArtist.otherPhotos,
                    e.target.value,
                    (photos) => handleArtistChange("otherPhotos", photos)
                  )}
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="url1, url2, url3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Guitars</label>
                  <select
                    multiple
                    value={currentArtist.guitars?.map((g) => String(g.id)) ?? []}
                    onChange={(e) =>
                      handleArtistChange(
                        "guitars",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {guitars.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amplifiers</label>
                  <select
                    multiple
                    value={currentArtist.amplifiers?.map((a) => String(a.id)) ?? []}
                    onChange={(e) =>
                      handleArtistChange(
                        "amplifiers",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {amps.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveArtist}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Save Artist"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Amplifier Tab */}
      {activeTab === 'amplifiers' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Amplifier</label>
            <select
              value={selectedAmpId ?? ""}
              onChange={(e) => setSelectedAmpId(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose an amplifier --</option>
              {amps.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {currentAmp && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={currentAmp.name || ""}
                    onChange={(e) => handleAmpChange("name", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manufacturer</label>
                  <input
                    value={currentAmp.manufacturer || ""}
                    onChange={(e) => handleAmpChange("manufacturer", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <input
                  value={currentAmp.photoUrl || ""}
                  onChange={(e) => handleAmpChange("photoUrl", e.target.value)}
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea
                  value={currentAmp.summary || ""}
                  onChange={(e) => handleAmpChange("summary", e.target.value)}
                  className="border rounded px-3 py-2 w-full h-24 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentAmp.description || ""}
                  onChange={(e) => handleAmpChange("description", e.target.value)}
                  className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Wattage</label>
                  <input
                    type="number"
                    value={currentAmp.wattage ?? ""}
                    onChange={(e) => handleAmpChange("wattage", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentAmp.isTube || false}
                      onChange={(e) => handleAmpChange("isTube", e.target.checked)}
                      className="mr-2"
                    />
                    Is Tube Amp
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year Start</label>
                  <input
                    type="number"
                    value={currentAmp.yearStart ?? ""}
                    onChange={(e) => handleAmpChange("yearStart", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year End</label>
                  <input
                    type="number"
                    value={currentAmp.yearEnd ?? ""}
                    onChange={(e) => handleAmpChange("yearEnd", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price Start ($)</label>
                  <input
                    type="number"
                    value={currentAmp.priceStart ?? ""}
                    onChange={(e) => handleAmpChange("priceStart", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price End ($)</label>
                  <input
                    type="number"
                    value={currentAmp.priceEnd ?? ""}
                    onChange={(e) => handleAmpChange("priceEnd", Number(e.target.value))}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gain Structure</label>
                  <input
                    value={currentAmp.gainStructure || ""}
                    onChange={(e) => handleAmpChange("gainStructure", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Speaker Configuration</label>
                  <input
                    value={currentAmp.speakerConfiguration || ""}
                    onChange={(e) => handleAmpChange("speakerConfiguration", e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Other Photos (comma-separated URLs)</label>
                <input
                  value={currentAmp.otherPhotos?.join(', ') || ""}
                  onChange={(e) => handleStringArrayChange(
                    currentAmp.otherPhotos,
                    e.target.value,
                    (photos) => handleAmpChange("otherPhotos", photos)
                  )}
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="url1, url2, url3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Artists</label>
                  <select
                    multiple
                    value={currentAmp.artists?.map((a) => String(a.id)) ?? []}
                    onChange={(e) =>
                      handleAmpChange(
                        "artists",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Related Amplifiers</label>
                  <select
                    multiple
                    value={currentAmp.relatedAmps?.map((a) => String(a.id)) ?? []}
                    onChange={(e) =>
                      handleAmpChange(
                        "relatedAmps",
                        Array.from(e.target.selectedOptions).map((opt) => ({
                          id: Number(opt.value),
                          name: opt.label,
                        }))
                      )
                    }
                    className="border rounded px-3 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500"
                  >
                    {amps
                      .filter((a) => a.id !== currentAmp.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveAmp}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Save Amplifier"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;