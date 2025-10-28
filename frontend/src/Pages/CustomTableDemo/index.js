import React, { useEffect, useMemo, useState } from 'react';
import CustomTable from '../../Components/CustomTable';
import './style.css';
import useDynamicData from '../../Hooks/useDynamicData';
import useSmartGrid from '../../Hooks/useSmartGrid';
import useSearchConfig from '../../Hooks/useSearchConfig';

const CustomTableDemo = () => {
    const {dynamicData, getDynamicData} = useDynamicData();
    const {searchConfig, getSearchConfigData} = useSearchConfig();
    const columns = useMemo(() => {
        const _columns = [];
        if(searchConfig){
            searchConfig.map((config) => {
                if(config.table_name === "customers"){
                    const column = {};
                    column.field = config.field_name;
                    column.header = config.field_label;
                    column.type = config.field_type;
                    if(column.type === "combobox") column.type = "text"
                    _columns.push(column);
                }
            });
        }
        return _columns;
    }, [searchConfig]);

    const handleRowClick = (row, index) => {
        console.log('Row clicked:', row, 'Index:', index);
    };

    const handleSelectionChange = (selectedIds) => {
        console.log('Selected rows:', selectedIds);
    };

    const handleEdit = (row) => {
        console.log('Edit row:', row);
        alert(`Editing: ${row.name}`);
    };

    const handleDelete = (row) => {
        console.log('Delete row:', row);
        if (window.confirm(`Delete ${row.name}?`)) {
            console.log('Row deleted!');
        }
    };

    useEffect(() => {
        getDynamicData("Customers");
        getSearchConfigData();
    }, [])

    return (
        <div className="custom-table-demo-page">
            <div className="demo-content">
                <CustomTable
                    onRowClick={handleRowClick}
                    onSelectionChange={handleSelectionChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={false}
                    data={dynamicData}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default CustomTableDemo;

