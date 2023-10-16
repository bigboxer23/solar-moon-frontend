import StackedTimeSeries from "./StackedTimeSeries";
import React from "react";
import TimeSeries from "./TimeSeries";
import SiteGraphToggle from "./SiteGraphToggle";
import { useStickyState } from "../../utils/Utils";

const SiteGraph = ({ site, time }) => {
  const [graph, setGraph] = useStickyState("Area", "site.graph");

  return (
    <div className={"d-flex flex-column"}>
      <SiteGraphToggle graph={graph} setGraph={setGraph} />

      {graph === "Area" ? (
        <TimeSeries device={site} time={time} />
      ) : graph === "Stacked" ? (
        <StackedTimeSeries device={site} time={time} />
      ) : (
        <div>Coming soon</div>
      )}
    </div>
  );
};
export default SiteGraph;
