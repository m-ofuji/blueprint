import Dexie from 'dexie';
import {exportDB} from 'dexie-export-import';

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

  saveRows = (topos: ITopo[]) => {
    // console.log(topos);
    // this.Topos.bulkPut(topos);
    // console.log('completed');
    for (const t of topos) {
    console.log(t);
      this.save(t);
    }
  }

  deleteTopo = (id: number) => {
    this.Topos.delete(id);
  }

  exportTopos = async () => {
    return await exportDB(this, {
      filter : (table, value) => { return table === 'Topos' },
      progressCallback: (progress) => {
        console.log(progress.completedRows);
        console.log(progress.totalRows);
        if (progress?.totalRows) {
          console.log((progress.completedRows / progress.totalRows) * 100);
        }
        return true; 
      }
    });
  }
}

export interface ITopo {
  id?: number;
  name: string;
  setter: string | undefined;
  grade: number;
  data: ArrayBuffer[];
  createdAt: number;
}