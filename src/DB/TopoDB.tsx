import Dexie from 'dexie';
// import {exportdb} from 

export class TopoDB extends Dexie {
  Topos: Dexie.Table<ITopo, number>;
  
  constructor() {  
    super('TopoDB');

    this.version(1).stores({
      Topos: '++id, data',
    });

    this.Topos = this.table('Topos');
  }

  save = (topo: ITopo) => {
    this.Topos.put(topo);
  }

  deleteTopo = (id: number) => {
    this.Topos.delete(id);
  }

}

export interface ITopo {
  id?: number;
  name: string;
  setter: string | undefined;
  grade: number;
  data: (string | ArrayBuffer)[];
  createdAt: number;
}