import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Folder from "./Folder";
import { useState } from "react";

const Folders = ({
  folders,
  folder_bookmark,
  create_folder,
  show_new_folder,
  update_folder,
  onDeletefolder,
}) => {
  const [new_folder, setNew_folder] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    create_folder(new_folder);
    setNew_folder("");
  };
  return (
    <div className="folders">
      <ul>
        {folders.map((folder) => (
          <Folder
            key={folder._id}
            folder={folder}
            folder_bookmark={folder_bookmark}
            update_folder={update_folder}
            onDeletefolder={onDeletefolder}
          />
        ))}
        {show_new_folder ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={new_folder}
              onChange={(e) => {
                setNew_folder(e.target.value);
              }}
              placeholder="enter folder name"
              className="new_input"
            />
          </form>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default Folders;

// row-wrap的目的是选中这一行，添加hover效果
// row-control目的是display flex和space-between，把左边和右边的icon分开
// row-name目的是把左图标和名字放同一行，且调整位置（margin、padding）

// icon-right目的是选择右边,添加hover效果
// link-control-sub目的是调整位置（右边icon)
