import { Checkbox, Button } from "antd";
import React, { useState, useEffect } from "react";
import "./style.css";

function ColumnVisible({ columnDefs, setColumnDefs }) {
  const [columnVisible, setColumnVisible] = useState(false);

  const toggleColumn = (field, hide) => {
    try {
      const updated = columnDefs.map(col =>
        col.field === field ? { ...col, hide } : col
      );
      setColumnDefs(updated);
    } catch (error) {
      console.log("toggleColumnError: ", error);
    }
  };

  return (
    <div>
      <button type="button" className="btn btn-outline" onClick={() => setColumnVisible(!columnVisible)}>
        <span className="btn-icon">🔍</span>
        <span className="btn-label">Columns</span>
      </button>
      {columnVisible &&
      <div className="columnVisible">
        <Button className="columnVisible-reset" onClick={() => setColumnDefs(columnDefs.map(col => ({ ...col, hide: false })))}>
          Reset
        </Button>
        {columnDefs.map(col => (
          <Checkbox
            key={col.field}
            checked={!col.hide}
            onChange={(e) => toggleColumn(col.field, !e.target.checked)}
          >
            {col.field}
          </Checkbox>
        ))}
      </div>}
    </div>
  );
}


export default ColumnVisible;