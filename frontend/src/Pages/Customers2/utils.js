export const getJobComboRef = (jobComboBoxRef, jobs, searchKey) => {
    try {
        if (jobComboBoxRef.current && searchKey.job && jobs.length > 0) {
            try {
                if (jobComboBoxRef.current.setValue) {
                    jobComboBoxRef.current.setValue(searchKey.job);
                } else if (jobComboBoxRef.current.value !== undefined) {
                    jobComboBoxRef.current.value = searchKey.job;
                }
            } catch (error) {
                console.log("Error setting ComboBox initial value:", error);
            }
        }
    } catch (error) {
        console.log("getJobComboRefError: ", error);
    }
}

export const onSearch = (searchKey, setFilteredData, dynamicData) => {
    try {
        localStorage.setItem("customers2SearchKey", JSON.stringify(searchKey));
        const trimmedJob = searchKey.job?.trim();
        if (!searchKey.age && !trimmedJob) {
            setFilteredData(dynamicData);
            return;
        }

        setFilteredData(dynamicData.filter((oneData) => {
            if (!searchKey.age) {
                return oneData.job == trimmedJob;
            }
            if (!trimmedJob) {
                return oneData.age == searchKey.age;
            }
            return (oneData.age == searchKey.age) && (oneData.job == trimmedJob);
        }));
    } catch (error) {
        console.log("onSearchError: ", error);
    }
}

export const getSearchKey = () => {
    try {
        const stored = JSON.parse(localStorage.getItem("customers2SearchKey") || "{}");
        return {
            age: stored && stored.age !== undefined && stored.age !== null ? String(stored.age) : "",
            job: stored && stored.job !== undefined && stored.job !== null ? stored.job : "",
        };
    } catch (error) {
        console.log("initSearchKeyError: ", error);
        return { age: "", job: "" };
    }
}