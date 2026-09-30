import arg from 'arg';
import { copy } from './src/commands/copy.ts';
import { dat } from './src/commands/dat.ts';
import type { Config } from './src/types/config.ts';
import { logger } from '#/utils/logging.ts';

const args = arg({
  '--from': String,
  '--dest': String,
  '--dat': String,
  '--dryrun': Boolean,
  '--system': String,
  '--rausername': String,
  '--rawebapikey': String,
});

const command = args['_'][0];

const from = args['--from'] as string;
const dest = args['--dest'] as string;
const datFile = args['--dat'] as string;
const system = args['--system'] as string;
const raUsername = args['--rausername'] as string;
const raWebApiKey = args['--rawebapikey'] as string;
const retroachievements = Boolean(raUsername && raWebApiKey);

const config: Config = {
  retroachievements: {
    username: raUsername,
    webApiKey: raWebApiKey,
  },
  preferences: [
    {
      type: 'hasCheevos',
      order: [true, false],
    },
    {
      type: 'regions',
      order: ['Spain', 'Europe', 'World', 'USA', 'Japan'],
    },
    {
      type: 'pirate',
      order: [false],
    },
    {
      type: 'badDump',
      order: [false],
    },
  ],
};
const dryRun = Boolean(args['--dryrun']);

// if (dat) {
//   const datContent = await getDatContent(dat);
//   console.log(datContent.datafile.game.find(g => g['$'].name.includes('Zelda'))[0]);
//   process.exit(0);
// }

switch (command) {
  case 'copy':
    copy({
      from,
      dest,
      dat: datFile,
      config,
      dryRun,
    });
    break;
  case 'dat':
    dat({
      from,
      dest,
      dat: datFile,
      config,
      system,
      retroachievements,
      dryRun,
    });
    break;
  default:
    logger.error('No command provided');
}
