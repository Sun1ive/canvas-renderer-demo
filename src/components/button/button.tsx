import React, { FC } from 'react';
import { useStyles } from './button.style';

export interface IButtonProps {
	onClick: () => void;
}

export const Button: FC<IButtonProps> = ({ children, onClick }) => {
	const styles = useStyles();

	return (
		<button onClick={onClick} className={styles.root}>
			{children}
		</button>
	);
};
