import fs from 'fs';
import path from 'path';
import type { Config } from '#/types/config.ts';
import { getBestRoms } from '#/utils/rom.ts';
import { getProgressBar, logger } from '#/utils/logging.ts';

export async function copy({
  from,
  dest,
  dat,
  config,
  dryRun,
}: {
  from: string;
  dest: string;
  dat: string;
  config: Config;
  dryRun: boolean;
}) {
  logger.info('Analyzing the roms');
  const bestRoms = await getBestRoms({
    from,
    dat,
    config,
  });

  logger.info(`Copying${dryRun ? ' DRY RUN' : ''}`);
  const progressBar = getProgressBar();
  progressBar.start(bestRoms.length, 0, { rom: '-' });

  for await (const rom of bestRoms) {
    const newPath = path.join(dest, rom.file);
    if (!dryRun) {
      await fs.promises.copyFile(rom.path, newPath);
    }
    progressBar.increment(1, { rom: rom.file });
  }
  progressBar.stop();
}
