class CryptedRecord {

    constructor(chave, dados){
        this.keyCrypto = chave;
        this.dataCrypto = dados;
    }

    getKeyCrypto(){
        return keyCrypto;
    }

    getDataCrypto(){
        return dataCrypto;
    }

    createInstance(obj){
        return new CryptedRecord(obj.keyCrypto, obj.dataCrypto);
    }
}

module.exports = CryptedRecord;