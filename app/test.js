const MedicalRecord = require('../chaincode/prontuchain/lib/record.js');
const encrypt = require('./crypto_utils').encryptStringWithRsaPublicKey
const decrypt = require('./crypto_utils').decryptStringWithRsaPrivateKey
const encryptAES = require('./crypto_utils').encryptAES
const decryptAES = require('./crypto_utils').decryptAES

let record = MedicalRecord.createInstance(4222039047, '24/03/2019', 'asadad'); 
var objString = JSON.stringify(record);
var encryptedAES = encryptAES(objString);
var encryptedRSA = encrypt(encryptedAES, './public.pem');
var buffer = Buffer.from(encryptedRSA, 'base64');
var decryptedRSA = decrypt(buffer.toString('base64'), './private.pem', 'senha');
var decryptedAES = decryptAES(decryptedRSA);
console.log(decryptedAES);
record = MedicalRecord.deserialize(decryptedAES);