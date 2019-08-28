import React, { useState, ReactNode, useCallback, CSSProperties } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable'; // The default

export type BaseGeometry = {
  x: number;
  y: number;
};

export interface IRendererState {
  render: ReactNode[];
}

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
    [lastPosition, dragStart]
  );

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
  const [render, setRender] = useState<React.ReactNode[]>([]);

  const addTextField = useCallback(() => {
    setRender(renders => {
      return [...renders, <MyDraggable key={renders.length} />];
    });
  }, []);

  return (
    <>
      <div className="container">{render}</div>
      <button onClick={addTextField}>Add text</button>
    </>
  );
};
