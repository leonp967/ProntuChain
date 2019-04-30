'use strict';

class RecordData {

    constructor(cpf, data, texto) {
        this.cpf = cpf;
        this.data = data;
        this.texto = texto;
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

    static getClass() {
        return 'org.prontuchain.RecordData';
    }

    static deserialize(data) {
        let json = JSON.parse(data.toString());
        let object = new (RecordData)(json);
        return object;
    }
}

module.exports = RecordData;