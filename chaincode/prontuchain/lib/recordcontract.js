'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

const MedicalRecord = require('./record.js');
const RecordList = require('./recordlist.js');

class MedicalRecordContext extends Context {

    constructor() {
        super();
        this.recordList = new RecordList(this);
    }

}

class MedicalRecordContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.prontuchain.MedicalRecord');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new MedicalRecordContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Cria um novo registro de prontuario eletronico do paciente 
     * @param {Context} ctx 
     * @param {BigInteger} cpf cpf do paciente
     * @param {String} data data da consulta/exame
     * @param {String} texto descricao da consulta/exame
     */
    async create(ctx, cpf, data, texto) {

        let record = MedicalRecord.createInstance(cpf, data, texto);
        await ctx.recordList.addRecord(record);
        return record.toBuffer();
    }

    /**
     * Recupera um registro de prontuario eletronico
     * @param {Context} ctx 
     * @param {BigInteger} cpf cpf do paciente
     * @param {String} data data da consulta/exame
     */
    async retrieve(ctx, cpf, data) {

        // Retrieve the current paper using key fields provided
        let recordKey = MedicalRecord.makeKey([cpf, data]);
        let record = await ctx.recordList.getRecord(recordKey);

        if(!record) {
            throw new Error('Nao existe registro com os dados recebidos');
        }

        return record.toBuffer();
    }

}

module.exports = MedicalRecordContract;
