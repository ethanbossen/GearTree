import { useEffect, useState } from "react";
import EntityTab from "../EntityTab";
import { Guitars } from "../../../api";
import CreateItemButton from "../CreateItemButton";
import { EditScalarsButton } from "../EditScalarsButton";
import { EditRelationsButton } from "../EditRelationsButton";
import type { Guitar } from "../../../types";

export default function GuitarsTab() {
  const [allGuitars, setAllGuitars] = useState<Guitar[]>([]);

  useEffect(() => {
    Guitars.list().then(setAllGuitars).catch(console.error);
  }, []);

  return (
    <EntityTab<Guitar>
      title="Guitars"
      listFn={Guitars.list}
      patchFn={async (guitar) => {
        const { id, ...scalars } = guitar;
        if (!id) throw new Error("Guitar ID is missing");
        await Guitars.patch(id, scalars);
      }}
      createButton={<CreateItemButton entityType="guitars" onCreated={() => Guitars.list()} />}
      searchField="name"
      renderButtons={(guitar, handleSave) => {
        // a guitar cannot be related to itself
        const relationOptions = allGuitars
          .filter((g) => g.id !== guitar.id)
          .map((g) => ({ id: g.id, name: g.name }));

        return (
          <div className="flex gap-2">
            <EditScalarsButton
              item={guitar}
              onSave={handleSave}
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
            />
            <EditRelationsButton
              itemId={guitar.id}
              groups={[
                {
                  label: "Related Guitars",
                  current: guitar.relatedGuitars.map(({ id, name }) => ({ id, name })),
                  options: relationOptions,
                  onAdd: Guitars.addRelated,
                },
              ]}
            />
          </div>
        );
      }}
    />
  );
}
