import React, { useEffect, useState } from 'react';
import CustomTable from '../../Components/CustomTable';
import './style.css';
import useDynamicData from '../../Hooks/useDynamicData';
import useSmartGrid from '../../Hooks/useSmartGrid';

const CustomTableDemo = () => {
    const {dynamicData, getDynamicData} = useDynamicData();
    const [columns, setColumns] = useState([]);

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
                />
            </div>
        </div>
    );
};

export default CustomTableDemo;

