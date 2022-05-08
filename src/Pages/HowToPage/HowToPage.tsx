import { HtmlHTMLAttributes, useState } from 'react';

const HowToOverlay = () => {
  const [shownContent, setShownContent] = useState<string>('zoom');

  const toNext = (contentType: string) => (e: React.MouseEvent<HTMLElement>) => {
    setShownContent(contentType);
  }

  const finish = () => {
    setShownContent('');
    localStorage.setItem('how_to_shown', 'true');
  }

  return (
    <>
      {shownContent === 'zoom' && 
        <div className="how-to how-to-zoom">
          <h5 className="how-to-title"><span/>画像の拡大・縮小</h5>
          <div className="how-to-zoom-img-wrapper">
            <img className="how-to-zoom-img" src="/images/howto/pinch.png"/>
          </div>
          <p>
            ピンチイン・ピンチアウトで画像の縮小・拡大ができます。
          </p>
          <div className="how-to-ok-button" onClick={toNext('rotate')}>OK</div>
        </div>
      }
      {shownContent === 'rotate' && 
        <>
          <div className='how-to-rotate-topo-wrapper-top'/>
          <div className='how-to-rotate-topo-wrapper-right'/>
          <div className='how-to-rotate-topo-wrapper-bottom'/>
          <div className="how-to how-to-rotate-topo">
            <h5 className="how-to-title"><span/>画像を回転する</h5>
            <p>
              このボタンをタップすると、読み込んだ画像を回転できます。
            </p>
            <div className="how-to-ok-button" onClick={toNext('add-mark')}>OK</div>
          </div>
        </>
      }
      {shownContent === 'add-mark' && 
        <div className="how-to how-to-add-mark">
          <h5 className="how-to-title"><span/>マークを付ける</h5>
          <div>
            使用するホールドが画面中央の〇マークに収まるように画像を移動します。
          </div>
          <div>
            位置が決まったら、マークをタップします。
          </div>
          <div className="how-to-ok-button" onClick={toNext('remove-mark')}>OK</div>
        </div>
      }
      {shownContent === 'remove-mark' && 
        <div className="how-to how-to-remove-mark">
          <h5 className="how-to-title"><span/>マークを消す</h5>
          <p>
            間違えたときは、マークをダブルタップすると、マークが消えます。
          </p>
          <div className="how-to-ok-button" onClick={toNext('mark-buttons')}>OK</div>
        </div>
      }
      {shownContent === 'mark-buttons' && 
        <div className="how-to how-to-mark-buttons">
          <h5 className="how-to-title"><span/>マークを変更する。</h5>
          <div className="how-to-mark-buttons-detail">
            <p>
              画面下部のメニューから追加したいマークを変更できます。
            </p>
            <p>
              <div>〇S・Gホールド：</div>
              <div>スタート、ゴールホールド用の赤丸マークです。</div>
            </p>
            <p>
              <div>〇ホールド：</div>
              <div>通常ホールド用の青丸マークです。</div>
            </p>
            <p>
              <div>〇スタート：</div>
              <div>スタートホールド用のSマークです。</div>
            </p>
            <p>
              <div>〇ゴール：</div>
              <div>ゴールホールド用のGマークです。</div>
            </p>
            <p>
              <div>〇スタート右・左：</div>
              <div>セパレートスタートの時に使用します。</div>
            </p>
            <p>
              <div>〇フリーテキスト：</div>
              <div>「ハリボテあり」「足自由」など自由に追加できます。</div>
            </p>
          </div>
          <div className="how-to-ok-button" onClick={toNext('save-topo')}>OK</div>
        </div>
      }
      {shownContent === 'save-topo' && 
        <>
          <div className='how-to-save-topo-wrapper-top'/>
          <div className='how-to-save-topo-wrapper-right'/>
          <div className='how-to-save-topo-wrapper-bottom'/>
          <div className="how-to how-to-save-topo">
            <h5 className="how-to-title"><span/>トポを保存する</h5>
            <p>
              このボタンを押すとトポ保存画面が開きます。保存したトポはトップ画面に表示されます。
            </p>
            <div className="how-to-ok-button" onClick={toNext('download-topo')}>OK</div>
          </div>
          <div className='save-button-hole'></div>
        </>
      }
      {shownContent === 'download-topo' && 
        <>
          <div className='how-to-download-topo-wrapper-top'/>
          <div className='how-to-download-topo-wrapper-right'/>
          <div className='how-to-download-topo-wrapper-bottom'/>
          <div className="how-to how-to-download-topo">
            <h5 className="how-to-title"><span/>画像をダウンロードする</h5>
            <p>
              このボタンを押すと画像を端末にダウンロードできます。
            </p>
            <div className="how-to-ok-button" onClick={finish}>OK</div>
          </div>
        </>
      }
    </>
  )
}

export default HowToOverlay;