'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const CryptedRecord = require('./crypted-record.js');

class MedicalRecord extends State {

    constructor(obj) {
        super(MedicalRecord.getClass(), [obj.cpf, obj.date]);
        this.cryptedRecord = new CryptedRecord(obj.chave, obj.dados);
        this.cpf = obj.cpf;
        this.date = obj.date;
    }

    getCryptedRecord() {
        return this.cryptedRecord;
    }

    getCpf() {
        return this.cpf;
    }

    getDate() {
        return this.date;
    }

    static fromBuffer(buffer) {
        return MedicalRecord.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, MedicalRecord);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(chave, cpf, date, dados) {
        return new MedicalRecord({ chave, cpf, date, dados });
    }

    static getClass() {
        return 'org.prontuchain.MedicalRecord';
    }
}

module.exports = MedicalRecord;
