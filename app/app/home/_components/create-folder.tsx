import { IFolderProps } from '@/lib/db/DBFolders';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface FolderProps {
  folder: IFolderProps | undefined;
  updateFolderName: (newName: string) => void;
}

const FolderComponent = (props: FolderProps): JSX.Element => {
  const [newName, setNewName] = useState(props.folder?.NAME);

  useEffect(() => {
    setNewName(props.folder?.NAME)
  }, [props.folder?.NAME])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const tryUpdateFolderName = () => {
    if(props.folder?.NAME !== newName) {
      props.updateFolderName(newName || "")
    }
  };

  return (
    <div className="darken-background">
      <div className="manage-access">
        <h1>Change the name of &quot;{props.folder?.NAME}&quot;</h1>
        <div className="share-with">
          <input type="text" value={newName} onChange={handleInputChange} />
					<IconButton style={{ marginLeft: "0.5rem" }} onClick={tryUpdateFolderName}>
						<SendIcon htmlColor="#121212" />
					</IconButton>
        </div>
      </div>
    </div>
  );
};

export default FolderComponent;