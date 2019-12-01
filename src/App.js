import React, { useEffect, useState } from 'react';

function App() {
  const [totalNumOfArticles, setTotalNumOfArticles] = useState(null);

  const [longTranscriptString, setLongTranscriptString] = useState(
    'Loading...'
  );

  let finalSingleString = '';

  let introWithLongString = 'unset';

  const buildString = data => {
    // Save the total num of articles (to render separately)
    setTotalNumOfArticles(data.results.length);

    let podcastIntroString = `Hello. And welcome to The Daily Review Podcast. We are pleased to present you the top ${data.results.length} stories from The New York Times:`;

    // Store the long final accum string
    finalSingleString = data.results.reduce(
      (accumString, currObj, ind, srcArr) => {
        let prefix = `Story number ${ind + 1}.`;

        let title = `${currObj.title}.`;
        let abstract = currObj.abstract;

        //Build the single string for each articleObj:
        // concat the prefix, the title, the abstract
        let singleString = prefix.concat(' ', title).concat(' ', abstract);

        // Add to the accumString the single string
        return accumString.concat(' ', singleString);
      }, ''
    ); // <-- END OF REDUCE FUNCTION

    introWithLongString = podcastIntroString.concat(finalSingleString);
    //Take the finalSingleString and save it to state
    setLongTranscriptString(introWithLongString);

    return introWithLongString;
  }; //<--END OF buildString()

  useEffect(() => {


    async function fetchArticles() {
      // 1. store the response
      const response = await fetch(
        'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=YFNhGhkzEe0Yq3KwV25z5b7qNvzGYmne'
      );
      // 2. store the converted JSON
      const myJson = await response.json();
      // 3. Do stuff
      let introWithLongString = buildString(myJson);

      // console.log("FROM NYT API FETCH SERVER ROUTE:", JSON.stringify(introWithLongString));

    };




    ////

    //CALL TO /tts ROUTE (GOOGLE CLOUD):

    async function fetchTTS() {
      const response2 = await fetch('/api/tts', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({introWithLongString}) // body data type must match "Content-Type" header
      });

      const myJson2 = await response2.json();

      console.log("FROM TTS SERVER ROUTE:", JSON.stringify(myJson2));
    }


    ///
    async function callBothFetches() {

      await fetchArticles();
      await fetchTTS();
    }

    callBothFetches();

  }, []); //<--END OF UseEffect

  return (
    <div
      className="App"
      style={{ display: 'flex', flexDirection: 'column', margin: '32px' }}
    >

      <h1>The Daily Review Podcast</h1>

      <h3>(Total num of articles: {totalNumOfArticles})</h3>

      <br />

      <button
        style={{
          background: 'limegreen',
          width: '240px',
          padding: '24px',
          margin: '16px',
          borderRadius: '32px'
        }}
        type={'primary'}
        // onClick={() => speak({ text: longTranscriptString, voice })}
      >
        <span role="img">▶</span>️ PLAY The Daily Review
      </button>

      <br />

      <button
        style={{
          background: 'red',
          width: '240px',
          padding: '8px 24px',
          margin: '16px',
          borderRadius: '32px'
        }}
        type={'primary'}
        // onClick={() => cancel()}
      >
        STOP
      </button>

      <br />
      <br />

      <h3>Transcript:</h3>

      <p>{longTranscriptString}</p>
    </div>
  );
}

export default App;
