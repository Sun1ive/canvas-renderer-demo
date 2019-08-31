import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
	root: {
		height: 300,
		width: 300,
		border: '1px solid lightgreen',
		position: 'relative',

		'&:hover': {
			cursor: 'pointer',
		},

		'&:after': {
			content: "'Drop zone'",
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});
