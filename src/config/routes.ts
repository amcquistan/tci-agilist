import IRoute from '../interfaces/route';
import AboutPage from '../pages/About';
import HomePage from '../pages/Home';
import VelocityPlanner from '../pages/VelocityPlanner';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Home Page',
    component: HomePage,
    exact: true
  },
  {
    path: '/velocity-planning',
    name: 'Velocity Planning',
    component: VelocityPlanner,
    exact: true
  },
  {
    path: '/about',
    name: 'About Page',
    component: AboutPage,
    exact: true
  },
  {
    path: '/about/:number',
    name: 'About Page',
    component: AboutPage,
    exact: true
  }
];

export default routes;
