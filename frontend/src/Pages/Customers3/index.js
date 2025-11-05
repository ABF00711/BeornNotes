import React, { useEffect, useMemo, useState } from 'react';
import CustomTable from '../../Components/CustomTable';
import './style.css';
import useDynamicData from '../../Hooks/useDynamicData';
import useSearchConfig from '../../Hooks/useSearchConfig';

const Customers3 = () => {
    const { dynamicData, tableNames, getDynamicData, getColumns } = useDynamicData();
    const { getSearchConfigData } = useSearchConfig();
    const columns = useMemo(() => {
        return getColumns("customers")
    }, [tableNames]);

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

export default Customers3;

