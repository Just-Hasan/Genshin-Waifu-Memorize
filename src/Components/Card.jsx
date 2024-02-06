import PropTypes from "prop-types";
import ReactCardFlip from "react-card-flip";
import "../App.css";
export default function Card({ waifu, dispatch, REDUCER_ACTION }) {
  const { frontSrc, backSrc, picAlt, isFlipped } = waifu;

  function flipCard() {
    dispatch({ type: REDUCER_ACTION.FLIP, payload: waifu });
  }
  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front */}
      <div
        className="overflow-hidden aspect-auto rounded-2xl "
        onClick={flipCard}
      >
        <img src={frontSrc} alt={picAlt} className="w-full" />
      </div>
      {/* Back */}
      <div
        className="overflow-hidden aspect-auto rounded-2xl "
        onClick={flipCard}
      >
        <img src={backSrc} alt={picAlt} className="w-full" />
      </div>
    </ReactCardFlip>
  );
}

Card.propTypes = {
  waifu: PropTypes.object.isRequired,
  REDUCER_ACTION: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
