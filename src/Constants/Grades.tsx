import { NumberLiteralType } from "typescript";

export const GRADES: IGrade[] = [
  { id: 1,  name:"8級", color:'#ffffff' },
  { id: 2,  name:"7級", color:'#ffffff' },
  { id: 3,  name:"6級", color:'#ffffff' },
  { id: 4,  name:"5級", color:'#ffffff' },
  { id: 5,  name:"4級", color:'#ffffff' },
  { id: 6,  name:"3級", color:'#ffffff' },
  { id: 7,  name:"2級", color:'#ffffff' },
  { id: 8,  name:"1級", color:'#ffffff' },
  { id: 9,  name:"初段", color:'#ffffff' },
  { id: 10, name:"二段", color:'#ffffff' },
  { id: 11, name:"三段", color:'#ffffff' },
  { id: 12, name:"四段", color:'#ffffff' },
  { id: 13, name:"五段", color:'#ffffff' }
]

export interface IGrade {
  readonly id: number;
  readonly name: string;
  readonly color: string;
}