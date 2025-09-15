// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Tabs,
  Select,
  TextInput,
  Textarea,
  NumberInput,
  Checkbox,
  MultiSelect,
  Button,
  Group,
  Stack,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from '@mantine/notifications';

import { useForm,  } from "@mantine/form";
import {
  Guitars,
  Artists,
  Amps,
  type ArtistBrief,
  type AmplifierBrief,
  type GuitarBrief,
} from "../api";

type TabType = 'guitars' | 'artists' | 'amplifiers';

function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('guitars');
  
  // Data lists
  const [guitars, setGuitars] = useState<GuitarBrief[]>([]);
  const [artists, setArtists] = useState<ArtistBrief[]>([]);
  const [amps, setAmps] = useState<AmplifierBrief[]>([]);
  
  // Selected items
  const [selectedGuitarId, setSelectedGuitarId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedAmpId, setSelectedAmpId] = useState<string | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mantine forms
  const guitarForm = useForm({
    initialValues: {
      name: '',
      type: '',
      photoUrl: '',
      summary: '',
      description: '',
      yearStart: 0,
      yearEnd: null as number | null,
      pickups: [] as string[],
      genres: [] as string[],
      artists: [] as string[],
      relatedGuitars: [] as string[],
    },
  });

  const artistForm = useForm({
    initialValues: {
      name: '',
      photoUrl: '',
      heroPhotoUrl: '',
      tagline: '',
      description: '',
      summary: '',
      bands: [] as string[],
      otherPhotos: [] as string[],
      guitars: [] as string[],
      amplifiers: [] as string[],
    },
  });

  const ampForm = useForm({
    initialValues: {
      name: '',
      photoUrl: '',
      description: '',
      summary: '',
      isTube: false,
      gainStructure: '',
      yearStart: 0,
      yearEnd: 0,
      priceStart: 0,
      priceEnd: 0,
      wattage: 0,
      speakerConfiguration: '',
      manufacturer: '',
      otherPhotos: [] as string[],
      artists: [] as string[],
      relatedAmps: [] as string[],
    },
  });

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [guitarData, artistData, ampData] = await Promise.all([
        Guitars.list(),
        Artists.list(),
        Amps.list(),
      ]);
      setGuitars(guitarData);
      setArtists(artistData);
      setAmps(ampData);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load data',
        color: 'red',
      });
    }
  };

  // Load selected guitar details
  useEffect(() => {
    if (!selectedGuitarId) {
      guitarForm.reset();
      return;
    }
    loadGuitar(Number(selectedGuitarId));
  }, [selectedGuitarId]);

  const loadGuitar = async (id: number) => {
    setLoading(true);
    try {
      const guitar = await Guitars.get(id);
      guitarForm.setValues({
        name: guitar.name || '',
        type: guitar.type || '',
        photoUrl: guitar.photoUrl || '',
        summary: guitar.summary || '',
        description: guitar.description || '',
        yearStart: guitar.yearStart || 0,
        yearEnd: guitar.yearEnd,
        pickups: guitar.pickups || [],
        genres: guitar.genres || [],
        artists: guitar.artists?.map(a => String(a.id)) || [],
        relatedGuitars: guitar.relatedGuitars?.map(g => String(g.id)) || [],
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load guitar',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load selected artist details
  useEffect(() => {
    if (!selectedArtistId) {
      artistForm.reset();
      return;
    }
    loadArtist(Number(selectedArtistId));
  }, [selectedArtistId]);

  const loadArtist = async (id: number) => {
    setLoading(true);
    try {
      const artist = await Artists.get(id);
      artistForm.setValues({
        name: artist.name || '',
        photoUrl: artist.photoUrl || '',
        heroPhotoUrl: artist.heroPhotoUrl || '',
        tagline: artist.tagline || '',
        description: artist.description || '',
        summary: artist.summary || '',
        bands: artist.bands || [],
        otherPhotos: artist.otherPhotos || [],
        guitars: artist.guitars?.map(g => String(g.id)) || [],
        amplifiers: artist.amplifiers?.map(a => String(a.id)) || [],
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load artist',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load selected amplifier details
  useEffect(() => {
    if (!selectedAmpId) {
      ampForm.reset();
      return;
    }
    loadAmp(Number(selectedAmpId));
  }, [selectedAmpId]);

  const loadAmp = async (id: number) => {
    setLoading(true);
    try {
      const amp = await Amps.get(id);
      ampForm.setValues({
        name: amp.name || '',
        photoUrl: amp.photoUrl || '',
        description: amp.description || '',
        summary: amp.summary || '',
        isTube: amp.isTube || false,
        gainStructure: amp.gainStructure || '',
        yearStart: amp.yearStart || 0,
        yearEnd: amp.yearEnd || 0,
        priceStart: amp.priceStart || 0,
        priceEnd: amp.priceEnd || 0,
        wattage: amp.wattage || 0,
        speakerConfiguration: amp.speakerConfiguration || '',
        manufacturer: amp.manufacturer || '',
        otherPhotos: amp.otherPhotos || [],
        artists: amp.artists?.map(a => String(a.id)) || [],
        relatedAmps: amp.relatedAmps?.map(a => String(a.id)) || [],
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load amplifier',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save handlers using dedicated endpoints
  const handleSaveGuitar = async (values: typeof guitarForm.values) => {
    if (!selectedGuitarId) return;
    
    setSaving(true);
    try {
      const guitarId = Number(selectedGuitarId);
      const currentGuitar = await Guitars.get(guitarId);
      
      // Update basic guitar info
      const payload = {
        name: values.name,
        type: values.type,
        photoUrl: values.photoUrl,
        summary: values.summary,
        description: values.description,
        yearStart: values.yearStart,
        yearEnd: values.yearEnd === 0 ? null : values.yearEnd,
        pickups: values.pickups,
        genres: values.genres,
      };

      await Guitars.patch(guitarId, payload);

      // Handle artist relationships
      const currentArtistIds = currentGuitar.artists?.map(a => a.id) || [];
      const newArtistIds = values.artists.map(id => Number(id));
      
      // Remove artists that are no longer selected
      for (const artistId of currentArtistIds) {
        if (!newArtistIds.includes(artistId)) {
          await Guitars.removeArtist(guitarId, artistId);
        }
      }
      
      // Add newly selected artists
      for (const artistId of newArtistIds) {
        if (!currentArtistIds.includes(artistId)) {
          await Guitars.addArtist(guitarId, artistId);
        }
      }

      // Handle related guitar relationships
      const currentRelatedIds = currentGuitar.relatedGuitars?.map(g => g.id) || [];
      const newRelatedIds = values.relatedGuitars.map(id => Number(id));
      
      // Remove related guitars that are no longer selected
      for (const relatedId of currentRelatedIds) {
        if (!newRelatedIds.includes(relatedId)) {
          await Guitars.removeRelated(guitarId, relatedId);
        }
      }
      
      // Add newly selected related guitars
      for (const relatedId of newRelatedIds) {
        if (!currentRelatedIds.includes(relatedId)) {
          await Guitars.addRelated(guitarId, relatedId);
        }
      }

      notifications.show({
        title: 'Success',
        message: 'Guitar saved successfully!',
        color: 'green',
      });
      
      await loadAllData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save guitar',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveArtist = async (values: typeof artistForm.values) => {
    if (!selectedArtistId) return;
    
    setSaving(true);
    try {
      const artistId = Number(selectedArtistId);
      const currentArtist = await Artists.get(artistId);
      
      // Update basic artist info
      const payload = {
        name: values.name,
        photoUrl: values.photoUrl,
        heroPhotoUrl: values.heroPhotoUrl,
        tagline: values.tagline,
        description: values.description,
        summary: values.summary,
        bands: values.bands,
        otherPhotos: values.otherPhotos,
      };

      await Artists.patch(artistId, payload);

      // Handle guitar relationships
      const currentGuitarIds = currentArtist.guitars?.map(g => g.id) || [];
      const newGuitarIds = values.guitars.map(id => Number(id));
      
      for (const guitarId of currentGuitarIds) {
        if (!newGuitarIds.includes(guitarId)) {
          await Artists.removeGuitar(artistId, guitarId);
        }
      }
      
      for (const guitarId of newGuitarIds) {
        if (!currentGuitarIds.includes(guitarId)) {
          await Artists.addGuitar(artistId, guitarId);
        }
      }

      // Handle amplifier relationships
      const currentAmpIds = currentArtist.amplifiers?.map(a => a.id) || [];
      const newAmpIds = values.amplifiers.map(id => Number(id));
      
      for (const ampId of currentAmpIds) {
        if (!newAmpIds.includes(ampId)) {
          await Artists.removeAmp(artistId, ampId);
        }
      }
      
      for (const ampId of newAmpIds) {
        if (!currentAmpIds.includes(ampId)) {
          await Artists.addAmp(artistId, ampId);
        }
      }

      notifications.show({
        title: 'Success',
        message: 'Artist saved successfully!',
        color: 'green',
      });
      
      await loadAllData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save artist',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAmp = async (values: typeof ampForm.values) => {
    if (!selectedAmpId) return;
    
    setSaving(true);
    try {
      const ampId = Number(selectedAmpId);
      const currentAmp = await Amps.get(ampId);
      
      // Update basic amp info
      const payload = {
        name: values.name,
        photoUrl: values.photoUrl,
        description: values.description,
        summary: values.summary,
        isTube: values.isTube,
        gainStructure: values.gainStructure,
        yearStart: values.yearStart,
        yearEnd: values.yearEnd,
        priceStart: values.priceStart,
        priceEnd: values.priceEnd,
        wattage: values.wattage,
        speakerConfiguration: values.speakerConfiguration,
        manufacturer: values.manufacturer,
        otherPhotos: values.otherPhotos,
      };

      await Amps.patch(ampId, payload);

      // Handle artist relationships
      const currentArtistIds = currentAmp.artists?.map(a => a.id) || [];
      const newArtistIds = values.artists.map(id => Number(id));
      
      for (const artistId of currentArtistIds) {
        if (!newArtistIds.includes(artistId)) {
          await Amps.removeArtist(ampId, artistId);
        }
      }
      
      for (const artistId of newArtistIds) {
        if (!currentArtistIds.includes(artistId)) {
          await Amps.addArtist(ampId, artistId);
        }
      }

      // Handle related amp relationships
      const currentRelatedIds = currentAmp.relatedAmps?.map(a => a.id) || [];
      const newRelatedIds = values.relatedAmps.map(id => Number(id));
      
      for (const relatedId of currentRelatedIds) {
        if (!newRelatedIds.includes(relatedId)) {
          await Amps.removeRelated(ampId, relatedId);
        }
      }
      
      for (const relatedId of newRelatedIds) {
        if (!currentRelatedIds.includes(relatedId)) {
          await Amps.addRelated(ampId, relatedId);
        }
      }

      notifications.show({
        title: 'Success',
        message: 'Amplifier saved successfully!',
        color: 'green',
      });
      
      await loadAllData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save amplifier',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  // Helper function to convert array to MultiSelect format
  const arrayToSelectData = (items: { id: number; name: string }[]) =>
    items.map(item => ({ value: String(item.id), label: item.name }));

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Admin Dashboard</Title>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as TabType)}>
        <Tabs.List>
          <Tabs.Tab value="guitars">Guitars</Tabs.Tab>
          <Tabs.Tab value="artists">Artists</Tabs.Tab>
          <Tabs.Tab value="amplifiers">Amplifiers</Tabs.Tab>
        </Tabs.List>

        {/* Guitar Tab */}
        <Tabs.Panel value="guitars" pt="md">
          <Stack>
            <Select
              label="Select Guitar"
              placeholder="Choose a guitar to edit"
              value={selectedGuitarId}
              onChange={setSelectedGuitarId}
              data={arrayToSelectData(guitars)}
              searchable
            />

            {selectedGuitarId && (
              <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={loading} />
                
                <form onSubmit={guitarForm.onSubmit(handleSaveGuitar)}>
                  <Stack>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Name"
                          required
                          {...guitarForm.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Type"
                          {...guitarForm.getInputProps('type')}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Photo URL"
                      {...guitarForm.getInputProps('photoUrl')}
                    />

                    <Textarea
                      label="Summary"
                      rows={3}
                      {...guitarForm.getInputProps('summary')}
                    />

                    <Textarea
                      label="Description"
                      rows={4}
                      {...guitarForm.getInputProps('description')}
                    />

                    <Grid>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Year Start"
                          {...guitarForm.getInputProps('yearStart')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Year End"
                          {...guitarForm.getInputProps('yearEnd')}
                        />
                      </Grid.Col>
                    </Grid>

           <Grid>
  <Grid.Col span={6}>
    <MultiSelect
      label="Pickups"
      placeholder="Add pickup configurations"
      searchable
      data={guitarForm.values.pickups.map((p) => ({ value: p, label: p }))}
      value={guitarForm.values.pickups}
      onChange={(value) => guitarForm.setFieldValue("pickups", value)}
      onSearchChange={(query) => {
        if (
          query &&
          !guitarForm.values.pickups.includes(query)
        ) {
          guitarForm.setFieldValue("pickups", [
            ...guitarForm.values.pickups,
            query,
          ]);
        }
      }}
    />
  </Grid.Col>

  <Grid.Col span={6}>
    <MultiSelect
      label="Genres"
      placeholder="Add genres"
      searchable
      data={guitarForm.values.genres.map((g) => ({ value: g, label: g }))}
      value={guitarForm.values.genres}
      onChange={(value) => guitarForm.setFieldValue("genres", value)}
      onSearchChange={(query) => {
        if (
          query &&
          !guitarForm.values.genres.includes(query)
        ) {
          guitarForm.setFieldValue("genres", [
            ...guitarForm.values.genres,
            query,
          ]);
        }
      }}
    />
  </Grid.Col>
</Grid>


                    <Grid>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Artists"
                          data={arrayToSelectData(artists)}
                          searchable
                          {...guitarForm.getInputProps('artists')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Related Guitars"
                          data={arrayToSelectData(guitars.filter(g => g.id !== Number(selectedGuitarId)))}
                          searchable
                          {...guitarForm.getInputProps('relatedGuitars')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button type="submit" loading={saving}>
                        Save Guitar
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </div>
            )}
          </Stack>
        </Tabs.Panel>

        {/* Artist Tab */}
        <Tabs.Panel value="artists" pt="md">
          <Stack>
            <Select
              label="Select Artist"
              placeholder="Choose an artist to edit"
              value={selectedArtistId}
              onChange={setSelectedArtistId}
              data={arrayToSelectData(artists)}
              searchable
            />

            {selectedArtistId && (
              <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={loading} />
                
                <form onSubmit={artistForm.onSubmit(handleSaveArtist)}>
                  <Stack>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Name"
                          required
                          {...artistForm.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Tagline"
                          {...artistForm.getInputProps('tagline')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Photo URL"
                          {...artistForm.getInputProps('photoUrl')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Hero Photo URL"
                          {...artistForm.getInputProps('heroPhotoUrl')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Textarea
                      label="Summary"
                      rows={3}
                      {...artistForm.getInputProps('summary')}
                    />

                    <Textarea
                      label="Description"
                      rows={4}
                      {...artistForm.getInputProps('description')}
                    />

                 <MultiSelect
  label="Bands"
  placeholder="Add bands"
  searchable
  data={artistForm.values.bands.map((b) => ({ value: b, label: b }))}
  value={artistForm.values.bands}
  onChange={(value) => artistForm.setFieldValue("bands", value)}
  onSearchChange={(query) => {
    if (query && !artistForm.values.bands.includes(query)) {
      artistForm.setFieldValue("bands", [...artistForm.values.bands, query]);
    }
  }}
/>


                    <MultiSelect
  label="Other Photos"
  placeholder="Add photo URLs"
  searchable
  data={artistForm.values.otherPhotos.map((p) => ({ value: p, label: p }))}
  value={artistForm.values.otherPhotos}
  onChange={(value) => artistForm.setFieldValue("otherPhotos", value)}
  onSearchChange={(query) => {
    if (query && !artistForm.values.otherPhotos.includes(query)) {
      artistForm.setFieldValue("otherPhotos", [
        ...artistForm.values.otherPhotos,
        query,
      ]);
    }
  }}
/>


                    <Grid>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Guitars"
                          data={arrayToSelectData(guitars)}
                          searchable
                          {...artistForm.getInputProps('guitars')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Amplifiers"
                          data={arrayToSelectData(amps)}
                          searchable
                          {...artistForm.getInputProps('amplifiers')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button type="submit" loading={saving}>
                        Save Artist
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </div>
            )}
          </Stack>
        </Tabs.Panel>

        {/* Amplifier Tab */}
        <Tabs.Panel value="amplifiers" pt="md">
          <Stack>
            <Select
              label="Select Amplifier"
              placeholder="Choose an amplifier to edit"
              value={selectedAmpId}
              onChange={setSelectedAmpId}
              data={arrayToSelectData(amps)}
              searchable
            />

            {selectedAmpId && (
              <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={loading} />
                
                <form onSubmit={ampForm.onSubmit(handleSaveAmp)}>
                  <Stack>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Name"
                          required
                          {...ampForm.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Manufacturer"
                          {...ampForm.getInputProps('manufacturer')}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Photo URL"
                      {...ampForm.getInputProps('photoUrl')}
                    />

                    <Textarea
                      label="Summary"
                      rows={3}
                      {...ampForm.getInputProps('summary')}
                    />

                    <Textarea
                      label="Description"
                      rows={4}
                      {...ampForm.getInputProps('description')}
                    />

                    <Grid>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Wattage"
                          {...ampForm.getInputProps('wattage')}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Checkbox
                          label="Is Tube Amp"
                          mt="xl"
                          {...ampForm.getInputProps('isTube', { type: 'checkbox' })}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Year Start"
                          {...ampForm.getInputProps('yearStart')}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Year End"
                          {...ampForm.getInputProps('yearEnd')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Price Start ($)"
                          {...ampForm.getInputProps('priceStart')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Price End ($)"
                          {...ampForm.getInputProps('priceEnd')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Gain Structure"
                          {...ampForm.getInputProps('gainStructure')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Speaker Configuration"
                          {...ampForm.getInputProps('speakerConfiguration')}
                        />
                      </Grid.Col>
                    </Grid>
<MultiSelect
  label="Other Photos"
  placeholder="Add photo URLs"
  searchable
  data={ampForm.values.otherPhotos.map((p) => ({ value: p, label: p }))}
  value={ampForm.values.otherPhotos}
  onChange={(value) => ampForm.setFieldValue("otherPhotos", value)}
  onSearchChange={(query) => {
    if (query && !ampForm.values.otherPhotos.includes(query)) {
      ampForm.setFieldValue("otherPhotos", [
        ...ampForm.values.otherPhotos,
        query,
      ]);
    }
  }}
/>


                    <Grid>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Artists"
                          data={arrayToSelectData(artists)}
                          searchable
                          {...ampForm.getInputProps('artists')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <MultiSelect
                          label="Related Amplifiers"
                          data={arrayToSelectData(amps.filter(a => a.id !== Number(selectedAmpId)))}
                          searchable
                          {...ampForm.getInputProps('relatedAmps')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button type="submit" loading={saving}>
                        Save Amplifier
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </div>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default Admin;