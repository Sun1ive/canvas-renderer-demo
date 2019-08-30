import React, { useState, FC, useCallback, CSSProperties } from 'react';
import { useStyles } from '../barcode/barcode.style';

export type BaseGeometry = {
	x: number;
	y: number;
};

export const MyDraggable: FC = ({ children }) => {
	const styles = useStyles();

	const [lastPosition, setLastPosition] = useState<BaseGeometry>({
		x: 0,
		y: 0,
	});
	const [position, setPosition] = useState<BaseGeometry>({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState<BaseGeometry>();
	const [style, setStyle] = useState<CSSProperties>({
		position: 'absolute',
		left: 0,
		top: 0,
	});

	const onDragStart = useCallback(
		(e: React.DragEvent<HTMLElement>) => {
			const { clientX, clientY } = e;

			setDragStart({
				x: clientX,
				y: clientY,
			});

			setLastPosition(position);
		},
		[position],
	);

	const onDrag = useCallback(
		(e: React.DragEvent<HTMLElement>) => {
			e.preventDefault();
			const { clientX, clientY } = e;

			const { parentElement, clientWidth: elementWidth, clientHeight: elementHeight } = e.currentTarget;
			const { clientWidth: parentWidth, clientHeight: parentHeight } = parentElement || ({} as Partial<HTMLElement>);

			if (dragStart) {
				const { x: startX, y: startY } = dragStart;
				const { x, y } = lastPosition;

				const newPosition = {
					x: Math.min(Math.max(x + clientX - startX, 0), (parentWidth || 0) - elementWidth),
					y: Math.min(Math.max(y + clientY - startY, 0), (parentHeight || 0) - elementHeight),
				};

				setPosition(newPosition);

				setStyle((s) => ({
					...s,
					left: newPosition.x,
					top: newPosition.y,
				}));
			}
		},
		[lastPosition, dragStart],
	);

	return (
		<span
			draggable
			style={style}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragEnd={(event) => {
				event.preventDefault();
				// onDrag(event);
			}}
			onDragLeave={(event) => {
				event.preventDefault();
			}}
			onDragOver={(event) => {
				event.preventDefault();
			}}
		>
			{children}
		</span>
	);
};
