// src/components/admin/ArtistsTab.tsx
import { useEffect, useState } from "react";
import EntityTab from "../EntityTab";
import { Artists, Guitars, Amps } from "../../../api";
import CreateItemButton from "../CreateItemButton";
import { EditScalarsButton } from "../EditScalarsButton";
import { EditRelationsButton } from "../EditRelationsButton";
import type { Artist, Guitar, Amplifier } from "../../../types";

export default function ArtistsTab() {
  const [allGuitars, setAllGuitars] = useState<Guitar[]>([]);
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);

  useEffect(() => {
    Guitars.list().then(setAllGuitars).catch(console.error);
    Amps.list().then(setAllAmps).catch(console.error);
  }, []);

  return (
    <EntityTab<Artist>
      title="Artists"
      listFn={Artists.list}
      patchFn={async (artist) => {
        const { id, ...scalars } = artist;
        if (!id) throw new Error("Artist ID is missing");
        await Artists.patch(id, scalars);
      }}
      createButton={<CreateItemButton entityType="artists" onCreated={() => Artists.list()} />}
      searchField="name"
      renderButtons={(artist, handleSave) => (
        <div className="flex gap-2">
          <EditScalarsButton
            item={artist}
            onSave={handleSave} // handled generically
            scalarFields={["name", "tagline", "description", "summary", "bands"]}
            onSaved={() => {}}
          />
          <EditRelationsButton
            itemId={artist.id}
            groups={[
              {
                label: "Guitars",
                current: artist.guitars.map((g) => ({ id: g.id, name: g.name })),
                options: allGuitars.map((g) => ({ id: g.id, name: g.name })),
                onAdd: Artists.addGuitar,
              },
              {
                label: "Amps",
                current: artist.amplifiers.map((a) => ({ id: a.id, name: a.name })),
                options: allAmps.map((a) => ({ id: a.id, name: a.name })),
                onAdd: Artists.addAmp,
              },
            ]}
            title="Edit Artist Relations"
          />
        </div>
      )}
    />
  );
}
