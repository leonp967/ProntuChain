class CryptedRecord {

    constructor(chave, dados){
        this.chaveCrypto = chave;
        this.dadosCrypto = dados;
    }

    getChaveCrypto(){
        return chaveCrypto;
    }

    getDadosCrypto(){
        return dadosCrypto;
    }
}

module.exports = CryptedRecord;