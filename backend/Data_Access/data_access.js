class DataAccess{
    constructor(dbModel){
        this.dbModel = dbModel;
    }

    async create (tableName, newData) {
        try {
            if (!tableName || !newData || typeof newData !== 'object') {
                throw new Error('Invalid tableName or newData provided');
            }

            const questionMarks = [];
            const keys = [];
            const values = [];
            
            for (const key in newData) {
                if (newData.hasOwnProperty(key) && newData[key] !== undefined) {
                    questionMarks.push("?");
                    keys.push(key);
                    values.push(newData[key]);
                }
            }

            if (keys.length === 0) {
                throw new Error('No valid data provided for insertion');
            }

            const questionMarksStr = questionMarks.join(", ");
            const keysStr = keys.join(", ");
            const sql = `INSERT INTO ${tableName} (${keysStr}) VALUES (${questionMarksStr})`;
            await this.dbModel.query(sql, values);
            
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