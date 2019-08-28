import React, {
  useState,
  ReactNode,
  useCallback,
  createRef,
  useEffect,
  CSSProperties
} from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable'; // The default

export type BaseGeometry = {
  x: number;
  y: number;
};

export interface IRendererState {
  // items: Array<BaseGeometry>;
  // item: BaseGeometry;
  render: ReactNode[];
}

let id: string;

const MyDraggable: React.FC<{}> = () => {
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
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      // debugger;
      const { clientX, clientY } = e;
      setDragStart({
        x: clientX,
        y: clientY
      });
      setLastPosition(position);
      console.log(clientX, clientY);
    },
    [position]
  );

  const onDrag = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      // debugger;
      const { clientX, clientY } = e;
      console.log(clientX, clientY);
      if (dragStart) {
        const { x: startX, y: startY } = dragStart;
        const { x, y } = lastPosition;
        const newPosition = {
          x: x + clientX - startX,
          y: y + clientY - startY
        };
        setPosition(newPosition);
        setStyle(s => ({
          ...s,
          left: newPosition.x,
          top: newPosition.y
        }));
      }
    },
    [position, lastPosition, dragStart]
  );
  // const onDrag
  return (
    <div
      draggable
      id="test"
      style={style}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDrag}
    >
      <div className="handle">Drag from here</div>
      <div>This readme is really dragging on...</div>
    </div>
    // <Draggable axis="none" position={position} onDrag={onDrag}>

    // </Draggable>
  );
};

export const Two = () => {
  // const [state, setLocalState] = useState<IRendererState>({
  //   render: []
  // });

  // const { render } = state;

  const [render, setRender] = useState<React.ReactNode[]>([]);

  // const setState = useCallback(
  //   (newState: Readonly<Partial<typeof state>>) => {
  //     setLocalState(prevState => ({
  //       ...prevState,
  //       ...newState
  //     }));
  //   },
  //   [setLocalState]
  // );

  // const handleDrag = (e: DraggableEvent, data: DraggableData) => {
  //   console.log({ e, data });
  //   setState({
  //     item: {
  //       x: data.lastX,
  //       y: data.lastY
  //     }
  //   });
  // };

  // const setDynamicState = useCallback(
  //   (name: string, data: DraggableData) => {
  //     console.log({ name, data });
  //     setLocalState(s => ({
  //       ...s,
  //       items: {
  //         ...s.items,
  //         [name]: {
  //           x: data.lastX,
  //           y: data.lastY
  //         }
  //       }
  //     }));
  //   },
  //   [setLocalState]
  // );

  // useEffect(() => {
  //   if (id && Object.keys(items).length > render.length) {
  //     const renders = [...render];
  //     console.log(id);

  //     const textField = (
  //       <Draggable
  //         axis="none"
  //         key={id}
  //         // position={{
  //         //   x: state.items[id].x,
  //         //   y: state.items[id].y
  //         // }}
  //         // onDrag={(e, data) => setDynamicState(id, data)}
  //         position={item}
  //         onDrag={(e, data) => {
  //           console.log({ e, data, state: item });
  //           setLocalState(s => ({
  //             ...s,
  //             item: {
  //               x: data.lastX,
  //               y: data.lastY
  //             }
  //           }));
  //         }}
  //       >
  //         <div id="test">
  //           <div className="handle">Drag from here</div>
  //           <div>This readme is really dragging on...</div>
  //         </div>
  //       </Draggable>
  //     );

  //     renders.push(textField);

  //     setLocalState(s => ({
  //       ...s,
  //       render: renders
  //     }));
  //   }
  // }, [items, item, render]);

  const addTextField = useCallback(() => {
    // id = (Math.random() * 100).toFixed(0).toString();
    setRender(renders => {
      return [...renders, <MyDraggable key={renders.length} />];
    });

    // setLocalState(p => ({
    //   ...p,
    //   items: [
    //     ...p.items,
    //     {
    //       x: 0,
    //       y: 0
    //     }
    //   ]
    // }));
  }, []);

  return (
    <>
      <div className="container">
        {/* <Draggable
          axis="none"
          position={{
            x: state.item.x,
            y: state.item.y
          }}
          onDrag={handleDrag}
          onStop={(e, data) => {
            console.log({ e, data });
            console.log(data.node.getAttribute('id'));
          }}
        >
          <div id="test">
            <div className="handle">Drag from here</div>
            <div>This readme is really dragging on...</div>
          </div>
        </Draggable> */}
        {render}
      </div>
      <button onClick={addTextField}>Add text</button>
    </>
  );
};
