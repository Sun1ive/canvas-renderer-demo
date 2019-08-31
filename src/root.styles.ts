import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
	container: {
		display: 'flex',
		justifyContent: 'center',
	},

	wrapper: {
		position: 'relative',
		overflow: 'hidden',
		width: 500,
		height: 500,
		border: '1px solid rgba(0, 0, 0, 0.6)',
	},

	item: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
});
