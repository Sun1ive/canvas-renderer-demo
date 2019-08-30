import React, { FC, useRef, useEffect } from 'react';
import qr from 'qrcode';

interface IMyCanvasProps {
	data: string;
}

export const MyCanvas: FC<IMyCanvasProps> = ({ data }) => {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		qr.toCanvas(
			ref.current,
			data,
			{
				errorCorrectionLevel: 'Q',
			},
			(err) => {
				if (err) {
					console.log('err', err);
				}
			},
		);
	}, [data]);

	return <canvas ref={ref} />;
};
