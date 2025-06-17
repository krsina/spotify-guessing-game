import { useState, useEffect } from 'react';
import './App.css';

// Hard-coded song data
const songData = [
  { id: 1, artist: 'Celestial Echoes', title: 'Starlight Serenade', albumArt: 'https://picsum.photos/seed/a/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', popularity: 88 },
  { id: 2, artist: 'Crimson Cascade', title: 'Velvet Thunder', albumArt: 'https://picsum.photos/seed/b/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', popularity: 92 },
  { id: 3, artist: 'Neon Bloom', title: 'Future Funk', albumArt: 'https://picsum.photos/seed/c/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', popularity: 75 },
  { id: 4, artist: 'Solar Tides', title: 'Oceanic Drift', albumArt: 'https://picsum.photos/seed/d/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', popularity: 81 },
  { id: 5, artist: 'Ghostly Grove', title: 'Whispering Woods', albumArt: 'https://picsum.photos/seed/e/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', popularity: 78 },
  { id: 6, artist: 'Retro Future', title: 'Cyber Sunset', albumArt: 'https://picsum.photos/seed/f/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', popularity: 85 },
  { id: 7, artist: 'Lunar Waves', title: 'Moonlit Ballad', albumArt: 'https://picsum.photos/seed/g/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', popularity: 89 },
  { id: 8, artist: 'Digital Dream', title: 'Pixel Paradise', albumArt: 'https://picsum.photos/seed/h/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', popularity: 82 },
];

const getTwoRandomSongs = () => {
    const shuffled = [...songData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
};

const getNewRandomSong = (currentSong) => {
    let newSong;
    do {
        newSong = songData[Math.floor(Math.random() * songData.length)];
    } while (newSong.id === currentSong.id);
    return newSong;
};

// A unified Song Card component that handles both left and right variations
const SongCard = ({ song, type, onGuess, showResults }) => {
    return (
        <div className="bg-[#181818] rounded-lg flex flex-col text-left shadow-lg animate-fadeIn">
            {/* Album Art */}
            <img src={song.albumArt} alt={song.title} className="w-11/12 mx-auto pt-4 rounded-md object-cover" />
            
            <div className="flex justify-between items-center min-h-[4rem]">
                {/* Left-aligned text */}
                <div className="flex-1 overflow-hidden pr-2 pl-4">
                    <h2 className="font-bold text-lg truncate text-white">{song.title}</h2>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                
                {/* Right-aligned content (score or buttons) */}
                <div className="flex-shrink-0">
                    {type === 'left' && (
                         <p className="text-3xl font-black text-yellow-400 text-right pr-4">{song.popularity}</p>
                    )}

                    {type === 'right' && (
                        <div className="flex items-center justify-end">
                            {showResults ? (
                                <p className="text-3xl font-black text-yellow-400 animate-pulse pr-4">{song.popularity}</p>
                            ) : (
                                <div className="flex flex-row space-x-3">
                                    <button
                                        onClick={() => onGuess('lower')}
                                        className="w-10 h-10 flex items-center justify-center bg-transparent border-2 border-gray-500 text-gray-400 rounded-full hover:border-white hover:text-white transition-colors"
                                        aria-label="Guess Lower"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H5v2h14z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => onGuess('higher')}
                                        className="w-10 h-10 flex items-center justify-center bg-transparent border-2 border-gray-500 text-gray-400 rounded-full hover:border-white hover:text-white transition-colors"
                                        aria-label="Guess Higher"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// Main App Component
function App() {
    const [leftSong, setLeftSong] = useState(null);
    const [rightSong, setRightSong] = useState(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        const [song1, song2] = getTwoRandomSongs();
        setLeftSong(song1);
        setRightSong(song2);
    }, []);

    const nextRound = () => {
        setLeftSong(rightSong);
        setRightSong(getNewRandomSong(rightSong));
        setGameState('playing');
        setResultMessage('');
    };

    const handleGuess = (guess) => {
        if (gameState !== 'playing') return; // Prevent multiple guesses

        const isActuallyHigher = rightSong.popularity > leftSong.popularity;
        const isTie = rightSong.popularity === leftSong.popularity;
        let isCorrect = false;

        if (isTie) {
            isCorrect = true; 
        } else if (guess === 'higher' && isActuallyHigher) {
            isCorrect = true;
        } else if (guess === 'lower' && !isActuallyHigher) {
            isCorrect = true;
        }

        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
            setResultMessage(isTie ? "It's a Tie! Streak continues." : 'Correct! 🎉');
        } else {
            setScore(0);
            setResultMessage(`Incorrect! Popularity was ${isActuallyHigher ? 'Higher' : 'Lower'}.`);
        }
        setGameState('result');
        
        setTimeout(() => {
            nextRound();
        }, 2500);
    };

    if (!leftSong || !rightSong) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">Loading Game...</div>;
    }

    const showResults = gameState === 'result';

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <header className="w-full mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight">Higher or Lower</h1>
                <p className="text-lg text-gray-400">Spotify Edition</p>
                <p className="text-2xl font-bold mt-4 text-[#1DB954]">Streak: {score}</p>
            </header>

            <main className="w-full flex-grow flex flex-col items-center justify-center">
                <div className="flex flex-row items-start justify-center gap-8">
                    <SongCard key={leftSong.id} song={leftSong} type="left" />
                    
                    <div className="flex items-center text-4xl font-bold text-gray-500 h-[368px]">VS</div>
                    
                    <SongCard key={rightSong.id} song={rightSong} type="right" onGuess={handleGuess} showResults={showResults} />
                </div>

                {showResults && (
                    <div className="mt-8 text-center bg-transparent p-5 rounded-xl w-full max-w-lg h-20">
                        <p className={`text-3xl font-bold ${resultMessage.includes('Correct') || resultMessage.includes('Tie') ? 'text-green-500' : 'text-red-500'}`}>
                            {resultMessage}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;