// Item.js
import React from "react";
import { Reorder } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "./UseRaisedShadow";

export const Item = ({ busPoint }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={busPoint} // Pass the full object for reordering
      id={busPoint.key} // Use the unique key
      style={{ boxShadow, y }}
    >
      <div style={{backgroundColor:"#f0f0f0", marginTop:"10px", padding:"5px", borderRadius:"8px", cursor:"pointer"}}>
        <span style={{color:"black"}}>
          {busPoint.direction} - {busPoint.routePoint} (
          {busPoint.active ? "Active" : "Inactive"})
        </span>
      </div>
    </Reorder.Item>
  );
};