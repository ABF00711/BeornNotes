import { useCallback, useState } from "react";
import useSearchpatterns from "./useFilters";
import useLayouts from "./useLayouts";
import useSearchConfig from "./useSearchConfig";

const useCustomers3 = () => {
    const { searchpatterns } = useSearchpatterns();
    const { layouts } = useLayouts();
    const [labels, setLabels] = useState({});
    const [mandatoryFields, setMandatoryFields] = useState({});
    const {searchConfig} = useSearchConfig();

    const onColumnChanged = (gridRef) => {
        setTimeout(() => {
            const currentGrid = gridRef.current?.api.getColumnState();
            localStorage.setItem("customers3Layout", JSON.stringify(currentGrid));
        }, 300);
    }

    const onFilterChanged = useCallback((params) => {
        const filterInfo = params.api.getFilterModel();
        const searchpatterns = JSON.parse(localStorage.getItem("customers3Searchpatterns") || "{}");
        searchpatterns.filters = filterInfo;
        localStorage.setItem("customers3Searchpatterns", JSON.stringify(searchpatterns));
    }, []);

    const restoreSearchpatterns = (gridRef) => {
        if (!gridRef.current?.api) return;
        try {
            let savedSearchpattern = JSON.parse(localStorage.getItem("customers3Searchpatterns") || null);
            if (savedSearchpattern == null) {
                const defaultPattern = searchpatterns.find((pattern) => pattern.name == "Default");
                if (defaultPattern && defaultPattern.data) {
                    const parsedPattern = JSON.parse(defaultPattern.data);
                    savedSearchpattern = {
                        filters: parsedPattern.filters || [],
                        sorts: parsedPattern.sorts || []
                    }
                } else {
                    savedSearchpattern = {
                        filters: [],
                        sorts: []
                    }
                }
            }
            let savedLayout = JSON.parse(localStorage.getItem("customers3Layout") || null);
            if (savedLayout == null) {
                const defaultLayout = layouts.find((layout) => layout.layout_name === "Default");
                if (defaultLayout) {
                    savedLayout = JSON.parse(defaultLayout.layout_json);
                } else {
                    savedLayout = gridRef.current.api.getColumnState();
                }
            }
            if (savedSearchpattern.sorts) {
                savedLayout.map((column) => {
                    const savedSort = savedSearchpattern.sorts.find((item) => item.colId === column.colId);
                    if (savedSort) {
                        column.sort = savedSort.sort;
                    }
                    return column
                })
            }
            gridRef.current.api.applyColumnState({
                state: savedLayout,
                applyOrder: true,
            });
            gridRef.current.api.setFilterModel(savedSearchpattern.filters);
        } catch (error) {
            console.log("restoreSearchpatterns error:", error);
        }
    };

    const onSortChanged = useCallback((gridRef) => {
        if (gridRef.current) {
            const currentColumnState = gridRef.current.api.getColumnState();
            const sortState = [];
            currentColumnState.map((column) => {
                sortState.push({ colId: column.colId, sort: column.sort });
            })
            const searchpatterns = JSON.parse(localStorage.getItem("customers3Searchpatterns") || "{}");
            searchpatterns.sorts = sortState;
            localStorage.setItem("customers3Searchpatterns", JSON.stringify(searchpatterns));
        }
    }, []);

    // Format date for HTML date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getLabels = () => {
        try {
            if(!searchConfig) return;
            const _labels = {};
            searchConfig.map((data) => {
                if(data.table_name == "customers"){
                    _labels[data.field_name] = data.field_label;
                }
            })
            setLabels(_labels);
        } catch (error) {
            console.log("getLabelsError: ", error);
        }
    }

    const getMandatoryFields = () => {
        try {
            if(!searchConfig) return;
            const _mandatoryFields = {};
            searchConfig.map((data) => {
                if(data.table_name == "customers"){
                    _mandatoryFields[data.field_name] = data.mandatory;
                }
            })
            setMandatoryFields(_mandatoryFields);
        } catch (error) {
            console.log("getMandatoryFieldsError: ", error);
        }
    }

    return {
        onColumnChanged, onFilterChanged, 
        restoreSearchpatterns, onSortChanged, 
        formatDateForInput, 
        labels, getLabels,
        mandatoryFields, getMandatoryFields
    }
}

export default useCustomers3;