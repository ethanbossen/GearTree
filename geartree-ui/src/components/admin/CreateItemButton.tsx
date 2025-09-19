// src/components/admin/CreateButton.tsx
import { useState } from "react";
import {
  Button,
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Checkbox,
  Textarea,
  FileButton
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Amps, Artists, Guitars, Upload } from "../../api";

// Define field types for type safety
type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'array' | 'file';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  optional?: boolean;
  arrayDelimiter?: string; // for comma-separated arrays
}

interface EntityConfig {
  name: string; // Display name (e.g., "Amplifier", "Artist", "Guitar")
  apiEndpoint: any; // API endpoint object
  imageFolder: string; // Image folder path
  fields: FieldConfig[];
  photoUrlMapping?: { [key: string]: string }; // Maps photo field names to URL paths
}

// Entity configurations
const ENTITY_CONFIGS: { [key: string]: EntityConfig } = {
  amps: {
    name: "Amplifier",
    apiEndpoint: Amps,
    imageFolder: "amps",
    photoUrlMapping: {
      photoName: "/images/amps/"
    },
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "photoName", label: "Photo filename", type: "file" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "isTube", label: "Tube amplifier", type: "checkbox" },
      { key: "gainStructure", label: "Gain Structure", type: "text" },
      { key: "yearStart", label: "Year Start", type: "number" },
      { key: "yearEnd", label: "Year End", type: "number", optional: true },
      { key: "priceStart", label: "Price Start", type: "number" },
      { key: "priceEnd", label: "Price End", type: "number" },
      { key: "wattage", label: "Wattage", type: "number" },
      { key: "speakerConfiguration", label: "Speaker Configuration", type: "text" },
      { key: "manufacturer", label: "Manufacturer", type: "text" },
    ]
  },
  artists: {
    name: "Artist",
    apiEndpoint: Artists,
    imageFolder: "artists",
    photoUrlMapping: {
      photoName: "/images/artists/",
      heroPhotoName: "/images/artists/artistCont/"
    },
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "photoName", label: "Artist Photo", type: "file"},
      { key: "heroPhotoName", label: "Artist Hero Photo", type: "file" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "bands", label: "Bands (comma-separated)", type: "array", arrayDelimiter: "," },
    ]
  },
  guitars: {
    name: "Guitar",
    apiEndpoint: Guitars,
    imageFolder: "guitars",
    photoUrlMapping: {
      photoName: "/images/guitars/"
    },
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "photoName", label: "Photo", type: "file" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "type", label: "Type", type: "text" },
      { key: "genres", label: "Genres (comma-separated)", type: "array", arrayDelimiter: "," },
      { key: "pickups", label: "Pickups (comma-separated)", type: "array", arrayDelimiter: "," },
      { key: "yearStart", label: "Year Start", type: "number" },
      { key: "yearEnd", label: "Year End", type: "number", optional: true },
    ]
  }
};

interface CreateButtonProps {
  entityType: keyof typeof ENTITY_CONFIGS;
  onCreated?: () => void;
}

function CreateItemButton({ entityType, onCreated }: CreateButtonProps) {
  const config = ENTITY_CONFIGS[entityType];
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  // Initialize empty form based on field configuration
  const getEmptyForm = () => {
    const emptyForm: Record<string, any> = {};
    config.fields.forEach(field => {
      switch (field.type) {
        case 'array':
          emptyForm[field.key] = [];
          break;
        case 'checkbox':
          emptyForm[field.key] = false;
          break;
        case 'number':
          emptyForm[field.key] = undefined;
          break;
        case 'file':
          emptyForm[field.key] = "";
          emptyForm[field.key.replace("Name", "Url")] = "";
          break;
        default:
          emptyForm[field.key] = "";
      }
    });
    // Add otherPhotos array by default
    emptyForm.otherPhotos = [];
    return emptyForm;
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };

      if (config.photoUrlMapping) {
        Object.entries(config.photoUrlMapping).forEach(([photoField, urlPrefix]) => {
          if (form[photoField]) {
            const urlKey = photoField.replace("Name", "Url");
            payload[urlKey] = `${urlPrefix}${form[photoField]}`;
            delete payload[photoField];
          }
        });
      }

      await config.apiEndpoint.create(payload);
      setOpened(false);
      setForm(getEmptyForm());

      notifications.show({
        title: "Success",
        message: `${config.name} created successfully!`,
        color: "green",
      });

      if (onCreated) onCreated();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: `Failed to create ${config.name.toLowerCase()}: ${(err as Error).message}`,
        color: "red",
      });
    }
  };

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      key: field.key,
      label: field.optional ? `${field.label} (optional)` : field.label,
      placeholder: field.placeholder,
    };
    

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={form[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.currentTarget.value)}
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            value={form[field.key]}
            onChange={(val) => handleChange(field.key, val ?? undefined)}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            {...commonProps}
            checked={form[field.key] || false}
            onChange={(e) => handleChange(field.key, e.currentTarget.checked)}
          />
        );

      case 'array':
        const arrayValue = Array.isArray(form[field.key]) ? form[field.key] : [];
        return (
          <TextInput
            {...commonProps}
            value={arrayValue.join(field.arrayDelimiter + " ")}
            onChange={(e) => {
              const values = e.currentTarget.value
                .split(field.arrayDelimiter || ",")
                .map(v => v.trim())
                .filter(v => v.length > 0);
              handleChange(field.key, values);
            }}
          />
        );

      case 'file':
  return (
    <div key={field.key}>
      <FileButton
        onChange={async (file) => {
          if (!file) return;
          try {
            // For guitars, no artist name is needed
            const data = await Upload.uploadFile(file, String(entityType), field.key);

            // Save the returned URL directly
            handleChange(field.key.replace("Name", "Url"), data.url);

            notifications.show({
              title: "Upload Successful",
              message: `${file.name} uploaded!`,
              color: "green",
            });
          } catch (err) {
            notifications.show({
              title: "Upload Failed",
              message: `Failed to upload ${file.name}: ${(err as Error).message}`,
              color: "red",
            });
          }
        }}
        accept="image/*"
      >
        {(props) => (
          <Button {...props} variant="outline">
            {form[field.key.replace("Name", "Url")]
              ? `Change ${field.label}`
              : `Upload ${field.label}`}
          </Button>
        )}
      </FileButton>

      {/* Preview */}
      {form[field.key.replace("Name", "Url")] && (
        <img
          src={form[field.key.replace("Name", "Url")]}
          alt="preview"
          style={{ maxWidth: 150, marginTop: 8 }}
        />
      )}
    </div>
  );


      case 'text':
      default:
        return (
          <TextInput
            {...commonProps}
            value={form[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.currentTarget.value)}
          />
        );
    }
  };

  // Initialize form when modal opens
  const handleOpen = () => {
    setForm(getEmptyForm());
    setOpened(true);
  };

  return (
    <>
      <Button 
        className="bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)]" 
        onClick={handleOpen}
      >
        Create New {config.name}
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Create ${config.name}`}
        size="lg"
      >
        <Stack>
          {config.fields.map(renderField)}
          <Button onClick={handleSubmit}>Save</Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CreateItemButton;