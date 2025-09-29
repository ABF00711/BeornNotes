const mysqlDA = require("../Data_Access");


const jobController = {
    getJobs: async (req, res) => {
        try {
            const jobData = await mysqlDA.getAllData("job");

            res.json({message: "getJobs success", jobs: jobData});
        } catch (error) {
            console.log("getJobsError: ", error);
            res.json({message: "getJobs failed!"});
        }
    },


}

module.exports = jobController;