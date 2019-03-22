'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class MedicalRecord extends State {

    constructor(obj) {
        super(MedicalRecord.getClass(), [obj.cpf, obj.data]);
        Object.assign(this, obj);
    }

    getCpf() {
        return this.cpf;
    }

    getData() {
        return this.data;
    }

    getDescricao() {
        return this.texto;
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
    static createInstance(cpf, data, texto) {
        return new MedicalRecord({ cpf, data, texto });
    }

    static getClass() {
        return 'org.prontuchain.MedicalRecord';
    }
}

module.exports = MedicalRecord;
