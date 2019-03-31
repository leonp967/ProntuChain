const MedicalRecord = require('../chaincode/prontuchain/lib/record.js');
const encrypt = require('./crypto_utils').encryptStringWithRsaPublicKey
const decrypt = require('./crypto_utils').decryptStringWithRsaPrivateKey
const encryptAES = require('./crypto_utils').encryptAES
const decryptAES = require('./crypto_utils').decryptAES
const RecordData = require('../chaincode/prontuchain/lib/recorddata');
 
let dados = new RecordData(4222039047, '24/03/2019', 'texto');
var objString = JSON.stringify(dados);
var chave = require('./crypto_utils').generateAESKey();
var chaveCrypto = encrypt(chave, './public.pem');
var encryptedAES = encryptAES(objString, chave);
let record = MedicalRecord.createInstance(chaveCrypto, 4222039047, '24/03/2019', encryptedAES);
//var buffer = Buffer.from(encryptedAES, 'base64');
var decryptedRSA = decrypt(chaveCrypto, './private.pem', 'senha');
var decryptedAES = decryptAES(encryptedAES, decryptedRSA);
console.log(decryptedAES);
record = MedicalRecord.deserialize(decryptedAES);