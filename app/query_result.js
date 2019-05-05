class QueryResult{
    constructor(obj){
        this.Key = obj.Key;
        this.Record = obj.Record;
    }

    getKey(){
        return this.Key;
    }

    getRecord(){
        return this.Record;
    }
}

module.exports = QueryResult;