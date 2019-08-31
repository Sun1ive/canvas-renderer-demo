import React, { FC, DragEvent } from 'react';
import { useStyles } from './dropzone.style';

interface IDropZoneProps {
	addImage: (image: string) => void;
}

export interface ReaderTargetEvent extends EventTarget {
	result: string;
}

export type ReaderEvent = ProgressEvent & {
	currentTarget: Partial<ReaderTargetEvent> | null;
};

export const Dropzone: FC<IDropZoneProps> = ({ addImage }) => {
	const styles = useStyles();

	const onDrop = (event: DragEvent<HTMLDivElement>) => {
		const [file] = Array.from(event.dataTransfer.files);

		const reader = new FileReader();
		// reader.onload = (ev: ReaderEvent) => {
		// 	if (ev.currentTarget && ev.currentTarget.result) {
		// 		addImage(ev.currentTarget.result);
		// 	}
		// };

		// reader.readAsDataURL(file);
		// @ts-ignore
		addImage(`file://${file.path}`);
	};

	return <div onDrop={onDrop} className={styles.root} />;
};
