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

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
    
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              jsonRes.IsDelete = res.value.is_delete.toString();
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
          }
        }
      }
}

class MedicalRecordContract extends Contract {

    constructor() {
        super('org.prontuchain.MedicalRecord');
    }

    createContext() {
        return new MedicalRecordContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        console.log('Instantiate the contract');
    }

    /**
     * Cria um novo registro de prontuario eletronico do paciente 
     * @param {Context} ctx 
     * @param {BigInteger} cpf cpf do paciente
     * @param {String} data data da consulta/exame
     * @param {String} texto descricao da consulta/exame
     */
    async create(ctx, cpf, data, tipo, texto, chavePublica) {

        let chave = generateAESKey();
        let dados = new RecordData(cpf, data, tipo, texto);
        let stringDados = JSON.stringify(dados);
        let dadosCriptografados = encryptAES(stringDados, chave);
        let chaveCriptografada = encryptRSA(chave, chavePublica);
        let record = MedicalRecord.createInstance(chaveCriptografada, cpf, data, tipo, dadosCriptografados);
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
    async retrieve(ctx, type, cpf, dataFrom, dataTo) {
        var query = {};
        query.selector = {};
        query.selector.cpf = cpf;
        if(dataFrom || dataTo){
            query.selector.date = {};
        }
        if(dataFrom){
            query.selector.date.$gte = dataFrom;
        }
        if(dataTo){
            query.selector.date.$lte = dataTo;
        }
        if(type && type > 0){
            query.selector.type = type;
        }

        let results;

        try {
            var iterator = await ctx.recordList.getRichQuery(JSON.stringify(query));
            results = await ctx.getAllResults(iterator, false);
        } catch(error) {
            throw new Error(error);
        }

        if(!results) {
            throw new Error('Erro inesperado!');
        }

        return JSON.stringify(results);
    }

}

module.exports = MedicalRecordContract;