import './App.css';
import Home from './components/Home';
import Department from './components/Department';
import Employee from './components/Employee';
import CarPart from './components/CarPart';
// import PhotoUpload from './components/PhotoBinary/PhotoUpload';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <h3 className='d-flex justify-content-center m-3'>
          React | ASP.NET | SQL ~ Playground
        </h3>
        <nav className='navbar navbar-expand-sm bg-light navbar-dark'>
          <ul className='navbar-nav'>
            <li className='nav-item- m-1'>
              <NavLink className='btn btn-light btn-outline-primary' to='/home'>
                Home
              </NavLink>
            </li>
            <li className='nav-item- m-1'>
              <NavLink className='btn btn-light btn-outline-primary' to='/department'>
                Department
              </NavLink>
            </li>
            <li className='nav-item- m-1'>
              <NavLink className='btn btn-light btn-outline-primary' to='/employee'>
                Employee
              </NavLink>
            </li>
            <li className='nav-item- m-1'>
              <NavLink className='btn btn-light btn-outline-primary' to='/carpart'>
              Car Part
              </NavLink>
            </li>
            {/* <li className='nav-item- m-1'>
              <NavLink className='btn btn-light btn-outline-primary' to='/photoupload'>
              PhotoUpload
              </NavLink>
            </li> */}
          </ul>
        </nav>

        <Routes>
          <Route exact path='/home' element={ <Home /> }/>
          <Route exact path='/department' element={ <Department/> }/>
          <Route exact path='/employee' element={ <Employee/> }/>
          <Route exact path='/carpart' element={ <CarPart/> }/>
          {/* <Route exact path='/photoupload' element={ <PhotoUpload/> }/> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;