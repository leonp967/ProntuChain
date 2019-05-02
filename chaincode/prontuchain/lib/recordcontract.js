'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

const MedicalRecord = require('./record.js');
const State = require('../ledger-api/state');
const RecordData = require('./recorddata');
const RecordList = require('./recordlist');
const encryptRSA = require('./crypto_utils').encryptStringWithRsaPublicKey;
const encryptAES = require('./crypto_utils').encryptAES;
const generateAESKey = require('./crypto_utils').generateAESKey;

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
    async create(ctx, cpf, data, texto, chavePublica) {

        let chave = generateAESKey();
        let dados = new RecordData(cpf, data, texto);
        let stringDados = JSON.stringify(dados);
        let dadosCriptografados = encryptAES(stringDados, chave);
        let chaveCriptografada = encryptRSA(chave, chavePublica);
        let record = MedicalRecord.createInstance(chaveCriptografada, cpf, data, dadosCriptografados);
        await ctx.recordList.addRecord(record);
        let buffer = State.serialize(record);
        return buffer;
    }

    /**
     * Recupera um registro de prontuario eletronico
     * @param {Context} ctx 
     * @param {String} cpf cpf do paciente
     * @param {String} dataFrom data inicial da consulta/exame
     * @param {String} dataTo data final da consulta/exame
     */
    async retrieve(ctx, cpf, dataFrom, dataTo) {

        //let recordKey = MedicalRecord.makeKey([cpf, data]);
        // var query = {};
        // query.selector = {};
        // query.selector.cpf = cpf;
        // if(dataFrom){
        //     query.selector.dataFrom = {};
        //     query.selector.dataFrom.$gte = dataFrom;
        // }
        // if(dataTo){
        //     query.selector.dataTo = {};
        //     query.selector.dataTo.$lte = dataTo;
        // }
        var query = "{\"selector\":{\"cpf\":\"" + cpf + "\"}}";

        let response;

        try {
            response = await ctx.recordList.getQuery(query);
        } catch(error){
            throw new Error(error);
        }

        if(!response) {
            throw new Error('Nao existe registro com os dados recebidos');
        }

        return response.toBuffer();
    }

}

module.exports = MedicalRecordContract;
