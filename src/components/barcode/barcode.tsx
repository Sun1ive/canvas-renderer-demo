import React, { FC, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

interface IMyBarCodeProps {
	data: string;
}

export const Barcode: FC<IMyBarCodeProps> = ({ data }) => {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		JsBarcode(ref.current, data, {
			format: 'EAN13',
		});
	}, []);

	return <canvas ref={ref} />;
};
