// src/components/admin/ArtistsTab.tsx
import { useEffect, useState } from "react";
import EntityTab from "./EntityTab";
import { Artists, Guitars, Amps } from "../../api";
import CreateArtistButton from "./CreateArtistButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditArtistRelationsButton } from "./EditArtistRelationsButton";
import type { Artist, Guitar, Amplifier } from "../../api";

const patchArtistScalars = async (artist: Artist) => {
  const { id, ...scalars } = artist;
  if (!id) throw new Error("Artist ID is missing");
  await Artists.patch(id, scalars);
};

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
      patchFn={patchArtistScalars}
      createButton={<CreateArtistButton onCreated={Artists.list} />}
      searchField="name"
      renderButtons={(artist, reload) => (
        <div className="flex gap-2">
          <EditScalarsButton
            item={artist}
            onSave={patchArtistScalars}
            scalarFields={["name", "tagline", "description", "summary", "bands"]}
            onSaved={reload}
          />
          <EditArtistRelationsButton
            artistId={artist.id}
            currentGuitars={artist.guitars.map(g => ({ id: g.id, name: g.name }))}
            currentAmps={artist.amplifiers.map(a => ({ id: a.id, name: a.name }))}
            allGuitars={allGuitars.map(g => ({ id: g.id, name: g.name }))}
            allAmps={allAmps.map(a => ({ id: a.id, name: a.name }))}
            onAddGuitar={Artists.addGuitar}
            onAddAmp={Artists.addAmp}
            onSaved={reload}
            title="Edit Artist Relations"
          />
        </div>
      )}
    />
  );
}
