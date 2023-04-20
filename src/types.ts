export type Nefturian = { address: string; nefturianId: number };

export type Attribute = {
  trait_type: string;
  value: string;
  display_type?: string;
};

export type MetadataType = {
  name: string;
  image: string;
  description: string;
  animation_url?: string;
  attributes: Attribute[];
};

export type MetadataUpdated = {
  metadata: MetadataType;
  isRevealed: boolean;
};

export type ResponseMe = {
  nefturian: Nefturian;
  metadata: MetadataUpdated;
};
