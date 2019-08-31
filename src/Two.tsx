import React, { useState, ReactNode, useCallback } from 'react';
import { MyDraggable } from './components/draggable/draggable';
import { EAN13Utils } from './utils/Ean13';
import { MyCanvas } from './components/canvas/canvas';
import { Barcode } from './components/barcode/barcode';
import { Button } from './components/button/button';
import { Dropzone } from './components/dropzone/dropzone';
import { useStyles } from './root.styles';
export interface IRendererState {
	render: ReactNode[];
}

export interface CustomHTMLInputEvent extends HTMLInputElement {
	files: FileList | null;
}

export interface MyFile extends File {
	path?: string;
}

export interface ReaderTargetEvent extends EventTarget {
	result: string;
}

export const Two = () => {
	const styles = useStyles();

	const [render, setRender] = useState<React.ReactNode[]>([]);
	const [{ text }, setElement] = useState({
		text: '',
	});
	const [qrData, setQrData] = useState<string>('');
	const [barcode, setBarcode] = useState<string>('');

	const addTextField = useCallback(() => {
		if (!text) {
			return;
		}

		setRender((renders) => {
			return [...renders, <MyDraggable key={renders.length}>{text}</MyDraggable>];
		});

		setElement({
			text: '',
		});
	}, [text, setRender]);

	const addQr = useCallback(() => {
		setRender((renders) => {
			return [
				...renders,
				<MyDraggable key={renders.length}>
					<MyCanvas data={qrData} />
				</MyDraggable>,
			];
		});
	}, [setRender, qrData]);

	const addBarcode = useCallback(() => {
		try {
			const generated = EAN13Utils.generate(barcode);

			setRender((renders) => [
				...renders,
				<MyDraggable key={renders.length}>
					<Barcode data={generated} />
				</MyDraggable>,
			]);
		} catch (error) {
			console.log('error', error);
		}
	}, [barcode, setRender]);

	const addImage = useCallback(
		(image) => {
			setRender((renders) => [
				...renders,
				<MyDraggable key={renders.length}>
					<img style={{ display: 'block' }} src={image} alt="qq" />
				</MyDraggable>,
			]);
		},
		[setRender],
	);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.wrapper}>{render}</div>
			</div>
			<div>
				<div>Add text field</div>
				<input
					onChange={({ target: { value } }) => {
						setElement((s) => ({
							...s,
							text: value,
						}));
					}}
					type="text"
					name="text"
					value={text}
					placeholder="text"
				/>

				<Button onClick={addTextField}>Add text</Button>
			</div>

			<div>
				<input
					type="text"
					placeholder="qr data"
					onChange={(e) => {
						setQrData(e.target.value);
					}}
					value={qrData}
				/>
				<Button onClick={addQr}>Add qr</Button>
			</div>

			<div>
				<input
					type="text"
					placeholder="barcode data"
					onChange={(e) => {
						setBarcode(e.target.value);
					}}
					value={barcode}
				/>
				<Button onClick={addBarcode}>Add barCode</Button>
			</div>

			<div>
				<Dropzone addImage={addImage} />
			</div>
		</>
	);
};
