import { useEffect, useState } from "react";
import EntityTab from "../EntityTab";
import { Amps } from "../../../api";
import CreateItemButton from "../CreateItemButton";
import { EditScalarsButton } from "../EditScalarsButton";
import { EditRelationsButton } from "../EditRelationsButton";
import type { Amplifier } from "../../../api";

export default function AmpsTab() {
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);

  useEffect(() => {
    Amps.list().then(setAllAmps).catch(console.error);
  }, []);

  return (
    <EntityTab<Amplifier>
      title="Amplifiers"
      listFn={Amps.list}
      patchFn={async (amp) => {
        const { id, ...scalars } = amp;
        if (!id) throw new Error("Amp ID is missing");
        await Amps.patch(id, scalars);
      }}
      createButton={<CreateItemButton entityType="amps" onCreated={() => Amps.list()} />}
      searchField="name"
      renderButtons={(amp, handleSave) => {
        const relationOptions = allAmps
          .filter((a) => a.id !== amp.id)
          .map((a) => ({ id: a.id, name: a.name }));

        return (
          <div className="flex gap-2">
            <EditScalarsButton
              item={amp}
              onSave={handleSave} // generic save
              scalarFields={[
                "name",
                "manufacturer",
                "description",
                "summary",
                "isTube",
                "gainStructure",
                "yearStart",
                "yearEnd",
                "priceStart",
                "priceEnd",
                "wattage",
                "speakerConfiguration",
              ]}
            />
            <EditRelationsButton
              itemId={amp.id}
              groups={[
                {
                  label: "Related Amps",
                  current: amp.relatedAmps.map(({ id, name }) => ({ id, name })),
                  options: relationOptions,
                  onAdd: Amps.addRelated,
                },
              ]}
            />
          </div>
        );
      }}
    />
  );
}
