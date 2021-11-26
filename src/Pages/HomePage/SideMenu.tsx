import { Page, List, ListItem } from 'react-onsenui';
import { TopoDB } from '../../DB/TopoDB';
import { downloadBlob } from '../../Functions/DownloadBlob';
import { openFileSelecter } from '../../Functions/OpenFileSelecter';
import { stringToJson } from '../../Functions/StringToJson';
import { ITopo } from '../../DB/TopoDB';
import { BlobToArrayBuffer } from '../../Functions/BlobToArrayBuffer';
import { getCurrentTimestamp } from '../../Functions/CurrentTimestamp';

export type jsonProps = {
  name: string,
  grade: number,
  setter: string,
  createdAt: number,
  data: number[][]
}

const SideMenu = ({updateTopos}: {updateTopos?: (() => void)}) => {
  const exportTopo = async () => {
    const db = new TopoDB();
    const topos = await (await db.Topos.toArray()).map(x => { return {...x, data: x.data.map(y => new Uint8Array(y))} });
    // const  topos
    const blob = new Blob([JSON.stringify(topos)], {type: 'application/json'});
    downloadBlob(blob, `topos_${getCurrentTimestamp()}.json`);
  }

  const typedArrayToBuffer = (array: Uint8Array) => {
      return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
  }

  // const string_to_buffer = (src: string) => {
  //   return (new Uint16Array([].map.call(src, function(c) {
  //     return c.charCodeAt(0)
  //   }))).buffer;
  // }

  const importClicked = () => {
    openFileSelecter(res => {
      if (typeof res === 'string') {
        const json = stringToJson(res);

        if (!json) {
          alert('ファイルの形式が不正です。');
          return;
        }

        console.log(json);
        const data = json.map((x: jsonProps) => {
          // console.log(x.data.map((y: number[]) => typedArrayToBuffer(new Uint8Array(y))));
          return {...x, data: x.data.map((y: number[]) => typedArrayToBuffer(new Uint8Array(y))) }
        });

        const db = new TopoDB();
        for (const d of data) {
          db.save(d);
        }

        // const tables = json.data.data.find((x: any) => x.tableName === 'Topos');
        // if (!tables) return;
        // const db = new TopoDB();
        // for (const x of tables.rows) {
        //   console.log(x);
        //   let dataArray: ArrayBuffer[] = [];

        //   for (const d of x.data) {

        //     BlobToArrayBuffer(new Blob([d], {type: 'image/png'}), (res, eve) => {
        //       const arrBuf = res as ArrayBuffer;
        //       if (arrBuf) {
        //         dataArray.push(arrBuf);
        //       }
        //       if (dataArray.length >= x.data.length) {
        //         const imported = {
        //           name: x.name,
        //           grade: x.grade,
        //           setter: x.setter,
        //           data: dataArray,
        //           createdAt: x.createdAt
        //         }
        //         db.save(imported);
        //       } 
        //     });
        //   }
        // }

        if (updateTopos) {
          updateTopos();
        }
      } else {
        alert('ファイルの形式が不正です。');
      }
    });
  }


  // const importClicked = () => {
  //   openFileSelecter(res => {
  //     if (typeof res === 'string') {
  //       const json = stringToJson(res);

  //       if (!json) {
  //         alert('ファイルの形式が不正です。');
  //         return;
  //       }

  //       const tables = json.data.data.find((x: any) => x.tableName === 'Topos');
  //       if (!tables) return;
  //       const db = new TopoDB();
  //       for (const x of tables.rows) {
  //         console.log(x);
  //         let dataArray: ArrayBuffer[] = [];

  //         for (const d of x.data) {

  //           BlobToArrayBuffer(new Blob([d], {type: 'image/png'}), (res, eve) => {
  //             const arrBuf = res as ArrayBuffer;
  //             if (arrBuf) {
  //               dataArray.push(arrBuf);
  //             }
  //             if (dataArray.length >= x.data.length) {
  //               const imported = {
  //                 name: x.name,
  //                 grade: x.grade,
  //                 setter: x.setter,
  //                 data: dataArray,
  //                 createdAt: x.createdAt
  //               }
  //               db.save(imported);
  //             } 
  //           });
  //         }
  //       }

  //       if (updateTopos) {
  //         updateTopos();
  //       }
  //     } else {
  //       alert('ファイルの形式が不正です。');
  //     }
  //   });
  // }

  return (
    <Page>
      <List>
        <ListItem
          key={1}
          className={'menu-item'}
          tappable
          onClick={exportTopo}
          modifier='longdivider'>
            <i className={'fas fa-database'}/> バックアップ保存
        </ListItem>
        <ListItem 
          key={2}
          className={'menu-item'}
          tappable
          onClick={importClicked}
          modifier='longdivider'>
            <i className={'fas fa-file-import'}/> インポート
        </ListItem>
      </List>
    </Page>
  )
}

export default SideMenu;