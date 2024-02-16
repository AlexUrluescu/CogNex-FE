import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ButtonCustom = ({
  textName,
  eventFunction,
  classStyle,
  typeButton,
}: any) => {
  return (
    <button type={typeButton} className={classStyle}>
      <FontAwesomeIcon style={{ fontSize: "30px" }} icon={faPaperPlane} />
    </button>
  );
};

export default ButtonCustom;
