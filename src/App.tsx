import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './App.css';
import { NaviPage } from './Pages/NaviPage';
import { BrowserRouter } from "react-router-dom"

export const App = () => {
  return (
    <BrowserRouter>
      <NaviPage />
    </BrowserRouter>
  );
}

export default App;