import React, { useEffect } from 'react';
import { AppRouter } from './router';

const App: React.FC = () => {
	useEffect(() => {
		document.ondragover = document.ondrop = (ev) => {
			ev.preventDefault();
		};
	}, []);

	return <AppRouter />;
};

export default App;
