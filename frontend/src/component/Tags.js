import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tag from "./Tag";
import { useState } from "react";

const Tags = ({
  tags,
  tag_bookmark,
  create_tag,
  show_new_tag,
  update_tag,
  onDeletetag,
}) => {
  const [new_tag, setNew_tag] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    create_tag(new_tag);
    setNew_tag("");
  };
  return (
    <div className="tags">
      <ul>
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            tag={tag}
            tag_bookmark={tag_bookmark}
            update_tag={update_tag}
            onDeletetag={onDeletetag}
          />
        ))}

        {show_new_tag ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={new_tag}
              onChange={(e) => {
                setNew_tag(e.target.value);
              }}
              placeholder="enter tag name"
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

export default Tags;
