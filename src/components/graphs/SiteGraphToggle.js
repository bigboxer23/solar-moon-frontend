import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import React from "react";

const SiteGraphToggle = ({ graph, setGraph }) => {
  return (
    <ToggleButtonGroup
      type="radio"
      name="site-graph"
      value={graph}
      onChange={(t) => setGraph(t)}
      className={"align-self-end"}
    >
      <ToggleButton
        variant="secondary"
        name="site-graph"
        id="tbg-btn-Area"
        value={"Area"}
      >
        Area
      </ToggleButton>
      <ToggleButton
        variant="secondary"
        name="site-graph"
        id="tbg-btn-Stacked"
        value={"Stacked"}
      >
        Stacked
      </ToggleButton>
      <ToggleButton
        variant="secondary"
        name="site-graph"
        id="tbg-btn-Stacked-Bar"
        value={"Grouped"}
      >
        Grouped
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default SiteGraphToggle;
