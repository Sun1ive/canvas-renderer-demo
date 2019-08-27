import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  createRef
} from 'react';
import {
  Stage,
  Layer,
  Rect,
  Shape,
  Text,
  Image as CanvasImage
} from 'react-konva';
import nanoid from 'nanoid';
import qr from 'qrcode';
import JsBarcode from 'jsbarcode';
import './App.css';

const App: React.FC = () => {
  const [{ x, y }, setState] = useState({
    x: 0,
    y: 0,
    el: ''
  });

  const [renderer, setRenderer] = useState<ReactNode[]>([]);

  const applyWindow = () => {
    setWindow({ width, height });
  };

  const [size, setWindow] = useState({
    width: 300,
    height: 300
  });

  const [{ width, height }, setWindowSize] = useState({
    width: 300,
    height: 300
  });

  const addQr = () => {
    qr.toCanvas('there', (err, element) => {
      console.log(element);
      setState(s => ({ ...s, el: element as any }));
    });
  };

  const addText = () => {
    setRenderer(els => [
      ...els,
      <Text key={nanoid()} fontSize={30} text="hello" draggable />
    ]);
  };

  const addBarcode = () => {
    const canvas = document.createElement('canvas');

    JsBarcode(canvas, '5901234123457', {
      format: 'EAN13'
    });

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => console.log('load');

    setRenderer(els => [
      ...els,
      <CanvasImage
        key={nanoid()}
        onDragEnd={e => {
          setState(s => ({
            ...s,
            barcodeImage: {
              x: e.target.x(),
              y: e.target.y()
            }
          }));
        }}
        draggable
        image={img}
      />
    ]);
  };

  const ref = createRef();

  return (
    <div className="App">
      <input
        type="text"
        placeholder="width"
        value={width}
        onChange={({ target: { value } }) =>
          setWindowSize(s => ({ ...s, width: +value }))
        }
      />

      <input
        type="text"
        placeholder="height"
        onChange={({ target: { value } }) =>
          setWindowSize(s => ({ ...s, height: +value }))
        }
        value={height}
      />

      <button onClick={applyWindow}>Apply to window</button>

      <Stage
        style={{ border: '1px solid black', margin: 'auto' }}
        width={size.width}
        height={size.height}
        ref={ref.current as any}
      >
        <Layer>
          {/* <Shape
            draggable
            x={x}
            y={y}
            onDragStart={console.log}
            sceneFunc={context => {
              qr.toCanvas(context.canvas._canvas, 'Element');
              // qr.toCanvas()
            }}
          /> */}

          {/* <Text
            onDragEnd={e => {
              setState({
                x: e.target.x(),
                y: e.target.y()
              });
            }}
            draggable
            y={y}
            x={x}
            fontSize={30}
            text="hello"
          /> */}

          {renderer}
        </Layer>
      </Stage>
      {/* <canvas id="canva"></canvas> */}
      <button onClick={addBarcode}>add barcode</button>
      <button onClick={addText}>Add text</button>
      <button onClick={addQr}>ADd qr</button>
    </div>
  );
};

export default App;
