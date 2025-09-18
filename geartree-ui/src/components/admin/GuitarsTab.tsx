// src/components/admin/GuitarsTab.tsx
import { useEffect, useState } from "react";
import EntityTab from "./EntityTab";
import { Guitars } from "../../api";
import CreateGuitarButton from "./CreateGuitarButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditRelationsButton } from "./EditRelationsButton";
import type { Guitar } from "../../api";

const patchGuitarScalars = async (guitar: Guitar) => {
  const { id, ...scalars } = guitar;
  if (!id) throw new Error("Guitar ID is missing");
  await Guitars.patch(id, scalars);
};

export default function GuitarsTab() {
  const [allGuitars, setAllGuitars] = useState<Guitar[]>([]);

  useEffect(() => {
    Guitars.list().then(setAllGuitars).catch(console.error);
  }, []);

  return (
    <EntityTab<Guitar>
      title="Guitars"
      listFn={Guitars.list}
      patchFn={patchGuitarScalars}
      createButton={<CreateGuitarButton onCreated={Guitars.list} />}
      searchField="name"
      renderButtons={(guitar, reload) => {
        const relationOptions = allGuitars
          .filter(g => g.id !== guitar.id)
          .map(g => ({ id: g.id, name: g.name }));

        return (
          <div className="flex gap-2">
            <EditScalarsButton
              item={guitar}
              onSave={patchGuitarScalars}
              scalarFields={[
                "name",
                "type",
                "description",
                "summary",
                "yearStart",
                "yearEnd",
                "genres",
                "pickups",
              ]}
              onSaved={reload}
            />
            <EditRelationsButton
              itemId={guitar.id}
              currentRelations={guitar.relatedGuitars.map(({ id, name }) => ({ id, name }))}
              options={relationOptions}
              onAdd={Guitars.addRelated}
              onSaved={reload}
            />
          </div>
        );
      }}
    />
  );
}
