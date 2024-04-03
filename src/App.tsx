import React, { useState, useCallback } from "react";
import { Circle, Layer, Stage } from "react-konva";
import "./App.css";
import Modal from "react-modal";
import {
  INITIAL_SCENARIO,
  Scenario,
  addMobile,
  moveMobile,
  removeMobile,
  scenarioToCSV,
} from "./models/scenario.model";
import { Shape } from "konva/lib/Shape";

Modal.setAppElement("#root");

export const NakedApp = () => {
  const [name, setName] = useState("scenario");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [scale, setScale] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [now, setNow] = useState(0);
  const [scenario, setScenario] = useState<Scenario>(INITIAL_SCENARIO);
  const [nextX, setNextX] = useState(0);
  const [nextY, setNextY] = useState(0);
  const [duration, setDuration] = useState(10);
  const [current, setCurrent] = useState<Shape | undefined>(undefined);
  const [movedIndex, setMovedIndex] = useState(0);
  const [selectedInex, setSelectedIndex] = useState(-1);
  const cancelModal = useCallback(() => {
    const mobile = scenario[now][movedIndex];
    if (current != undefined) {
      current.absolutePosition({ x: mobile.x, y: mobile.y });
    }
    setIsModalOpen(false);
  }, [current, movedIndex, scenario, now]);
  const confirmModal = useCallback(() => {
    setNow(now + duration);
    setScenario(
      moveMobile(nextX, nextY, movedIndex, now, now + duration, scenario)
    );
    setIsModalOpen(false);
  }, [nextX, nextY, now, duration, scenario, movedIndex]);
  return (
    <div
      id="main"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Stage
        width={width}
        height={height}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderStyle: "solid",
          cursor: addMode ? "pointer" : "default",
          width,
          height,
          alignSelf: "center",
        }}
        onClick={(event) => {
          if (!addMode) {
            return;
          }
          setScenario(
            addMobile(event.evt.offsetX, event.evt.offsetY, scenario)
          );
          setAddMode(false);
        }}
      >
        <Layer>
          {scenario[now].map((mobile, index) => (
            <Circle
              key={`circle-${index}`}
              fill="blue"
              stroke={index === selectedInex ? "black" : undefined}
              opacity={1}
              x={mobile.x}
              y={mobile.y}
              radius={10}
              draggable={true}
              onClick={() => {
                setSelectedIndex(index);
              }}
              onDragEnd={(event) => {
                if (event.target instanceof Shape) {
                  setCurrent(event.target);
                }
                setNextX(event.evt.offsetX);
                setNextY(event.evt.offsetY);
                setIsModalOpen(true);
                setMovedIndex(index);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div>
        <button
          type="button"
          onClick={() => {
            if (now > 0) {
              setNow(now - 1);
            }
          }}
        >
          Back
        </button>
        <span>
          {now}/{scenario.length - 1}
        </span>
        <button
          type="button"
          onClick={() => {
            if (now < scenario.length - 1) {
              setNow(now + 1);
            }
          }}
        >
          Forward
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setAddMode(!addMode);
          }}
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => {
            setScenario(removeMobile(selectedInex, scenario));
          }}
        >
          削除
        </button>
      </div>
      <div>
        <label htmlFor="name">シナリオ名:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label htmlFor="width">幅:</label>
        <input
          type="number"
          id="width"
          min={10}
          value={width}
          onChange={(event) => {
            setWidth(parseInt(event.target.value, 10));
          }}
        />
        <label htmlFor="height">高さ:</label>
        <input
          type="number"
          id="height"
          min={10}
          value={height}
          onChange={(event) => {
            setHeight(parseInt(event.target.value, 10));
          }}
        />
        <label htmlFor="scale">スケール:</label>
        <input
          type="number"
          id="scale"
          min={1}
          value={scale}
          onChange={(event) => {
            setScale(parseInt(event.target.value, 10));
          }}
        />
        <button
          type="button"
          onClick={() => {
            const csv = scenarioToCSV(scenario, scale);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            const filename =
              scenario.length > 0 ? `${name}.csv` : "scenario.csv";
            link.setAttribute("download", filename);
            link.click();
          }}
        >
          CSV出力
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelModal}
        style={customStyles}
        contentLabel="Move Mobile Modal"
      >
        <h2>移動</h2>
        <button onClick={cancelModal}>close</button>
        <div>移動体を何秒で移動させますか？</div>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(event) => {
            setDuration(parseInt(event.target.value));
          }}
        />
        <button type="button" onClick={confirmModal}>
          OK
        </button>
      </Modal>
    </div>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const App = React.memo(NakedApp);
