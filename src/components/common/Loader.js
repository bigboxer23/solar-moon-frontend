import React from "react";

const Loader = ({ loading, deviceCount, content }) => {
  return loading ? (
    <div className={"w-100 loading"}></div>
  ) : deviceCount === 0 && content !== "" ? (
    <div className={"d-flex justify-content-start flex-wrap flex-grow-1"}>
      {content}
    </div>
  ) : (
    ""
  );
};
export default Loader;
