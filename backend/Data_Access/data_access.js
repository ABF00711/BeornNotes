class DataAccess{
    constructor(dbModel){
        this.dbModel = dbModel;
    }

    async create (data) {
        try {
            await this.dbModel.create(data);
        } catch (error) {
            console.log("DA_createError: ", error);
        }
    }

    async getAllData () {
        try {
            return await this.dbModel.find();
        } catch (error) {
            console.log("DA_getAllDataError: ", error)
        }
    }

    async searchUsers(query) {
        return await this.dbModel.find({
            $or: [
            { name: { $regex: query, $options: "i" } },     // case-insensitive
            { display_name: { $regex: query, $options: "i" } },
            { job: { $regex: query, $options: "i" } }
            ]
        });
    }

    async update (id, newData){
        try {
            return await this.dbModel.findByIdAndUpdate(id, newData, {new:true});
        } catch (error) {
            console.log("DA_updateErro: ", error);
        }
    }

    async delete (id){
        try {
            await this.dbModel.findByIdAndDelete(id);
        } catch (error) {
            console.log()
        }
    }
}

module.exports = DataAccess;