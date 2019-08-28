import React, { useState, useCallback, useEffect } from 'react';
import './One.css';

export const One = () => {
  const [state, setState] = useState({
    container: {
      width: 500,
      height: 500
    },
    text: {
      x: 0,
      y: 0
    }
  });

  useEffect(() => {
    let el = document.querySelector('.item');
    el!.addEventListener('dragend', onDrag);

    return () => {
      el!.removeEventListener('dragend', onDrag);
    };
  }, []);

  // const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
  const onDrag = (e: any) => {
    e.preventDefault();
    console.log(e.clientX - state.container.width);
    console.log(e.clientY);
    // console.log(e.pageY);

    setState(s => ({
      ...s,
      text: {
        x: e.clientX - state.container.width,
        y: e.clientY
      }
    }));
  };

  return (
    <>
      <div
        style={{
          width: state.container.width,
          height: state.container.height
        }}
        className="container"
      >
        <div
          style={{
            left: state.text.x,
            top: state.text.y
          }}
          className="item"
          draggable
        >
          Text
        </div>
      </div>
    </>
  );
};
