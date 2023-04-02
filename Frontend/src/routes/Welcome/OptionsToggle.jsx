import style from "./OptionsToggle.module.scss";
import { BsCaretDownFill } from "react-icons/bs";
import { useState } from "react";
import OptionMenu from "./OptionMenu";
import { AnimatePresence } from "framer-motion";

export default function OptionsToggle(props) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={style.options}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setShowOptions(!showOptions)}
      >
        More options <BsCaretDownFill className={showOptions ? style.active : ""} />
      </button>
      <AnimatePresence>
        {showOptions && <OptionMenu options={props.options} setOptions={props.setOptions}/>}
      </AnimatePresence>
    </div>
  );
}
