"use client";
import axios from "axios";

export default function DeleteButton(props: { ID: string; ServerSocket: string; }): JSX.Element {
  const deleteFile = () => {
    axios.delete(`http://${props.ServerSocket}/api/files/${props.ID}`)
      .then(_ => window.location.reload())
  };

  return (
    <button onClick={deleteFile} className="btn btn-danger">Delete</button>
  );
};
