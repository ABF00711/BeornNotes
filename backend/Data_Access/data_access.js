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

    async getAllData (tableName) {
        try {
            if (!tableName) {
                throw new Error('Table name is required');
            }
            
            const sql = `SELECT * FROM ${tableName}`;
            const [rows] = await this.dbModel.execute(sql);
            return rows;
        } catch (error) {
            console.log("DA_getAllDataError: ", error);
            throw error;
        }
    }

    async getOneData (tableName, filter) {
        try {
            if (!tableName || !filter || typeof filter !== 'object') {
                throw new Error('Invalid tableName or filter provided');
            }

            const conditions = [];
            const values = [];
    
            for (const key in filter) {
                if (filter.hasOwnProperty(key) && filter[key] !== undefined) {
                    conditions.push(`${key} = ?`);
                    values.push(filter[key]);
                }
            }
            if (conditions.length === 0) {
                throw new Error('No valid filter conditions provided');
            }

            const whereClause = conditions.join(' AND ');
            const sql = `SELECT * FROM ${tableName} WHERE ${whereClause} LIMIT 1`;
            
            const [rows] = await this.dbModel.execute(sql, values);
            
            return rows[0] || null;        
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

    async excuteSql (sql){
        try {
            const [rows] = await this.dbModel.execute(sql);
            return rows;
        } catch (error) {
            console.log("DA_excuteSqlError: ", error);
        }
    }
}

module.exports = DataAccess;