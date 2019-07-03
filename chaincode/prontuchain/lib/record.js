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
        this.type = obj.type;
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

    getType() {
        return this.type;
    }

    static fromBuffer(buffer) {
        return MedicalRecord.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, MedicalRecord);
    }

    static createInstance(chave, cpf, date, type, dados) {
        return new MedicalRecord({ chave, cpf, date, type, dados });
    }

    static getClass() {
        return 'org.prontuchain.MedicalRecord';
    }
}

module.exports = MedicalRecord;
