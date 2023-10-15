import React from "react";

const Legend = ({ colorData }) => {
  return (
    <div className={"d-flex flex-wrap "}>
      {colorData
        .sort((d1, d2) => d1.name.localeCompare(d2.name))
        .map((d) => {
          return (
            <div key={d.name} className={"d-flex align-items-center p-2"}>
              <div
                style={{ backgroundColor: d.color }}
                className={"colorDot me-1"}
              />
              {d.name}
            </div>
          );
        })}
    </div>
  );
};
export default Legend;
