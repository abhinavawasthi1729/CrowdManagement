
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from './pages/MainPage';
import TimeSeriesChart from "./components/TimeSeriesChart";
import MapComponent from "./components/MapComponent";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage/>} path='/'/>
        <Route element={<TimeSeriesChart/>} path='/analysis'/>
        <Route element={<MapComponent/>} path='/map'/>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
