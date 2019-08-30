import React, {
  useState,
  ReactNode,
  useCallback,
  CSSProperties,
  FC,
  useEffect,
  useRef,
  SyntheticEvent
} from 'react';
import qr from 'qrcode';
import JsBarcode from 'jsbarcode';
import { EAN13Utils } from './utils/Ean13';

export type BaseGeometry = {
  x: number;
  y: number;
};

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

interface IMyDraggableProps {}

interface IMyCanvasProps {
  data: string;
}

const MyCanvas: FC<IMyCanvasProps> = ({ data }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    qr.toCanvas(
      ref.current,
      data,
      {
        errorCorrectionLevel: 'Q'
      },
      err => {
        if (err) {
          console.log('err', err);
        }
      }
    );
  }, [data]);

  return <canvas ref={ref} />;
};

interface IMyBarCodeProps {
  data: string;
}

const MyBarcode: FC<IMyBarCodeProps> = ({ data }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    JsBarcode(ref.current, data, {
      format: 'EAN13'
    });
  }, []);

  return <canvas ref={ref} />;
};

const MyDraggable: FC<IMyDraggableProps> = ({ children }) => {
  const [lastPosition, setLastPosition] = useState<BaseGeometry>({
    x: 0,
    y: 0
  });
  const [position, setPosition] = useState<BaseGeometry>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<BaseGeometry>();
  const [style, setStyle] = useState<CSSProperties>({
    position: 'absolute',
    left: 0,
    top: 0
  });
  const [active, setActive] = useState<Boolean>(false);

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      const { clientX, clientY } = e;

      setDragStart({
        x: clientX,
        y: clientY
      });

      setLastPosition(position);
    },
    [position]
  );

  const onDrag = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      // e.preventDefault();
      const { clientX, clientY } = e;

      if (clientX * clientY === 0) {
        debugger;
      }

      const {
        parentElement,
        clientWidth: elementWidth,
        clientHeight: elementHeight
      } = e.currentTarget;
      const { clientWidth: parentWidth, clientHeight: parentHeight } =
        parentElement || ({} as Partial<HTMLElement>);

      if (dragStart) {
        const { x: startX, y: startY } = dragStart;
        const { x, y } = lastPosition;

        const newPosition = {
          x: Math.min(
            Math.max(x + clientX - startX, 0),
            (parentWidth || 0) - elementWidth
          ),
          y: Math.min(
            Math.max(y + clientY - startY, 0),
            (parentHeight || 0) - elementHeight
          )
        };

        setPosition(newPosition);

        setStyle(s => ({
          ...s,
          left: newPosition.x,
          top: newPosition.y
        }));
      }
    },
    [lastPosition, dragStart]
  );

  const onClick = useCallback(
    (event: React.SyntheticEvent<HTMLElement, MouseEvent>) => {
      // debugger;
      if (active) {
        setActive(false);
      } else {
        setActive(true);
      }
    },
    [active, setActive]
  );

  return (
    <span
      draggable
      id="text-container"
      style={style}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={event => {
        event.preventDefault();
        onDrag(event);
      }}
      onDragLeave={event => {
        event.preventDefault();
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export const Two = () => {
  const [render, setRender] = useState<React.ReactNode[]>([]);
  const [{ text }, setElement] = useState({
    text: ''
  });
  const [qrData, setQrData] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');

  const addTextField = useCallback(() => {
    if (!text) {
      return;
    }

    setRender(renders => {
      return [
        ...renders,
        <MyDraggable key={renders.length}>{text}</MyDraggable>
      ];
    });

    setElement({
      text: ''
    });
  }, [text, setRender]);

  const addQr = useCallback(() => {
    setRender(renders => {
      return [
        ...renders,
        <MyDraggable key={renders.length}>
          <MyCanvas data={qrData} />
        </MyDraggable>
      ];
    });
  }, [setRender, qrData]);

  const addBarcode = useCallback(() => {
    try {
      const generated = EAN13Utils.generate(barcode);

      setRender(renders => [
        ...renders,
        <MyDraggable key={renders.length}>
          <MyBarcode data={generated} />
        </MyDraggable>
      ]);
    } catch (error) {
      console.log('error', error);
    }
  }, [barcode, setRender]);

  const [image, setImage] = useState<string>();

  const addImage = useCallback(() => {
    setRender(renders => [
      ...renders,
      <MyDraggable key={renders.length}>
        <img style={{ display: 'block' }} src={image} alt="qq" />
      </MyDraggable>
    ]);
  }, [image, setRender]);

  return (
    <>
      <div className="container">
        <div className="wrapper">{render}</div>
      </div>
      <div className="text-area">
        <div>Add text field</div>
        <input
          onChange={({ target: { value } }) => {
            setElement(s => ({
              ...s,
              text: value
            }));
          }}
          type="text"
          name="text"
          value={text}
          placeholder="text"
        />

        <button onClick={addTextField}>Add text</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="qr data"
          onChange={e => {
            setQrData(e.target.value);
          }}
          value={qrData}
        />
        <button onClick={addQr}>Add qr</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="barcode data"
          onChange={e => {
            setBarcode(e.target.value);
          }}
          value={barcode}
        />
        <button onClick={addBarcode}>Add barCode</button>
      </div>

      <div>
        <input
          type="file"
          onChange={(e: SyntheticEvent<CustomHTMLInputEvent>) => {
            if (e.currentTarget.files && e.currentTarget.files.length) {
              const [file] = Array.from<MyFile>(e.currentTarget.files);
              const reader = new FileReader();

              reader.onload = <
                E extends ProgressEvent & {
                  currentTarget: Partial<ReaderTargetEvent> | null;
                }
              >(
                event: E
              ) => {
                if (event.currentTarget) {
                  setImage(event.currentTarget.result);
                }
              };

              reader.readAsDataURL(file);
            }
          }}
          max="1"
          name="file"
          placeholder="image"
        />
        <button onClick={addImage}>add image</button>
      </div>
    </>
  );
};
