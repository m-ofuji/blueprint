import { Page, List, ListItem, Navigator } from 'react-onsenui';
import { TopoDB } from '../../DB/TopoDB';
import { downloadBlob } from '../../Functions/DownloadBlob';
import { openFileSelecter } from '../../Functions/OpenFileSelecter';
import { stringToJson } from '../../Functions/StringToJson';
import { getCurrentTimestamp } from '../../Functions/CurrentTimestamp';
import { uint8ArrayToBuffer } from '../../Functions/Uint8ArrayToBuffer';

const SideMenu = ({openHelpPage, updateTopos}: 
  { openHelpPage?: () => void, updateTopos?: () => void }) => {
  const exportTopo = async () => {
    const db = new TopoDB();
    const topos = await (await db.Topos?.toArray())?.map(x => { return {...x, data: x.data.map(y => new Uint8Array(y))} });
    const blob = new Blob([JSON.stringify(topos)], {type: 'application/json'});
    downloadBlob(blob, `topos_${getCurrentTimestamp()}.json`);
  }

  const importClicked = () => {
    openFileSelecter(res => {
      if (typeof res === 'string') {
        const json = stringToJson(res);

        if (!json) {
          alert('ファイルの形式が不正です。');
          return;
        }

        const data = json.map((x: {
          name: string,
          grade: number,
          setter: string,
          createdAt: number,
          data: number[][]
        }) => {
          return  {
            name: x.name,
            grade: x.grade,
            setter: x.setter,
            data: x.data.map((y: number[]) => uint8ArrayToBuffer(Uint8Array.from(Object.entries(y).map(([key, value]) => value)))),
            createdAt: x.createdAt
          }
        });

        const db = new TopoDB();
        for (const d of data) {
          db.save(d);
        }

        if (updateTopos) {
          updateTopos();
        }
      } else {
        alert('ファイルの形式が不正です。');
      }
    });
  }

  const helpClicked = () => {
    if (openHelpPage) {
      openHelpPage();
    }
  }

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
        <ListItem 
          key={3}
          className={'menu-item'}
          tappable
          onClick={helpClicked}
          modifier='longdivider'>
            <i className={'fas fa-file-import'}/> 使い方
        </ListItem>
      </List>
    </Page>
  )
}

export default SideMenu;