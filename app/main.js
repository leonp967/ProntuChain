'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const MedicalRecord = require('../chaincode/prontuchain/lib/record.js');
const RecordData = require('../chaincode/prontuchain/lib/recorddata');
const decryptRSA = require('./crypto_utils').decryptStringWithRsaPrivateKey
const decryptAES = require('./crypto_utils').decryptAES
const homedir = require('os').homedir();
const path = require('path');

const wallet = new FileSystemWallet(path.join(homedir, 'prontuchain/wallet'));

async function main() {

  const gateway = new Gateway();

  try {

    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'bici@gmail.com';

    let connectionProfile = yaml.load(fs.readFileSync('../gateway/config.yaml', 'utf8'));

    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    // var query = {};
    // query.selector = {};
    // query.selector.cpf = '04222039047';
    // var dataFrom = '29/03/2019';
    // var dataTo = '29/03/2019';
    // if(dataFrom || dataTo){
    //   query.selector.date = {};
    // }
    // if(dataFrom){
    //     query.selector.date.$gte = dataFrom;
    // }
    // if(dataTo){
    //     query.selector.date.$lte = dataTo;
    // }
    // console.log(JSON.stringify(query));

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('prontuchain');
    const contract = await network.getContract('recordcontract', 'org.prontuchain.MedicalRecord');

    // let issueResponse = await contract.submitTransaction('retrieve', '04222039047', '29/03/2019', '29/03/2019');
    // const QueryResult = require('./query_result');
    // let array = JSON.parse(issueResponse);
    // array = eval(array);
    // array.forEach((obj) => {
    //   let record = new MedicalRecord(obj.Record);
    //   console.log(obj);
    // })

    console.log('Criando prontuario...\n');
    let dir = path.join(homedir, 'prontuchain/keys', 'alaba@gmail.com');
    let chavePublica = fs.readFileSync(path.join(dir, '/public.pem'), "utf8");
    let issueResponse = await contract.submitTransaction('create', '04222039047', '29/03/2019', '1', 'batata doce.', chavePublica);
    let record = MedicalRecord.fromBuffer(issueResponse);
    console.log(record);

    // console.log('\nRecuperando prontuario existente...\n');
    // issueResponse = await contract.submitTransaction('retrieve', '123456', '29/03/2019');
    // record = MedicalRecord.fromBuffer(issueResponse);
    // let chaveCriptografada = record.getChave();
    // let chave = decryptRSA(chaveCriptografada, './private.pem', 'senha');
    // let stringDados = decryptAES(record.getDados(), chave);
    // let dados = RecordData.deserialize(stringDados);
    // console.log(`\nRecuperado prontuario eletronico de paciente com cpf ${dados.cpf} : Consulta realizada no dia ${dados.data} com descricao: ${dados.texto}`);

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