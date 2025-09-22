import { Checkbox, Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

function ColumnVisible({ gridRef, columnDefs, setColumnDefs, onColumnChanged }) {
  const [columnVisible, setColumnVisible] = useState(false);
  const [currentColumn, setCurrentColumn] = useState([]);
  const containerRef = useRef(null);

  const toggleColumn = (colId, hide) => {
    try {
      const updated = currentColumn.map(col =>
        col.colId === colId ? {...col, hide} : col
      );
      gridRef.current.api.applyColumnState({
                state: updated,
                applyOrder: true
            });
      setCurrentColumn(updated);
      onColumnChanged();
    } catch (error) {
      console.log("toggleColumnError: ", error);
    }
  };

  const onReset = () => {
    const columnState = columnDefs.map(col => ({ ...col, hide: false }));
    setCurrentColumn(columnState);
    setColumnDefs(columnState);
    onColumnChanged()
  }

  const onClickBtn = () => {
    if (!columnVisible) {
      let _columnState = gridRef.current.api.getColumnState();
      _columnState = _columnState.filter((column) => {
        const existingColumn = columnDefs.find(col => col.field == column.colId);
        if(existingColumn){
          column.headerName = existingColumn.headerName;
          return column;
        }
      })
      setCurrentColumn(_columnState);
    }
    setColumnVisible(!columnVisible);
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!columnVisible) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setColumnVisible(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [columnVisible]);

  return (
    <div className="columnVisible-wrapper" ref={containerRef}>
      <button type="button" className="btn btn-outline" onClick={onClickBtn}>
        <span className="btn-icon">📑</span>
        <span className="btn-label">Columns</span>
      </button>
      {columnVisible &&
        <div className="columnVisible">
          <Button className="columnVisible-reset" onClick={onReset}>
            Reset
          </Button>
          <div className="columnVisible-list">
            {currentColumn.map(col => (
              <Checkbox
                key={col.field}
                checked={!col.hide}
                onChange={(e) => toggleColumn(col.colId, !e.target.checked)}
              >
                {col.headerName}
              </Checkbox>
            ))}
          </div>
        </div>}
    </div>
  );
}


export default ColumnVisible;