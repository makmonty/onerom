import path from 'path';
import { describe, it } from 'vitest';
import { getRomFileRaHash } from '#/utils/retroachievements.ts';
import { expect } from 'vitest';

describe('Retroachievements utils', () => {
  describe('#getRomFileRaHash', () => {
    it('should return the ra hash of the rom', async () => {
      expect(
        await getRomFileRaHash(
          path.join(
            import.meta.dirname,
            '..',
            '..',
            'assets',
            'roms',
            '2048.zip',
          ),
          'nes',
        ),
      ).toBe('be1063151f68c58d712138c568c73c8b');
    });
  });
});
