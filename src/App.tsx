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
    <div id="main">
      <Stage
        width={800}
        height={600}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderStyle: "solid",
          cursor: addMode ? "pointer" : "default",
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
        <button
          type="button"
          onClick={() => {
            const csv = scenarioToCSV(scenario);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "scenario.csv");
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
