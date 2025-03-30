import {FC} from 'react';
import {SignedInNavigation, SignedOutNavigation} from './src/Navigation';

const user = false;

const App: FC = () => (user ? <SignedInNavigation /> : <SignedOutNavigation />);

export default App;
