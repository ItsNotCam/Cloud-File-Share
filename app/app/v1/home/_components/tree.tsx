"use client"

import { useState } from "react";

interface DirectoryProps {
  type: string,
  name: string,
  uuid: string,
  items: DirectoryProps[]
}

export const TreeRoot = (props: {files: DirectoryProps[]}): JSX.Element => {
  const {files} = props
  return (<>
    {files.map((file, idx) => <Tree item={file} indent={0} key={file.uuid}/>)}
  </>)
}

const Tree = (props: {item: DirectoryProps, indent: number}): JSX.Element => {
  const {indent} = props
  const {type, name, uuid, items} = props.item

  const [isDroppedDown, setIsDroppedDown] = useState<boolean>(false)

  let indentStr: JSX.Element = <></>
  for(let i: number = 0; i < indent; i++) {
    indentStr = <>
      {indentStr}
      <div style={{height: "50px", width: "2px", backgroundColor: "red", marginRight: "2rem"}} key={i+900}/>
    </>
  }

  if(type === "file") {
    return (
      <div style={{display: "flex", flexDirection: "row"}} >
        {indentStr}
        <h1 style={{margin: 0}}>{name}</h1>
      </div>
    )
  } else {
    return (
      <div> 
        <div style={{display: "flex", flexDirection: "row", cursor: "pointer"}} onClick={() => setIsDroppedDown(!isDroppedDown)}>
          {indentStr}
          <h1 style={{margin: 0}}>
            <span style={{fontSize: "2rem"}}>
              {type === "directory" && isDroppedDown ? "v" : ">"}
            </span> 
            <span style={{color: "blue"}}>
              {` ${name}`}
            </span>
          </h1>      
        </div>
        <div style={{display: isDroppedDown ? "block" : "none"}}>
          {items.map((item, idx) => <Tree item={item} indent={indent+1} key={item.uuid}/>)}
        </div>
    </div>
    )
  }
}