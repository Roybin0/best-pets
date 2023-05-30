import styles from './App.module.css'
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PetCreateForm from './pages/pets/PetCreateForm';
import PicCreateForm from './pages/pics/PicsCreateForm';
import TaleCreateForm from './pages/tales/TalesCreateForm';
import PetPage from './pages/pets/PetPage';
import PetsPage from './pages/pets/PetsPage';
import PicPage from './pages/pics/PicPage';
import PicsPage from './pages/pics/PicsPage';


function App() {

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path='/' render={() => <h1>Home</h1>} />
          <Route exact path='/signin' render={() => <SignInForm />} />
          <Route exact path='/signup' render={() => <SignUpForm />} />
          <Route exact path='/pets/new' render={() => <PetCreateForm />} />
          <Route exact path='/pets/' render={() => <PetsPage />} />
          <Route exact path='/pets/:id' render={() => <PetPage />} />
          <Route exact path='/pics/new' render={() => <PicCreateForm />} />
          <Route exact path='/pics/' render={() => <PicsPage />} />
          <Route exact path='/pics/:id' render={() => <PicPage />} />
          <Route exact path='/tales/new' render={() => <TaleCreateForm />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;