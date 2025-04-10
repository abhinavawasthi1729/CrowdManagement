
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from './pages/MainPage';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage/>} path='/'/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
