import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

const Tag = ({ tag, tag_bookmark, update_tag, onDeletetag }) => {
  const [tagdropdown, setTagdropdown] = useState(false);
  const [edit_tag_toggle, setEdit_tag_toggle] = useState(false);
  const [tag_name, setTag_name] = useState("");

  let menuRef = useRef();

  const editTagListener = (event) => {
    if (!menuRef.current.contains(event.target)) {
      setEdit_tag_toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", editTagListener);
    return () => {
      document.removeEventListener("mousedown", editTagListener);
    };
  }, [edit_tag_toggle]);

  const toggle_tagdropdown = () => {
    setTagdropdown(!tagdropdown);
  };

  const edit_tag = () => {
    setTagdropdown(false);
    setEdit_tag_toggle(true);
  };

  const delete_tag = () => {
    onDeletetag(tag._id);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await update_tag(tag._id, tag_name);
    setEdit_tag_toggle(false);
  };

  return (
    <div className="row-wrap" ref={menuRef}>
      <div className="row_control">
        {edit_tag_toggle ? (
          <form className="row_name_sub" onSubmit={onSubmit}>
            <input
              type="text"
              defaultValue={tag.name}
              onChange={(e) => {
                setTag_name(e.target.value);
              }}
              className="new_input"
            />
          </form>
        ) : (
          <div className="row_name_sub" onClick={() => tag_bookmark(tag._id)}>
            <FontAwesomeIcon
              icon={["fas", "hashtag"]}
              className="decor_icons"
            />
            <div className="tag_name">{tag.name}</div>
          </div>
        )}
        <div className="icon_right" onClick={toggle_tagdropdown}>
          <div className="link_control_sub">
            <FontAwesomeIcon
              icon={["fas", "ellipsis-h"]}
              className="link_icons"
            />
          </div>
        </div>
        {tagdropdown ? (
          <div className="tagDropdown">
            <ul>
              <li onClick={edit_tag}>Edit</li>
              <li onClick={delete_tag}>Delete</li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Tag;
