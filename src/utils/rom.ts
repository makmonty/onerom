import fs from 'fs';
import path from 'path';
import {
  regions as nointroRegions,
  languages as nointroLanguages,
} from '#/constants/nointro.ts';
import type { ConfigPreference, Config } from '#/types/config.ts';
import type { Dat, DatGame } from '#/types/dat.ts';
import type {
  RomExtension,
  RomLanguage,
  RomRegion,
  RomDescriptor,
} from '#/types/rom.ts';
import { getDatContent } from './dat.ts';
import { logger } from './logging.ts';

const tagRegEx = /(\[([^\]]*)\])|(\(([^)]*)\))/g;

export function getRomDescriptor(
  romPath: string,
  datGame: DatGame,
): RomDescriptor {
  // Extract file name
  const file = romPath.split('/').pop()!;
  // Remove extension
  const nameSplit = file.split('.');
  const extension = nameSplit.pop()! as unknown as RomExtension;
  const rom = nameSplit.join('.');
  const game = rom.replace(tagRegEx, '').trim();
  const rawTags = [...file.matchAll(tagRegEx)].map(
    (match) => match[1] || match[3],
  );
  const tags = [...file.matchAll(tagRegEx)]
    .map((match) => match[2] || match[4])
    .reduce((acc: string[], tag: string) => {
      tag.split(',').forEach((t) => acc.push(t.trim()));
      return acc;
    }, []);

  const regions = tags.filter((tag) =>
    nointroRegions.includes(tag as any),
  ) as unknown as RomRegion[];
  const languages = tags.filter((tag) =>
    nointroLanguages.includes(tag as any),
  ) as unknown as RomLanguage[];
  const aftermarket = tags.some((tag) => tag.startsWith('Aftermarket'));
  const beta = tags.some((tag) => tag.startsWith('Beta'));
  const demo = tags.some((tag) => tag.startsWith('Demo'));
  const pirate = tags.some((tag) => tag.startsWith('Pirate'));
  const hack = tags.some((tag) => tag.startsWith('Hack'));
  const revision = parseInt(
    tags.find((tag) => tag.startsWith('Rev'))?.match(/\d+/)?.[0] || '0',
  );
  const verified = datGame.rom[0].$.status === 'verified';
  const badDump = datGame.rom[0].$.status === 'baddump';
  const raHash = datGame.rom[0].$.ra_hash || '';
  const hasCheevos = datGame.rom[0].$.ra_enabled === 'true';

  return {
    path: romPath,
    file,
    rom,
    game,
    extension,
    rawTags,
    tags,
    regions,
    languages,
    aftermarket,
    beta,
    demo,
    pirate,
    hack,
    revision,
    verified,
    badDump,
    raHash,
    hasCheevos,
  };
}

export function getRomClonesFromDat(rom: string, dat: Dat) {
  const games = dat.datafile.game;
  const romDat = games.find((game) => game['$'].name === rom);
  if (!romDat) {
    throw new Error(`The rom ${rom} does not exist in the DAT file`);
  }

  const originalId = romDat['$'].cloneofid || romDat['$'].id;

  return games.filter(
    (game) => game['$'].id === originalId || game['$'].cloneofid === originalId,
  );
}

export function getBestRom(romDescriptors: RomDescriptor[], config: Config) {
  let matchingRoms = romDescriptors;
  for (const pref of config.preferences) {
    if (!matchingRoms.length) {
      break;
    }
    matchingRoms = getPreferenceMatchingRoms(matchingRoms, pref);
  }

  return matchingRoms[0] || null;
}

export function getPreferenceMatchingRoms(
  romDescriptors: RomDescriptor[],
  pref: ConfigPreference,
) {
  for (const item of pref.order) {
    const matchingRoms = getPreferenceItemMatchingRoms(
      romDescriptors,
      item,
      pref.type,
    );

    if (matchingRoms.length) {
      return matchingRoms;
    }
  }
  return [];
}

export function getPreferenceItemMatchingRoms(
  romDescriptors: RomDescriptor[],
  item: ConfigPreference['order']['0'],
  type: ConfigPreference['type'],
) {
  return romDescriptors.filter((romDesc) =>
    Array.isArray(romDesc[type])
      ? romDesc[type].includes(item)
      : romDesc[type] === item,
  );
}

export async function getRomGroupsFromDat(dat: Dat, dir: string) {
  logger.info('Shaping the data');
  const groups: Record<string, RomDescriptor[]> = {};

  for await (const gameDat of dat.datafile.game) {
    const files = await findRomFiles(gameDat.$.name, dir);
    if (!files.length) {
      continue;
    }
    const descriptor = getRomDescriptor(files[0], gameDat);
    const groupId = gameDat.$.cloneofid || gameDat.$.id;
    groups[groupId] ||= [];
    groups[groupId].push(descriptor);
  }

  return groups;
}

export async function findRomFiles(rom: string, dir: string) {
  const globPattern = path.join(dir, rom) + '.*';
  const fileExists = fs.promises.glob(globPattern);
  const files = [];
  for await (const file of fileExists) {
    files.push(file);
  }
  return files;
}

// export async function getRomDescriptorsFromDir(dir: string) {
//   const files = await fs.promises.readdir(dir);
//   return files
//     .filter((file) => {
//       const ext = file.split('.').pop();
//       return validExtensions.includes(ext as any);
//     })
//     .map((file) => path.join(dir, file))
//     .map((file) => getRomDescriptor(file));
// }

export async function getBestRoms({
  from,
  dat,
  config,
}: {
  from: string;
  dat: string;
  config: Config;
}) {
  const datContent = await getDatContent(dat);
  const groups = await getRomGroupsFromDat(datContent, from);
  logger.info(`${Object.keys(groups).length} original roms found`);

  const bestRoms: Array<RomDescriptor> = [];
  Object.values(groups).forEach((group) => {
    const bestRom = getBestRom(group, config);
    if (bestRom) {
      bestRoms.push(bestRom);
    }
  });

  return bestRoms;
}
