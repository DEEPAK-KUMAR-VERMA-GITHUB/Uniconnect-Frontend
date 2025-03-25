import {FC} from 'react';
import {SignedInNavigation, SignedOutNavigation} from './src/Navigation';

const user = true;

const App: FC = () => (user ? <SignedInNavigation /> : <SignedOutNavigation />);

export default App;
