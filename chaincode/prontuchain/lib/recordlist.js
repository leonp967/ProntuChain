'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const MedicalRecord = require('./record.js');

class RecordList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.prontuchain.medicalrecordlist');
        this.use(MedicalRecord);
    }

    async addRecord(record) {
        return this.addState(record);
    }

    async getRecord(recordKey) {
        return this.getState(recordKey);
    }

    async updateRecord(record) {
        return this.updateState(record);
    }

    async getRichQuery(query) {
        return this.getQuery(query);
    }
}


module.exports = RecordList;