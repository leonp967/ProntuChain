'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const MedicalRecord = require('../chaincode/prontuchain/lib/record.js');
const RecordData = require('../chaincode/prontuchain/lib/recorddata');
const decryptRSA = require('./crypto_utils').decryptStringWithRsaPrivateKey
const decryptAES = require('./crypto_utils').decryptAES

const wallet = new FileSystemWallet('./identitys/leo/wallet');

async function main() {

  const gateway = new Gateway();

  try {

    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'User1@org1.example.com';

    let connectionProfile = yaml.load(fs.readFileSync('../gateway/connection.yaml', 'utf8'));

    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('prontuchain');
    const contract = await network.getContract('recordcontract', 'org.prontuchain.MedicalRecord');

    console.log('Criando prontuario...\n');
    let chavePublica = fs.readFileSync('./public.pem', "utf8");
    let issueResponse = await contract.submitTransaction('create', '123456', '29/03/2019', 'batata doce.', chavePublica);
    let record = MedicalRecord.fromBuffer(issueResponse);

    console.log('\nRecuperando prontuario existente...\n');
    issueResponse = await contract.submitTransaction('retrieve', '123456', '29/03/2019');
    record = MedicalRecord.fromBuffer(issueResponse);
    let chaveCriptografada = record.getChave();
    let chave = decryptRSA(chaveCriptografada, './private.pem', 'senha');
    let stringDados = decryptAES(record.getDados(), chave);
    let dados = RecordData.deserialize(stringDados);
    console.log(`\nRecuperado prontuario eletronico de paciente com cpf ${dados.cpf} : Consulta realizada no dia ${dados.data} com descricao: ${dados.texto}`);

    console.log('\nTudo beleza.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}
main().then(() => {

  console.log('Program complete.');

}).catch((e) => {

  console.log('Program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

});