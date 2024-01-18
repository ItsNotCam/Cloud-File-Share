"use client";
import axios from "axios";

export const DeleteButton = (props: { ID: string; ServerSocket: string; }): JSX.Element => {
  const deleteFile = () => {
    axios.delete(`http://${props.ServerSocket}/api/files/${props.ID}`);
  };

  return (
    <button onClick={deleteFile} className="btn btn-danger">Delete</button>
  );
};
