import { useReducer, useEffect } from "react";
import { v4 as RandomID } from "uuid";
/////////////////////////////////////[Component]
import Card from "./Components/Card";

/////////////////////////////////////[Images]
import eula from "./assets/Eula.webp";
import jean from "./assets/Jean.webp";
import sara from "./assets/Kujou_Sara.webp";
import nilou from "./assets/Nilou.webp";
import raiden from "./assets/Raiden.webp";
import yelan from "./assets/Yelan.webp";
import eulaChibi from "./assets/EulaChibi.webp";
import backSides from "./assets/back_sides.png";

/////////////////////////////////////[Normal Variable]
const REDUCER_ACTION = {
  FLIP: "flip",
  VALIDATE: "validate",
  SHUFFLE: "shuffle",
  RETAKE: "retake",
  GAME_OVER: "game_over",
};

// Legendary fisher yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const initialState = {
  turns: 0,
  data: [
    { frontSrc: jean, backSrc: backSides, alt: "jean", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: jean, backSrc: backSides, alt: "jean", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: eula, backSrc: backSides, alt: "eula", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: eula, backSrc: backSides, alt: "eula", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: sara, backSrc: backSides, alt: "sara", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: sara, backSrc: backSides, alt: "sara", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: nilou, backSrc: backSides, alt: "nilou", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: nilou, backSrc: backSides, alt: "nilou", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: raiden, backSrc: backSides, alt: "raiden", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: raiden, backSrc: backSides, alt: "raiden", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: yelan, backSrc: backSides, alt: "yelan", isFlipped: true, id:RandomID() }, //prettier-ignore
    { frontSrc: yelan, backSrc: backSides, alt: "yelan", isFlipped: true, id:RandomID() }, //prettier-ignore
  ],
  answers: [],
  correctAnswers: [],
  finished: false,
  highscore: localStorage.getItem("highscore"),
};

function reducer(state, action) {
  let updateState;
  switch (action.type) {
    case REDUCER_ACTION.SHUFFLE:
      return { ...state, data: action.payload };
    case REDUCER_ACTION.FLIP:
      updateState = state.data.map((card) =>
        card.id === action.payload.id ? { ...card, isFlipped: false } : card
      );
      return {
        ...state,
        data: [...updateState],
        answers:
          state.answers.length === 0 ||
          state.answers[0].id !== action.payload.id
            ? [
                ...state.answers,
                state.answers.length < 2 ? action.payload : "",
              ].filter((answer) => answer !== "")
            : [...state.answers],
      };
    case REDUCER_ACTION.VALIDATE:
      if (action.payload.at(0).alt === action.payload.at(1).alt) {
        return {
          ...state,
          answers: [],
          turns: state.turns + 1,
          correctAnswers: [
            ...state.correctAnswers,
            action.payload.at(0),
            action.payload.at(1),
          ],
        };
      } else {
        updateState = state.data.map((card) => {
          const isCorrect = state.correctAnswers.some((correct) => {
            return card.id === correct.id;
          });
          return { ...card, isFlipped: !isCorrect };
        });
        return {
          ...state,
          answers: [],
          turns: state.turns + 1,
          data: [...updateState],
        };
      }
    case REDUCER_ACTION.GAME_OVER:
      if (state.highscore === null) {
        localStorage.setItem("highscore", JSON.stringify(state.turns));
      } else if (action.payload.turns < action.payload.highscore) {
        localStorage.setItem("highscore", JSON.stringify(action.payload.turns));
      } else if (action.payload.turns > action.payload.highscore) {
        localStorage.setItem(
          "highscore",
          JSON.stringify(action.payload.highscore)
        );
      }
      return {
        ...state,
        finished: true,
        correctAnswers: [],
        highscore: localStorage.getItem("highscore"),
      };
    case REDUCER_ACTION.RETAKE:
      return {
        ...initialState,
        data: action.payload,
        highscore: state.highscore,
      };
    default:
      return state;
  }
}

/*
/////////////////////////////////////[Game Logic]
1. If there's 1 card is click. it'll maintain the front side as long there's no second answer
   a. Cards will have two sides, back and front

   b. How to flip cards, from front to back and vice versa?
      - React-Card-Flip Library

   c. When click, the is flip will become true and will show the front of the card, how'd i do that?
      - using the dispatch with the type of REDUCER_ACTION.FLIP, it sends the id of the card that i click
        using the payload, and update the state where if an object has the same id as the ones that
        I send through payload, then negate its value based on its previous value

2. If we click two cards and they turn out to be the same, then keep it open for both of
   the cards.
   a. That means my state must have a way to store 2 answer :
     - When click, store that item in the answer array   

   b. Also, i must compare the first 2 answer
     - If both of them has the same alt then, keep both of them open, if not close both of em
     - How do i only close the two selected not the same card, while maintaining the correct
       answer for the other card, answer : create an array containing only the correct answers
       and then check the state.data, if it contains in the correct answer, then show the frontface
       of the card only

4. On every two selected card, whether it's the same or not, the turns will increment
5. On each time the game is started, the cards will be shuffle

*/

import "./App.css";
function App() {
  const [
    { turns, data, answers, correctAnswers, finished, highscore },
    dispatch,
  ] = useReducer(reducer, initialState);
  if (answers.length === 2) {
    setTimeout(() => {
      dispatch({ type: REDUCER_ACTION.VALIDATE, payload: answers });
    }, 500);
  }

  // If all cards is opened
  if (correctAnswers.length === data.length) {
    dispatch({
      type: REDUCER_ACTION.GAME_OVER,
      payload: { turns, highscore: Number(JSON.parse(highscore)) },
    });
  }
  useEffect(() => {
    const shuffleData = [...data];
    shuffleArray(shuffleData);
    dispatch({ type: REDUCER_ACTION.SHUFFLE, payload: shuffleData });
  }, []);

  return (
    <div className=" text-[#385b8cff] h-[100vh] flex flex-col">
      <h1 className="text-[32px] text-center font-bold">
        Genshin Waifu Memorize
      </h1>
      <div>
        <div className="xl:w-[33vw] md:w-[70vw] w-full grid grid-cols-4 gap-4 mx-auto mt-[24px] p-4">
          {data.map((waifu) => (
            <Card
              key={waifu.id}
              waifu={waifu}
              dispatch={dispatch}
              REDUCER_ACTION={REDUCER_ACTION}
            />
          ))}
        </div>
        <p className="text-[20px] text-center mb-[24px] font-black">
          Turns: {turns}
        </p>
      </div>

      {/* IF GAME IS FINISHED */}
      <div
        className={`absolute grid w-full h-full bg-opacity-10 place-content-center scale-0 ${
          finished && "scale-100"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex shadow-xl flex-col items-center p-8 bg-[#f4f4f4] w-max h-max rounded-xl">
          <img src={eulaChibi} className="w-[75%]" />
          <p className="text-[18px] w-full text-[#1c1c1c] text-center p-4">
            <strong>Nice work</strong>
            <br></br>
            You did it in {turns} turn :D<br></br>
            Highscore : {JSON.parse(highscore)}
          </p>
          <button
            className="p-4 mx-auto text-2xl text-center bg-[#1c1c1c] text-white mt-[24px] rounded-full"
            onClick={() => {
              shuffleArray(data);
              const newData = data.map((card) =>
                card.isFlipped === false
                  ? { ...card, isFlipped: true }
                  : { ...card, isFlipped: false }
              );
              dispatch({ type: REDUCER_ACTION.RETAKE, payload: newData });
            }}
          >
            Restart game?
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
