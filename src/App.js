import { useState, useEffect, useCallback } from "react";
import ReactAudioPlayer from "react-audio-player";
import newSpeech from "../audio/speech.mp3";
import axios from "axios";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [audio, setAudio] = useState("");
  // since the axios function becomes a dependancy of the useEffect, we have to wrap it inside of
  const memorizedCallback = useCallback(
    (e) => {
      e.preventDefault();
      console.log("axios outgoing request");
      return axios({
        method: "POST",
        url: "/api/openai",
        data: JSON.stringify({ input }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("React render stage", res);
          setInput("");
        })
        .catch((e) => console.log(e.message));
    },
    [input]
  );

  // use useEffect to trigger setAudio source so that the virtual dom can be updated with the latest audio. And since this useEffect will be depending on the call of a function that fires the axios request, we need to wrap that function inside of the useEffect hook and put it as a dependancy of the useEffect.
  useEffect(() => {
    setAudio(newSpeech);
  }, [memorizedCallback]);

  return (
    <div className="App">
      <form onSubmit={memorizedCallback}>
        <input
          type="text"
          name="input"
          placeholder="Ask me a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" value="Get a response" />
      </form>
      {/* <audio src={audio} controls></audio> */}
      <ReactAudioPlayer src={audio} controls />
    </div>
  );
}

export default App;
