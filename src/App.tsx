import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.scss";

interface StoredAudio {
  id: string;
  name: string;
  data: ArrayBuffer;
  createdAt: number;
}

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const DB_NAME = "AudioStorageDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

// IndexedDB helper functions
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

const getAllAudioFiles = async (): Promise<StoredAudio[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const saveAudioFile = async (audio: StoredAudio): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(audio);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const deleteAudioFile = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const App = () => {
  const [savedAudioFiles, setSavedAudioFiles] = useState<StoredAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentAudioName, setCurrentAudioName] = useState<string>("");
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadSavedFiles = useCallback(async () => {
    try {
      const files = await getAllAudioFiles();
      setSavedAudioFiles(files.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error("Failed to load saved audio files:", err);
    }
  }, []);

  useEffect(() => {
    loadSavedFiles();
  }, [loadSavedFiles]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setSuccessMessage(null);
    setPendingFile(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".wav")) {
      setError("Please select a WAV file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setPendingFile(file);
    const url = URL.createObjectURL(file);
    setCurrentAudio(url);
    setCurrentAudioName(file.name);
    setIsPlaying(false);
  };

  const handleSaveFile = async () => {
    if (!pendingFile) return;

    try {
      const arrayBuffer = await pendingFile.arrayBuffer();
      const audioRecord: StoredAudio = {
        id: `${Date.now()}-${pendingFile.name}`,
        name: pendingFile.name,
        data: arrayBuffer,
        createdAt: Date.now(),
      };
      await saveAudioFile(audioRecord);
      await loadSavedFiles();
      setSuccessMessage(`"${pendingFile.name}" saved to local storage!`);
      setPendingFile(null);
    } catch (err) {
      setError("Failed to save audio file.");
      console.error(err);
    }
  };

  const handleDeleteFile = async (id: string, name: string) => {
    try {
      await deleteAudioFile(id);
      await loadSavedFiles();
      setSuccessMessage(`"${name}" deleted.`);
      if (currentAudioId === id) {
        setCurrentAudio(null);
        setCurrentAudioName("");
        setCurrentAudioId(null);
        setIsPlaying(false);
      }
    } catch (err) {
      setError("Failed to delete audio file.");
      console.error(err);
    }
  };

  const playPauseStoredAudio = (audio: StoredAudio) => {
    if (currentAudioId === audio.id) {
      // Same track - toggle play/pause
      togglePlayPause();
    } else {
      // Different track - load and play
      const blob = new Blob([audio.data], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setCurrentAudio(url);
      setCurrentAudioName(audio.name);
      setCurrentAudioId(audio.id);
      setError(null);
      setSuccessMessage(null);
      // Play after a short delay to allow audio to load
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>sarahserussi.com</h1>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#talks">Talks</a>
          <a href="#audio">Audio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main className="app__body">
        <section className="about" id="about">
          <article className="text">
            <h2 className="title">Hello, I'm Sarah 👋🏼</h2>
            <p>
              I am a software developer working at Variant in Trondheim. I like
              to knit, crochet, cook food for my daughter and watch trash on TV.
              I believe there are too few women in technology, and I try to do
              an extra effort in closing the gender gap in the IT industry. I am
              part of the <a href="https://tenknorge.com/">TENK</a> team in
              Trondheim where we organize{" "}
              <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a>{" "}
              which is a 2 day programming camp for 13-18 year old girls.
            </p>
          </article>
          <img
            src="/media/sarah-lilla.jpg"
            alt="Sarah"
            className="clip-circle"
          />
        </section>
        <section className="projects" id="projects">
          <h2>Projects</h2>
          <article className="card">
            <h3>TENK Tech Camp</h3>
            <p>
              <a href="https://tenknorge.com/tenk-tech-camp">TENK Tech Camp</a>{" "}
              is a 2 day programming camp for 13-18 year old girls in Norway. It
              is run in four cities (as per 2023), and consists of workshops and
              motivational talks which has the goal of inspiring more girls to
              choose technology related studies and eventually work in the IT
              industry.
            </p>
          </article>
          <article className="card">
            <h3>Dukkling</h3>
            <p>
              I became a mom in 2021 and experienced the highs and lows of the
              fourth trimester. I was often overwhelmed with the amount of
              information and tasks needed to be done continuously in addition
              to taking care of my daughter. I was missing an app that kept
              track of all the things I needed to do in order to make my future
              self more prepared and on top of things. In the first 6 months I
              was in a bubble and couldn't really focus on anything other than
              my family of three. After some time there were less sleepless
              nights and also time to reflect and think of ideas for tools to
              enter this new life as a first-time mom.
              <br />
              <br />
              What does a software developer, designer, doctor and influencer
              have in common? We’re all moms and tired of using too many and too
              poorly designed apps to administrate our family life. None of the
              apps on the market right now fit our needs, so we are creating our
              own. Read more about our project at{" "}
              <a href="https://dukkling.com">dukkling.com</a>.
            </p>
          </article>
          <article className="card">
            <h3>FoodforSophia</h3>
            <p>
              In 2022 I created an Instagram account called{" "}
              <a href="https://www.instagram.com/foodforsophia/">
                @foodforSophia
              </a>{" "}
              where I share the food Sophia eats. She has both milk allergy and
              egg allergy, so we are making almost all food from scratch. We try
              to eat more organic and less ultra-processed food.
            </p>
            <div className="card__images">
              <img
                src="/media/foodforsophia.png"
                alt="Food Sophia eats"
                className="clip-circle"
              />
              <img
                src="/media/dinner_sophia.png"
                alt="Dinner Sophia eats"
                className="clip-circle"
              />
              <img
                src="/media/oatmeal_waffles_sophia.png"
                alt="Waffles Sophia eats"
                className="clip-circle"
              />
              <img
                src="/media/porridge_sophia.png"
                alt="Porridge Sophia eats"
                className="clip-circle"
              />
            </div>
          </article>
          {/* <article className="card">
            <h3>Knitting and crocheting</h3>
            <div className="card__images">
              <img
                src="/media/DALL-E_2022-10-07_22.10.59_a_dream_within_a_dream_in_a_balloon_cyberpunk.png"
                alt="DALL-E: A dream within a dream in a balloon."
                className="clip-circle"
              />
              <img
                src="/media/DALL-E_2022-10-07_22.11.09_a_dream_within_a_dream_in_a_balloon_2_cyberpunk.png"
                alt="DALL-E: A dream within a dream in a balloon."
                className="clip-circle"
              />
              <img
                src="media/DALL-E_2022-10-07_22.10.24_a_dream_within_a_dream_in_an_ocean_cyberpunk.png"
                alt="DALL-E: A dream within a dream in an ocean."
                className="clip-circle"
              />
            </div>
          </article> */}
        </section>
        <section className="talks" id="talks">
          <h2 className="title">Talks</h2>
          <article className="card">
            Booster conference in Bergen, March 2023:{" "}
            <a href="https://2023.boosterconf.no/program/wednesday/9_short_talks_and_workshops/kongesalen/170-the-tale-of-four-moms-wanting-to-make-an-app/">
              THE TALE OF FOUR MOMS WANTING TO MAKE AN APP
            </a>
          </article>
        </section>
        <section className="audio" id="audio">
          <h2 className="title">Audio</h2>
          <article className="card">
            <h3>Upload WAV File</h3>
            <p className="audio__info">
              Select a WAV file to preview and save (max {MAX_FILE_SIZE_MB}MB). 
              Files are stored in your browser's local storage.
            </p>
            <div className="audio__file-input">
              <input
                type="file"
                accept=".wav"
                onChange={handleFileSelect}
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="audio__file-label">
                Choose WAV File
              </label>
              {pendingFile && (
                <>
                  <span className="audio__file-name">{pendingFile.name}</span>
                  <button
                    className="audio__save-btn"
                    onClick={handleSaveFile}
                  >
                    💾 Save to Library
                  </button>
                </>
              )}
            </div>
            {error && <p className="audio__error">{error}</p>}
            {successMessage && <p className="audio__success">{successMessage}</p>}
          </article>

          <article className="card audio__spotify">
            <h3>Media Player</h3>
            
            {/* Player controls - always visible */}
            <div className="audio__player">
              <audio
                ref={audioRef}
                src={currentAudio || ""}
                onEnded={handleAudioEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              
              {currentAudio ? (
                <>
                  <p className="audio__now-playing">
                    Now playing: <strong>{currentAudioName}</strong>
                  </p>
                  <div className="audio__progress">
                    <span className="audio__time">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      className="audio__progress-slider"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={handleProgressChange}
                    />
                    <span className="audio__time">{formatTime(duration)}</span>
                  </div>
                  <div className="audio__controls">
                    <button
                      className="audio__play-btn"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                    </button>
                    <div className="audio__volume">
                      <label htmlFor="volume-slider">🔊</label>
                      <input
                        type="range"
                        id="volume-slider"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="audio__volume-slider"
                      />
                      <span className="audio__volume-value">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="audio__placeholder">
                  Upload a WAV file or select one from your library below.
                </p>
              )}
            </div>

            {/* Track list */}
            <div className="audio__tracklist">
              <h4>Your Library</h4>
              {savedAudioFiles.length > 0 ? (
                <ul className="audio__tracks">
                  {savedAudioFiles.map((file) => (
                    <li 
                      key={file.id} 
                      className={`audio__track ${currentAudioId === file.id ? "audio__track--active" : ""}`}
                    >
                      <div className="audio__track-info">
                        <span className="audio__track-name">{file.name}</span>
                        <span className="audio__track-date">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="audio__track-actions">
                        <button
                          className="audio__track-btn audio__track-btn--play"
                          onClick={() => playPauseStoredAudio(file)}
                          title={currentAudioId === file.id && isPlaying ? "Pause" : "Play"}
                        >
                          {currentAudioId === file.id && isPlaying ? "⏸️" : "▶️"}
                        </button>
                        <button
                          className="audio__track-btn audio__track-btn--delete"
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="audio__placeholder">
                  No saved audio files yet. Upload a WAV file above.
                </p>
              )}
            </div>
          </article>
        </section>
        <section className="contact" id="contact">
          <h2>Contact</h2>
          <p>
            ✉️ E-mail:{" "}
            <a href="mailto:sarah.serussi@gmail.com">sarah.serussi@gmail.com</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
