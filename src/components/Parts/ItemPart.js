// Item.js
import React from "react";
import { Reorder } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "./UseRaisedShadow";

export const Item = ({ busPoint, index }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={busPoint} // Pass the full object for reordering
      id={busPoint.key} // Use the unique key
      style={{ boxShadow, y, marginTop: "10px", display: "flex", alignItems: "center" }}
    >
      <div style={{ backgroundColor: "#f0f0f0", padding: "5px", borderRadius: "80px", cursor: "pointer", width: "30px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>{index}</div>
      <div style={{ backgroundColor: "#f0f0f0", padding: "5px", borderRadius: "8px", cursor: "pointer", width:"100%" }}>
        <span style={{ color: "black" }}>
          {busPoint.direction} - {busPoint.routePoint} (
          {busPoint.active ? "Active" : "Inactive"})
        </span>
      </div>
    </Reorder.Item>
  );
};