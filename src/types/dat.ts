export type DatGameRomStatus = 'verified' | 'baddump';

export interface DatGameRom {
  $: {
    name: string;
    status: DatGameRomStatus;
    size?: string;
    crc?: string;
    md5?: string;
    sha1?: string;
    sha256?: string;
    serial?: string;
    ra_hash?: string;
    ra_enabled?: 'true' | 'false';
  };
}

export interface DatGame {
  $: {
    name: string;
    id: string;
    cloneofid?: string;
    cloneof?: string;
  };
  category: string[];
  description: string[];
  rom: Array<DatGameRom>;
}

export interface Dat {
  datafile: {
    game: Array<DatGame>;
  };
}
