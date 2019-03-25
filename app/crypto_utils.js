var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

const key = process.env.ENCRYPTION_KEY || "secret";
const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes192';
const inputEncoding = process.env.ENCRYPTION_INPUT_ENCODING || 'utf8';
const outputEncoding = process.env.ENCRYPTION_OUTPUT_ENCODING || 'hex';

var encryptAES = function(value, useKey = key) {
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(value, inputEncoding, outputEncoding);
    encrypted += cipher.final(outputEncoding)
    return encrypted
}

var decryptAES = function(encrypted, useKey = key) {
    var decipher = crypto.createDecipher(algorithm, key);
    decipher.setAutoPadding(false);
    var decrypted = decipher.update(encrypted, outputEncoding, inputEncoding)
    decrypted += decipher.final(inputEncoding)
    return decrypted
}

var encryptStringWithRsaPublicKey = function(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey, senha) {
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = Buffer.from(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt(
    {
        key: privateKey.toString(),
        passphrase: senha,
        padding: crypto.constants.RSA_NO_PADDING
    }, buffer);
    return decrypted.toString("hex");
};

module.exports = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey,
    encryptAES: encryptAES,
    decryptAES: decryptAES
}