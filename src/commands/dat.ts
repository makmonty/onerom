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
import { getProgressBar, logger } from '#/utils/logging.ts';

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
  logger.info('Analyzing the input DAT file');
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

    const progressBar = getProgressBar();
    progressBar.start(datContent.datafile.game.length, 0, { rom: '-' });

    for (const game of datContent.datafile.game) {
      progressBar.increment(1, { rom: game.$.name });
      const files = await findRomFiles(game.$.name, from);
      if (!files.length) {
        logger.warn('Could not find files for rom %s', game.$.name);
        continue;
      }

      if (files.length > 1) {
        logger.warn('Multifile rom. Unsupported');
        continue;
      }

      const romPath = files[0];

      try {
        const hash = await getRomFileRaHash(romPath, system);
        game.rom[0].$.ra_hash = hash;
      } catch (e) {
        logger.error(
          `Could not obtain hash from file %s: %s`,
          romPath,
          e instanceof Error ? e.message : e,
        );
      }
    }

    progressBar.stop();

    const xmlBuilder = new xml2js.Builder();
    const xml = xmlBuilder.buildObject(datContent);
    // console.log(xml);
  }
}
