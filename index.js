import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [resultRanking, setResultRanking] = useState("");
  const [resultHashtags, setResultHashtags] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const responseRanking = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const dataRanking = await responseRanking.json();
      if (responseRanking.status !== 200) {
        throw dataRanking.error || new Error(`Request failed with status ${responseRanking.status}`);
      }

      setResultRanking(dataRanking.result);

      const responseHashtags = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, generateHashtags: true }),
      });

      const dataHashtags = await responseHashtags.json();
      if (responseHashtags.status !== 200) {
        throw dataHashtags.error || new Error(`Request failed with status ${responseHashtags.status}`);
      }

      setResultHashtags(dataHashtags.result);

      setInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.jpg" className={styles.icon} />
        <h3>Rank My Post</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="input">       </label>
            <input
              type="text"
              id="input"
              name="input"
              placeholder="Enter your social media post idea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <input type="submit" value="Rank!" />
        </form>
        <div className={styles.resultContainer}>
          {resultHashtags && (
            <div className={styles.result}>
              <h4>Potential Hashtags:</h4>
              <p>{resultHashtags}</p>
            </div>
          )}
          {resultRanking && (
            <div className={styles.result}>
              <h4>Ranking and Suggestions:</h4>
              <p>{resultRanking}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
