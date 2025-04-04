import {FC, use} from 'react';
import {SignedInNavigation, SignedOutNavigation} from './src/Navigation';
import {AdminDashboardScreen} from './src/screens/AdminDashboardScreen';

const user = {
  role: 'admin',
  name: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: 'https://example.com/profile.jpg',
};

const App: FC = () =>
  user.role === 'student' ? (
    <SignedInNavigation />
  ) : user.role === 'admin' ? (
    <AdminDashboardScreen />
  ) : (
    <SignedOutNavigation />
  );

export default App;
