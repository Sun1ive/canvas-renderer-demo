import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { One } from './One';
import { Two } from './Two';

export const AppRouter = () => {
	return (
		<div>
			<HashRouter>
				<Link style={{ margin: '0 1rem' }} to="/one">
					One
				</Link>
				<Link to="/two">Two</Link>
				<Route path="/one" exact component={One} />
				<Route path="/two" exact component={Two} />
			</HashRouter>
		</div>
	);
};
