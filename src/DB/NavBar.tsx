import Dexie from "dexie";

export class TopoDb extends Dexie {
  TopoImages: Dexie.Table<ITopo, number>;
  
  constructor() {  
    super("TopoDB");

    this.version(1).stores({
      TopoImages: '++id, data',
    });
    
    this.TopoImages = this.table("TopoImages");
  }

  save = (topo: ITopo) => {
    this.TopoImages.put(topo);
  }
}

export interface ITopo {
  id?: number;
  name: string;
  grade: number;
  data: string | ArrayBuffer;
  createdAt: number;
}