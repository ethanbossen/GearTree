// src/components/admin/AmpsTab.tsx
import { useEffect, useState } from "react";
import EntityTab from "./EntityTab";
import { Amps } from "../../api";
import CreateAmpButton from "./CreateAmpButton";
import { EditScalarsButton } from "./EditScalarsButton";
import { EditRelationsButton } from "./EditRelationsButton";
import type { Amplifier } from "../../api";

const patchAmpScalars = async (amp: Amplifier) => {
  const { id, ...scalars } = amp;
  if (!id) throw new Error("Amp ID is missing");
  await Amps.patch(id, scalars);
};

export default function AmpsTab() {
  const [allAmps, setAllAmps] = useState<Amplifier[]>([]);

  // preload all amps for relation options
  useEffect(() => {
    Amps.list().then(setAllAmps).catch(console.error);
  }, []);

  return (
    <EntityTab<Amplifier>
      title="Amplifiers"
      listFn={Amps.list}
      patchFn={patchAmpScalars}
      createButton={<CreateAmpButton onCreated={Amps.list} />}
      searchField="name"
      renderButtons={(amp, reload) => {
        const relationOptions = allAmps
          .filter(a => a.id !== amp.id)
          .map(a => ({ id: a.id, name: a.name }));

        return (
          <div className="flex gap-2">
            {/* Scalar editing button */}
            <EditScalarsButton
              item={amp}
              onSave={patchAmpScalars}
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
              onSaved={reload}
            />
            {/* Relation editing button */}
            <EditRelationsButton
              itemId={amp.id}
              currentRelations={amp.relatedAmps.map(({ id, name }) => ({ id, name }))}
              options={relationOptions}
              onAdd={Amps.addRelated}
              onSaved={reload}
            />
          </div>
        );
      }}
    />
  );
}
