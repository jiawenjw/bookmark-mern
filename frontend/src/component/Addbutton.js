import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Addbutton = ({
  folders,
  tags,
  dropdown_list,
  add_task,
  addbutton_submit,
  showDropdown,
  handle_hidedropdown,
  toggle_showdropdown,
}) => {
  const [page_url, setPage_url] = useState("");
  const [folder, setFolder] = useState("");
  const [tag, setTag] = useState([]);

  let menuRef = useRef();

  const refListener = (event) => {
    if (!menuRef.current.contains(event.target)) {
      handle_hidedropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", refListener);

    return () => {
      document.removeEventListener("mousedown", refListener);
    };
  }, [showDropdown]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await add_task(page_url, folder, tag);

    // wait until the task has been added to clear the "page_url"
    setPage_url("");
    setFolder("");
    setTag([]);
    // }
  };

  return (
    <div ref={menuRef} className="addbutton">
      <div className="star_button" onClick={() => toggle_showdropdown()}>
        <FontAwesomeIcon icon="star" className="link_icons" />
      </div>
      {showDropdown && (
        <form className="dropdown_menu" onSubmit={onSubmit}>
          <div className="form_control">
            <label>URL</label>
            <input
              type="text"
              value={page_url}
              onChange={(e) => {
                setPage_url(e.target.value);
              }}
              placeholder="enter page url"
              className={addbutton_submit ? "inactive_input" : ""}
            />
          </div>
          <div className="form_control">
            <label>Folder</label>
            <select
              onChange={(e) => {
                setFolder(e.target.value);
              }}
            >
              <option value="0" disabled selected hidden>
                Please select folder
              </option>
              {folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form_control">
            <label>Tag</label>

            <select
              onChange={(e) => {
                setTag(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                );
              }}
              multiple
            >
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="submit"
            value="Save Bookmark"
            className={`button_control ${
              addbutton_submit && "inactive_button"
            }`}
          />
        </form>
      )}
    </div>
  );
};

export default Addbutton;
