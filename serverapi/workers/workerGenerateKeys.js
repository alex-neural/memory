const Gun = require('gun/gun');
require('gun/lib/path.js');
const forge = require('node-forge');
const serialize = require('serialize-javascript');
const deserialize = (serializedJavascript) => {
  return eval('(' + serializedJavascript + ')');
};
const md5 = require('blueimp-md5');
// const md = forge.md.md5.create();

const gun = Gun(['//gun']);
const rsa = forge.pki.rsa;
// var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
module.exports = (options, cb) => {
  const data = options;
  makeKey(data, (err, result) => {
    const oldData = data;
    const callback = cb;
    // regenerate key on error
    if(err) makeKey(oldData, callback);
  });
  return
}

// module.exports = (options = {bits: 2048, workers: 2, keyindex: 1}, cb) => {
//   // console.log('1.generateKeys : ', options);
//   const data = options;
//   makeKey(data);
//   return
// }
// module.exports.savedb = (options = {db: gun.get('ut'), dbpath: 'unassigned-key', value: 'empty-value'}) => {
//   // console.log('1.generateKeys : ', options);
//   const data = options;
//   saveValue(data);
//   return
// }
///////////////
const makeKey = (data, callback) => {
  const options = { bits: data.bits, workers: data.workers };
  const cb = callback;
  // console.log('1.workerGenerateKeys makeKey : ', data);
  rsa.generateKeyPair(options, (err, keypair) => {
    // keypair.privateKey, keypair.publicKey
    // const signature = md5(keypair);
    // (err)? console.log('1.workerGenerateKeys makeKey error : ', err)
    // :console.log('1.generateKeys keypairs : ', keypair);

    const key = serialize(keypair);
    const signature = md5(key);
    // md.update(key);
    // const signature = md.digest().toHex();
    // console.log(`2.workerGenerateKeys generateKeys signature : ${signature}`);

    const serverkeys = gun.get('ut');
    const datapath = data.datapath;
    const keyindex = data.keyindex;
    serverkeys.get(`${datapath}/serverkeys/${keyindex}`).put({keypair: key, signature: signature});
    serverkeys.get(`${datapath}/serverkeys/${keyindex}`).get('keypair').val( key => {
      // md.update(key);
      // const signature = md.digest().toHex();
      let savedSignature;
      // (key === '5e543256c480ac577d30f76f9120eb74')?
      (!key)? savedSignature = 'undefined' : savedSignature = md5(key);
      // const savedKeypair = deserialize(key);

      // verify savedSignature same as signature
      const verify = savedSignature === signature;
      // console.log(`3.workerGenerateKeys ${keyindex} : ${signature} : ${savedSignature} ${verify}`);
      const err = (verify)? null : 'signature error';
      cb(err, verify);
    });
  });
  return
}
////// END makeKey ///////
// const saveValue = (data) => {
//   const options = data;
//   const { db, dbpath, value } = options;
//   db.path(`${dbpath}`).put(value);
//   db.path(`${dbpath}`).val(savedValue => {
//     // verify saveValue === inputValue
//     const verify = value === savedValue;
//     // console.log('1.saveValue verify : ', verify)
//   });
//   return
// }
