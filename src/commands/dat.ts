import type { Config } from '#/types/config.ts';
import { getDatContent } from '#/utils/dat.ts';

export async function dat({
  from,
  dest,
  dat,
  retroAchievements
  dryRun,
}: {
  from: string;
  dest: string;
  dat: string;
  config: Config;
  dryRun: boolean;
}) {
  console.log('Analyzing the input DAT file');
  const datContent = await getDatContent(dat);
  console.log(datContent);
}
