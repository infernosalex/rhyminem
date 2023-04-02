import style from "./PromptInput.module.scss";
import { BsFillSendFill } from "react-icons/bs";

export default function PromptInput(props) {
  return (
    <>
      <input
        type="text"
        className={`${style.promptInput}`}
        placeholder="Poem about bananas in the ice age..."
        value={props.prompt}
        onChange={(e) => props.setPrompt(e.target.value)}
      />
      <button
        type="submit"
        style={{
          display: "inline-flex",
          textAlign: "center",
          height: "100%",
        }}
      >
        <BsFillSendFill />
      </button>
    </>
  );
}
