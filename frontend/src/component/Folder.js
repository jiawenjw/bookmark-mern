import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

const Folder = ({ folder, folder_bookmark, update_folder, onDeletefolder }) => {
  const [folderdropdown, setFolderdropdown] = useState(false);
  const [edit_folder_toggle, setEdit_folder_toggle] = useState(false);
  const [folder_name, setFolder_name] = useState("");

  let menuRef = useRef();

  const editFolderListener = (event) => {
    if (!menuRef.current.contains(event.target)) {
      setEdit_folder_toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", editFolderListener);
    return () => {
      document.removeEventListener("mousedown", editFolderListener);
    };
  }, [edit_folder_toggle]);

  const toggle_folderdropdown = () => {
    setFolderdropdown(!folderdropdown);
  };

  const edit_folder = () => {
    setFolderdropdown(false);
    setEdit_folder_toggle(true);
  };

  const delete_folder = () => {
    onDeletefolder(folder._id);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await update_folder(folder._id, folder_name);
    setEdit_folder_toggle(false);
  };

  return (
    <div className="row_wrap" ref={menuRef}>
      <div className="row_control">
        {edit_folder_toggle ? (
          <form className="row_name_sub" onSubmit={onSubmit}>
            <input
              type="text"
              defaultValue={folder.name}
              onChange={(e) => {
                setFolder_name(e.target.value);
              }}
              className="new_input"
            />
          </form>
        ) : (
          <div
            className="row_name_sub"
            onClick={() => folder_bookmark(folder._id)}
          >
            <FontAwesomeIcon icon={["far", "folder"]} className="decor_icons" />
            <div className="folder_name">{folder.name}</div>
          </div>
        )}
        <div className="icon_right" onClick={toggle_folderdropdown}>
          <div className="link_control_sub">
            <FontAwesomeIcon
              icon={["fas", "ellipsis-h"]}
              className="link_icons"
            />
          </div>
        </div>
        {folderdropdown ? (
          <div className="folderDropdown">
            <ul>
              <li onClick={edit_folder}>Edit</li>
              <li onClick={delete_folder}>Delete</li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Folder;
