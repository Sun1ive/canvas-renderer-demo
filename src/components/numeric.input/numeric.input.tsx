import { StandardTextFieldProps } from '@material-ui/core';
import React, { FC } from 'react';
import { BaseInput } from '../base.input/base.input';

interface NumericProps extends StandardTextFieldProps {
	onChangeCb(value: number): void;
}

export const NumericInput: FC<NumericProps> = ({ onChangeCb, ...props }) => {
	return (
		<BaseInput
			onChange={(e) => {
				const { value } = e.target;
				const parsedValue = parseInt(value, 10);
				if (isNaN(parsedValue)) {
					onChangeCb(0);
					return;
				}

				onChangeCb(parsedValue);
			}}
			{...props}
		/>
	);
};
