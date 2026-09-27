import path from 'path';
import { exec } from 'child_process';
import { buildAuthorization, getGameList } from '@retroachievements/api';
import { RASystemCode } from '#/constants/retroachievements.ts';

export async function getRomFileRaHash(romPath: string, system: string) {
  const hasherPath = path.resolve(
    import.meta.dirname,
    '..',
    '..',
    'bin',
    'RAHasher',
  );

  const hash = await new Promise<string>((resolve, reject) => {
    const command = `${hasherPath} ${system} "${romPath}"`;
    exec(command, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      resolve(stdout);
    });
  });

  return hash.trim();
}

export async function getRASystemGames(
  system: keyof typeof RASystemCode,
  username: string,
  webApiKey: string,
) {
  const authorization = await getRAAuthorization(username, webApiKey);
  const list = await getGameList(authorization, {
    consoleId: RASystemCode[system],
    shouldOnlyRetrieveGamesWithAchievements: true,
    shouldRetrieveGameHashes: true,
  });
  return list;
}

export async function getRAAuthorization(username: string, webApiKey: string) {
  return buildAuthorization({ username, webApiKey });
}
