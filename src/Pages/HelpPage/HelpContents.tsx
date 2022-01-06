export interface HelpContents {
  buttonTitle: string,
  title: string,
  pages: HelpPageContents[]
}

export interface HelpPageContents {
  text: string,
  img: string
}

export const HELP_CONTENTS: HelpContents[] = [
  {
    buttonTitle: 'マークを追加したい',
    title: 'マークを追加するには',
    pages:[
      {
        text: 'メニューから追加したいマークを選びます。',
        img: '/images/help/1/1_1.png'
      },
      {
        text: '追加したい場所に画像を移動し、中央の画面中央のマークをタップします。',
        img: '/images/help/1/1_2.png'
      },
      {
        text: 'マークが追加されます。',
        img: '/images/help/1/1_3.png'
      }
    ]
  },
  {
    buttonTitle: 'マークを削除したい',
    title: 'マークを削除するには',
    pages:[
      {
        text: 'マークをダブルタップします。',
        img: '/images/help/1/1_1.png'
      }
    ]
  },
  {
    buttonTitle: 'トポ画像を保存したい',
    title: 'トポ画像を保存するには',
    pages:[
      {
        text: '画面左下のボタンをタップします。',
        img: '/images/help/1/1_1.png'
      },
      {
        text: '必要事項を入力して保存します。',
        img: '/images/help/1/1_1.png'
      }
    ]
  },
  {
    buttonTitle: 'トポ画像をダウンロードしたい',
    title: 'トポ画像をダウンロードするには',
    pages:[
      {
        text: '画面左下のボタンをタップします。',
        img: '/images/help/1/1_1.png'
      },
      {
        text: '必要事項を入力して保存します。',
        img: '/images/help/1/1_1.png'
      }
    ]
  }
];