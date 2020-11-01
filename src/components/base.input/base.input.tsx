import React, { FC } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

export const BaseInput: FC<TextFieldProps> = (props) => {
	return <TextField {...props} />;
};
