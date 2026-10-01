import { describe, expect, it } from 'vitest';
import { Config } from '#/types/config.ts';
import {
  getBestRom,
  getRomClonesFromDat,
  getRomDescriptor,
  getPreferenceMatchingRoms,
  getPreferenceItemMatchingRoms,
} from '#/utils/rom.ts';
import { Dat } from '../../src/types/dat';

const dat: Dat = {
  datafile: {
    game: [
      {
        $: {
          name: 'Some Game (Japan)',
          id: '0001',
        },
        category: ['Games'],
        description: ['Some Game (Japan)'],
        rom: [
          {
            $: {
              name: 'Some Game (Japan)',
            },
          },
        ],
      },
      {
        $: {
          name: 'Some Game (USA)',
          id: '0002',
          cloneofid: '0001',
        },
        category: ['Games'],
        description: ['Some Game (USA)'],
        rom: [
          {
            $: {
              name: 'Some Game (USA)',
            },
          },
        ],
      },
      {
        $: {
          name: 'Some Game (Europe)',
          id: '0003',
          cloneofid: '0001',
        },
        category: ['Games'],
        description: ['Some Game (Europe)'],
        rom: [
          {
            $: {
              name: 'Some Game (Europe)',
            },
          },
        ],
      },
      {
        $: {
          name: 'Other game (Japan)',
          id: '0004',
        },
        category: ['Games'],
        description: ['Other game (Japan)'],
        rom: [
          {
            $: {
              name: 'Other game (Japan)',
            },
          },
        ],
      },
      {
        $: {
          name: 'Other game (Japan)(Rev 1)',
          id: '0005',
          cloneofid: '0004',
        },
        category: ['Games'],
        description: ['Other game (Japan)(Rev 1)'],
        rom: [
          {
            $: {
              name: 'Other game (Japan)(Rev1)',
            },
          },
        ],
      },
      {
        $: {
          name: 'No clone game (Japan)',
          id: '0006',
        },
        category: ['Games'],
        description: ['No clone game (Japan)'],
        rom: [
          {
            $: {
              name: 'No clone game (Japan)',
            },
          },
        ],
      },
    ],
  },
};

describe('Rom utils', () => {
  describe('#getRomDescriptor', () => {
    it('should return the rom information from the rom name', () => {
      expect(
        getRomDescriptor(
          '/home/test/Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
        ),
      ).toEqual({
        path: '/home/test/Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
        file: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
        game: 'Game . Test',
        rom: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1)',
        extension: 'abc',
        tags: ['1999', 'Japan', 'En', 'Fr', 'Es', 'Rev 1'],
        regions: ['Japan'],
        languages: ['En', 'Fr', 'Es'],
        aftermarket: false,
        beta: false,
        demo: false,
        hack: false,
        pirate: false,
        revision: 1,
        verified: false,
        raHash: '',
        hasCheevos: false,
        badDump: false,
        rawTags: ['(1999)', '(Japan)', '[En,Fr,Es]', '(Rev 1)'],
      });
    });

    it('should return the rom information from the rom name and the dat', () => {
      expect(
        getRomDescriptor(
          '/home/test/Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
          {
            $: {
              name: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1)',
              id: '1234',
            },
            rom: [
              {
                $: {
                  name: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1)',
                  status: 'verified',
                },
              },
            ],
          },
        ),
      ).toEqual({
        path: '/home/test/Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
        file: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1).abc',
        game: 'Game . Test',
        rom: 'Game . Test (1999)(Japan)[En,Fr,Es](Rev 1)',
        extension: 'abc',
        tags: ['1999', 'Japan', 'En', 'Fr', 'Es', 'Rev 1'],
        regions: ['Japan'],
        languages: ['En', 'Fr', 'Es'],
        aftermarket: false,
        beta: false,
        demo: false,
        hack: false,
        pirate: false,
        revision: 1,
        badDump: false,
        verified: true,
        hasCheevos: false,
        raHash: '',
        rawTags: ['(1999)', '(Japan)', '[En,Fr,Es]', '(Rev 1)'],
      });
    });

    it('should split tags with comma', () => {
      const parts = getRomDescriptor(
        '/home/test/Game (tag1, tag2) [tag3, tag4] [tag5].abc',
      );
      expect(parts.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
    });
  });

  describe('#getRomClones', () => {
    it('should return all the clones and only the clones', () => {
      expect(getRomClonesFromDat('Some Game (USA)', dat)).toEqual([
        {
          $: {
            name: 'Some Game (Japan)',
            id: '0001',
          },
          category: ['Games'],
          description: ['Some Game (Japan)'],
          rom: [
            {
              $: {
                name: 'Some Game (Japan)',
              },
            },
          ],
        },
        {
          $: {
            name: 'Some Game (USA)',
            id: '0002',
            cloneofid: '0001',
          },
          category: ['Games'],
          description: ['Some Game (USA)'],
          rom: [
            {
              $: {
                name: 'Some Game (USA)',
              },
            },
          ],
        },
        {
          $: {
            name: 'Some Game (Europe)',
            id: '0003',
            cloneofid: '0001',
          },
          category: ['Games'],
          description: ['Some Game (Europe)'],
          rom: [
            {
              $: {
                name: 'Some Game (Europe)',
              },
            },
          ],
        },
      ]);
    });

    it('should return all the clones and only the clones when passing a game that is the original', () => {
      expect(getRomClonesFromDat('Some Game (Japan)', dat)).toEqual([
        {
          $: {
            name: 'Some Game (Japan)',
            id: '0001',
          },
          category: ['Games'],
          description: ['Some Game (Japan)'],
          rom: [
            {
              $: {
                name: 'Some Game (Japan)',
              },
            },
          ],
        },
        {
          $: {
            name: 'Some Game (USA)',
            id: '0002',
            cloneofid: '0001',
          },
          category: ['Games'],
          description: ['Some Game (USA)'],
          rom: [{ $: { name: 'Some Game (USA)' } }],
        },
        {
          $: {
            name: 'Some Game (Europe)',
            id: '0003',
            cloneofid: '0001',
          },
          category: ['Games'],
          description: ['Some Game (Europe)'],
          rom: [{ $: { name: 'Some Game (Europe)' } }],
        },
      ]);
    });

    it('should return only the passed game if there are no clones', () => {
      expect(getRomClonesFromDat('No clone game (Japan)', dat)).toEqual([
        {
          $: {
            name: 'No clone game (Japan)',
            id: '0006',
          },
          category: ['Games'],
          description: ['No clone game (Japan)'],
          rom: [
            {
              $: {
                name: 'No clone game (Japan)',
              },
            },
          ],
        },
      ]);
    });
  });

  describe('#getBestRom', () => {
    it('should return the roms that fulfill the top-most preference if any', () => {
      const roms = [
        'Some Game (Japan)',
        'Some Game (USA)',
        'Some Game (Europe)',
      ];

      const config: Config = {
        preferences: [
          {
            type: 'regions',
            order: ['Europe', 'USA'],
          },
        ],
      };

      const romDescriptors = roms.map((rom) => getRomDescriptor(rom));

      expect(getBestRom(romDescriptors, config)).toEqual(romDescriptors[2]);
    });

    it('should return the roms that fulfill the second preference if any and no rom matches the top preference', () => {
      const roms = [
        'Some Game (Japan)',
        'Some Game (USA)',
        'Some Game (France)',
      ];

      const config: Config = {
        preferences: [
          {
            type: 'regions',
            order: ['Europe', 'USA'],
          },
        ],
      };

      const romDescriptors = roms.map((rom) => getRomDescriptor(rom));

      expect(getBestRom(romDescriptors, config)).toEqual(romDescriptors[1]);
    });
  });

  describe('#getPreferenceMatchingRoms', () => {
    it('should return the roms that match the first item that has matches', () => {
      const roms = [
        'Some Game (Japan)',
        'Some Game (USA)',
        'Some Game (France)',
      ];

      const romDescriptors = roms.map((rom) => getRomDescriptor(rom));

      expect(
        getPreferenceMatchingRoms(romDescriptors, {
          type: 'regions',
          order: ['Spain', 'USA'],
        }),
      ).toEqual([romDescriptors[1]]);
    });
  });

  describe('#getPreferenceItemMatchingRoms', () => {
    it('should return the roms that match a given item of a preference', () => {
      const roms = [
        'Some Game (Japan)',
        'Some Game (USA)',
        'Some Game (France)',
      ];

      const romDescriptors = roms.map((rom) => getRomDescriptor(rom));

      expect(
        getPreferenceItemMatchingRoms(romDescriptors, 'USA', 'regions'),
      ).toEqual([romDescriptors[1]]);
    });
  });
});
