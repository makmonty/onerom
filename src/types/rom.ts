import { languages, regions } from '#/constants/nointro.ts';
import { validExtensions } from '#/constants/rom.ts';

export type RomExtension = typeof validExtensions;
export type RomRegion = typeof regions;
export type RomLanguage = typeof languages;

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
