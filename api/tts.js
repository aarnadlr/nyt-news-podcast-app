const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = 'Text to synthesize. Hello';
// const outputFile = '/Users/aaronadler/Desktop/nyt-news-podcast-app/src/output.mp3';
// const outputFile = path.resolve(__dirname, 'output.mp3');

module.exports = async (req, res) => {

  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' }
  };

  const [response] = await client.synthesizeSpeech(request)
  // client.synthesizeSpeech(request);


  // res.set('Content-Type', 'audio/mpeg');
  // res.set('Content-Disposition', 'attachment; filename="output.mp3');
  // res.send(new Buffer(response.audioContent, 'binary'));



  // const writeFile = util.promisify(fs.writeFile);

  // await writeFile( outputFile, response.audioContent, 'binary' );

  // console.log(`Audio content written to file: ${outputFile}`);
  console.log(`Audio content SENT`);

  res.json({
    // body: req.body,
    body: new Buffer.from(response.audioContent, 'binary')
    // body: response
    // query: req.query,
    // query: req.query,
    // cookies: req.cookies
    // cookies: req.cookies
  });
};
