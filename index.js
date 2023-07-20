const fs = require('fs');
const axios = require('axios');

let i = 0;
function logMessage() {
  console.log(`Log number ${i++}...`);
}

function writeToLogFile() {
  const apiUrl = process.env['BALENA_SUPERVISOR_ADDRESS'] + '/v2/journal-logs';
  const apikey = process.env['BALENA_SUPERVISOR_API_KEY'];

  console.log(apiUrl);
  console.log(apikey);


  axios.post(apiUrl, {
    'follow': true,
    'all': true,
  }, {
    params: {
      'apikey': apikey
    },
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'stream'
  })
    .then(response => {
      const stream = response.data;

      const writeStream = fs.createWriteStream('log.txt');

      stream.on('data', chunk => {
        writeStream.write(chunk);
      });

      stream.on('error', error => {
        console.error('Error during stream:', error);
      });

      stream.on('end', () => {
        writeStream.end();
        console.log('Stream ended. Content written to log.txt');
      });
    })
    .catch(error => {
      console.error('Error making the POST request:', error);
    });
}

setInterval(logMessage, 1000);

writeToLogFile();
