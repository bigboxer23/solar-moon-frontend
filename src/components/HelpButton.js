import { MdOutlineHelpOutline } from "react-icons/md";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React from "react";

export default function HelpButton({ text }) {
  return (
    <OverlayTrigger
      theme
      placement="auto"
      delay={{ show: 200, hide: 750 }}
      overlay={
        <Popover data-bs-theme="dark">
          <Popover.Body>{text}</Popover.Body>
        </Popover>
      }
      trigger={["hover", "focus", "click"]}
    >
      <div>
        <MdOutlineHelpOutline className={"help-button text-muted"} />
      </div>
    </OverlayTrigger>
  );
}
