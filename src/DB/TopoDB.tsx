import Dexie from 'dexie';
import { exportDB } from 'dexie-export-import';

export class TopoDB extends Dexie {
  Topos: Dexie.Table<ITopo, number> | undefined;
  
  constructor() {  
    super('TopoDB');

    this.version(1).stores({
      Topos: '++id, data',
    });

    // alert('constructor before');
    this.Topos = this.table('Topos');
    // alert('constructor after');
  }

  save = (topo: ITopo) => {
    this.Topos?.put(topo);
  }

  saveRows = (topos: ITopo[]) => {
    for (const t of topos) {
      this.save(t);
    }
  }

  deleteTopo = (id: number) => {
    this.Topos?.delete(id);
  }

  exportTopos = async () => {
    return await exportDB(this, {
      filter : (table, value) => { return table === 'Topos' },
      progressCallback: (progress) => {
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