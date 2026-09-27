import path from 'path';
import xml2js from 'xml2js';
import { RASystemCode } from '#/constants/retroachievements.ts';
import type { Config } from '#/types/config.ts';
import { getDatContent } from '#/utils/dat.ts';
import {
  getRASystemGames,
  getRomFileRaHash,
} from '#/utils/retroachievements.ts';
import { findRomFiles } from '#/utils/rom.ts';

export async function dat({
  from,
  dest,
  dat,
  retroachievements,
  system,
  config,
  dryRun,
}: {
  from: string;
  dest: string;
  dat: string;
  retroachievements: boolean;
  system: string;
  config: Config;
  dryRun: boolean;
}) {
  console.log('Analyzing the input DAT file');
  const datContent = await getDatContent(dat);

  if (retroachievements) {
    if (
      !config.retroachievements?.username ||
      !config.retroachievements?.webApiKey
    ) {
      throw new Error('Missing retroachievements config');
    }
    const { username, webApiKey } = config.retroachievements;

    const raList = await getRASystemGames(
      system as keyof typeof RASystemCode,
      username,
      webApiKey,
    );

    for (const game of datContent.datafile.game) {
      const files = await findRomFiles(game.$.name, from);
      if (!files.length) {
        continue;
      }

      if (files.length > 1) {
        console.log('Multifile rom. Unsupported');
        continue;
      }

      const romPath = files[0];

      const hash = await getRomFileRaHash(romPath, system);
      game.rom[0].$.ra_hash = hash;
    }

    const xmlBuilder = new xml2js.Builder();
    const xml = xmlBuilder.buildObject(datContent);
    console.log(xml);
  }
}
