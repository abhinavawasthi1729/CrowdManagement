
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from './pages/MainPage';
import TimeSeriesChart from "./components/TimeSeriesChart";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage/>} path='/'/>
        <Route element={<TimeSeriesChart/>} path='/analysis'/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
