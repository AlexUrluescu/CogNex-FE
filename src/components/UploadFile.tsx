import React from "react";

const UploadFile = ({ setFile }: any) => {
  const handleChangeFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  return <input onChange={handleChangeFile} type="file" accept=".pdf" />;
};

export default UploadFile;
