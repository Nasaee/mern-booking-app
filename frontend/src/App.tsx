import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layouts from './layouts/Layouts';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <Layouts>
              <p>Home page</p>
            </Layouts>
          }
        />
        <Route
          path='/search'
          element={
            <Layouts>
              <p>Search page</p>
            </Layouts>
          }
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
