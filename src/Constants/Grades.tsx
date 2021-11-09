import { NumberLiteralType } from 'typescript';

export const GRADES: IGrade[] = [
  { id: 1,  name:'8級' },
  { id: 2,  name:'7級' },
  { id: 3,  name:'6級' },
  { id: 4,  name:'5級' },
  { id: 5,  name:'4級' },
  { id: 6,  name:'3級' },
  { id: 7,  name:'2級' },
  { id: 8,  name:'1級' },
  { id: 9,  name:'初段' },
  { id: 10, name:'二段' },
  { id: 11, name:'三段' },
  { id: 12, name:'四段' },
  { id: 13, name:'五段' }
]

export interface IGrade {
  readonly id: number;
  readonly name: string;
}