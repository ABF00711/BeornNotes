import services from "../Services";
import { toast } from "react-toastify";
import { useCallback, useContext } from "react";
import { MyContext } from "../Context";

function useSearchpatterns() {
    const { searchpatterns, setSearchpatterns, token, layouts } = useContext(MyContext);

    const getSearchpatterns = async (tablename) => {
        try {
            const res = await services.getSearchpatterns(tablename, token);
            if (res.message == "getSearchpatterns success") {
                setSearchpatterns(res.searchpatterns);
            }
        } catch (error) {
            console.log("getSearchpatternsError: ", error);
        }
    }

    const updateSearchpatterns = async (searchData, searchName, tablename) => {
        try {
            const res = await services.updateSearchpatterns(searchData, searchName, tablename, token);
            if (res.message == "updateSearchpatterns success") {
                toast.success("Update searchpatterns success");
                getSearchpatterns(tablename);
            }
        } catch (error) {
            console.log("updateSearchpatternsError: ", error);
        }
    }

    const createSearchpatterns = async (searchData, searchName, tablename) => {
        try {
            const res = await services.createSearchpatterns(searchData, searchName, tablename, token);
            if (res.message == "createSearchpatterns success") {
                toast.success("Create searchpatterns success");
                getSearchpatterns(tablename);
            }
        } catch (error) {
            console.log("createSearchpatternsError: ", error);
        }
    }

    const deleteSearchpatterns = async (tablename, patternId) => {
        try {
            const res = await services.deleteSearchpatterns(patternId, token);
            if (res.message == "deleteSearchpatterns success") {
                toast.success("Delete searchpatterns success");
                getSearchpatterns(tablename);
            }
        } catch (error) {
            console.log("deleteSearchpatternsError: ", error);
        }
    }

    const restoreSearchpatterns = (gridRef) => {
        if (!gridRef.current?.api) return;
        try {
            let savedSearchpattern = JSON.parse(localStorage.getItem("searchpatterns") || null);
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
            let savedLayout = JSON.parse(localStorage.getItem("layout") || null);
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
            const searchpatterns = JSON.parse(localStorage.getItem("searchpatterns") || "{}");
            searchpatterns.sorts = sortState;
            localStorage.setItem("searchpatterns", JSON.stringify(searchpatterns));
        }
    }, []);

    const saveFilterInfo = (params) => {
        try {
            const filterInfo = params.api.getFilterModel();
            const searchpatterns = JSON.parse(localStorage.getItem("searchpatterns") || "{}");
            searchpatterns.filters = filterInfo;
            localStorage.setItem("searchpatterns", JSON.stringify(searchpatterns));
        } catch (error) {
            console.log("saveFilterInfoError: ", error);
        }
    }

    return ({
        getSearchpatterns,
        searchpatterns,
        updateSearchpatterns,
        createSearchpatterns,
        deleteSearchpatterns,
        restoreSearchpatterns,
        onSortChanged,
        saveFilterInfo
    })
}

export default useSearchpatterns;