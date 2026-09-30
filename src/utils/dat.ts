import { type Dat } from '#/types/dat.ts';
import fs from 'fs';
import { Parser as XmlParser } from 'xml2js';
import { logger } from './logging.ts';

export async function getDatContent(path: string) {
  logger.info('Reading DAT file %s', path);
  const xmlContent = await fs.promises.readFile(path);
  const parser = new XmlParser();
  const dat = parser.parseStringPromise(xmlContent) as Promise<Dat>;
  return dat;
}

export async function getRomDat(datContent: Dat, rom: string) {
  return datContent.datafile.game.find((game) => game.$.name === rom);
}
