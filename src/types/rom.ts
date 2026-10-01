import { languages, regions } from '#/constants/nointro.ts';
import { validExtensions } from '#/constants/rom.ts';

export type RomExtension = (typeof validExtensions)[number];
export type RomRegion = (typeof regions)[number];
export type RomLanguage = (typeof languages)[number];

export interface RomDescriptor {
  path: string;
  file: string;
  game: string;
  rom: string;
  extension: RomExtension;
  tags: string[];
  rawTags: string[];
  regions: RomRegion[];
  languages: RomLanguage[];
  aftermarket: boolean;
  beta: boolean;
  demo: boolean;
  pirate: boolean;
  revision: number;
  hack: boolean;
  verified: boolean;
  badDump: boolean;
  raHash: string;
  hasCheevos: boolean;
}
