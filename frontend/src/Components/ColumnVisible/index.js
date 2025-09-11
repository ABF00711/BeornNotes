import {Checkbox, Button} from "antd";
import React, {useState, useEffect} from "react";
import "./style.css";

function ColumnVisible({ columnDefs, setColumnDefs }) {

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
    </div>
  );
}


export default ColumnVisible;