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
import TalesPage from './pages/tales/TalesPage';
import TalePage from './pages/tales/TalePage';
import PetEditForm from './pages/pets/PetEditForm';
import PicEditForm from './pages/pics/PicEditForm';
import TaleEditForm from './pages/tales/TaleEditForm';
import OwnerProfilePage from './pages/owners/OwnerProfilePage';
import OwnerProfileEditForm from './pages/owners/OwnerProfileEditForm';
import OwnerPasswordForm from './pages/owners/OwnerPasswordForm';
import OwnerUsernameForm from './pages/owners/OwnerUsernameForm';
import NotFound from './components/NotFound';
import HomePage from './pages/main/HomePage';
import LikedPage from './pages/main/LikedPage';


function App() {

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path='/' render={() => <HomePage />} />
          <Route exact path='/liked' render={() => <LikedPage />} />
          <Route exact path='/signin' render={() => <SignInForm />} />
          <Route exact path='/signup' render={() => <SignUpForm />} />
          <Route exact path='/pets/new' render={() => <PetCreateForm />} />
          <Route exact path='/pets/' render={() => <PetsPage />} />
          <Route exact path='/pets/:id' render={() => <PetPage />} />
          <Route exact path='/pets/:id/edit' render={() => <PetEditForm />} />
          <Route exact path='/pics/new' render={() => <PicCreateForm />} />
          <Route exact path='/pics/' render={() => <PicsPage />} />
          <Route exact path='/pics/:id' render={() => <PicPage />} />
          <Route exact path='/pics/:id/edit' render={() => <PicEditForm />} />
          <Route exact path='/tales/new' render={() => <TaleCreateForm />} />
          <Route exact path='/tales/' render={() => <TalesPage />} />
          <Route exact path='/tales/:id' render={() => <TalePage />} />
          <Route exact path='/tales/:id/edit' render={() => <TaleEditForm />} />
          <Route exact path='/owners/:id' render={() => <OwnerProfilePage />} />
          <Route exact path='/owners/:id/edit' render={() => <OwnerProfileEditForm />} />
          <Route exact path="/owners/:id/edit/password" render={() => <OwnerPasswordForm />} />
          <Route exact path="/owners/:id/edit/username" render={() => <OwnerUsernameForm />} />
          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;