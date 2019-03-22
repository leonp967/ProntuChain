'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const MedicalRecord = require('../chaincode/prontuchain/lib/record.js');

const wallet = new FileSystemWallet('./identitys/leo/wallet');

// Main program function
async function main() {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'User1@org1.example.com';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('prontuchain');
    const contract = await network.getContract('recordcontract', 'org.prontuchain.MedicalRecord');

    console.log('Criando prontuario...\n');
    let issueResponse = await contract.submitTransaction('create', '04222039047', '21/03/2019', 'Juveno estava muito mal, tossindo sangue e cagando batatas pretas e brilhantes.');
    let record = MedicalRecord.fromBuffer(issueResponse);
    console.log(`\nProntuario eletronico de paciente com cpf ${record.cpf} : Consulta realizada no dia ${record.data} com descricao: ${record.texto}`);

    console.log('\nRecuperando prontuario existente...\n');
    issueResponse = await contract.submitTransaction('retrieve', '04222039047', '21/03/2019');
    record = MedicalRecord.fromBuffer(issueResponse);
    console.log(`\nRecuperado prontuario eletronico de paciente com cpf ${record.cpf} : Consulta realizada no dia ${record.data} com descricao: ${record.texto}`);

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