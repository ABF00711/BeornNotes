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

    async getOneData (filter) {
        try {
            return await this.dbModel.findOne(filter);
        } catch (error) {
            console.log("DA_getOneDataError: ", error);
        }
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
            console.log("DA_deleteError: ", error);
        }
    }
}

module.exports = DataAccess;