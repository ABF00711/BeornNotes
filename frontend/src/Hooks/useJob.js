import { useContext } from "react"
import { MyContext } from "../Context"
import { JobsContext } from "../Context/JobsContext"
import services from "../Services";

function useJob (){
    const {jobs, setJobs} = useContext(JobsContext);

    const getJobs = async() => {
        try {
            const res = await services.getJobs();
            if(res.message == "getJobs success"){
                setJobs(res.jobs);
            }
        } catch (error) {
            console.log("getJobsError: ", error);
        }
    }

    return {
        getJobs, jobs
    }
}

export default useJob;