const workerFarm = require('worker-farm');

/////////
const keyWorker    = workerFarm(require.resolve('./workerGenerateKeys'));

let loopCount = 0;
const countMax = 20;
const startRun = new Date();

for (var counter=1;counter<(countMax+1);counter++) {
  const workerNumber = counter;
  const generateKeysOptions = {bits: 2048, workers: 2, keyindex: workerNumber, datapath: 'ut/keys'};
  /// generate keys
  keyWorker(generateKeysOptions, (err, result) => {
    const runTime = new Date() - startRun;
    if (err) {
      // console.log('2.masterGenerateKeys keyWorker error : ', workerNumber, err);
    };
    // console.log(`4.masterGenerateKeys - ${workerNumber} : runTime : ${runTime} : ${result}`);
    if (workerNumber === (countMax+1)) workerFarm.end(keyWorker)
  });

};
/////////
