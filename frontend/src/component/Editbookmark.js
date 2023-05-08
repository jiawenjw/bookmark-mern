import { useState, useEffect } from "react";

const Editbookmark = ({
  edit_id,
  bookmark_concerned,
  update_bookmark,
  tags,
  folders,
  close_edit,
}) => {
  useEffect(() => {
    setBookmark_title(bookmark_concerned.title);
    setBookmark_description(bookmark_concerned.description);
    setBookmark_folder(bookmark_concerned.folder);
    setBookmark_tags(bookmark_concerned.tag);
  }, [edit_id]);

  const [bookmark_title, setBookmark_title] = useState(
    bookmark_concerned.title
  );
  const [bookmark_description, setBookmark_description] = useState(
    bookmark_concerned.description
  );
  const [bookmark_folder, setBookmark_folder] = useState(
    bookmark_concerned.folder
  );

  const [bookmark_tags, setBookmark_tags] = useState(bookmark_concerned.tag);
  const onSubmit = (e) => {
    e.preventDefault();
    update_bookmark(
      bookmark_title,
      bookmark_description,
      bookmark_folder,
      bookmark_tags
    );
  };

  return (
    <div className="edit_form">
      <div className="xmark" onClick={close_edit}>
        ✕
      </div>
      <p>- Edit Bookmark -</p>
      <form className="row_name_sub" onSubmit={onSubmit}>
        <div className="form_control">
          <label>Folder</label>
          <select
            value={bookmark_folder}
            onChange={(e) => {
              setBookmark_folder(e.target.value);
            }}
          >
            <option value="" disabled selected hidden>
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
            value={bookmark_tags}
            onChange={(e) => {
              setBookmark_tags(
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
        <div className="form_control">
          <label>Bookmark Title</label>
          <input
            type="text"
            value={bookmark_title}
            onChange={(e) => {
              setBookmark_title(e.target.value);
            }}
            className="new_input"
          />
        </div>
        <div className="form_control">
          <label>Bookmark Description</label>
          <input
            type="text"
            value={bookmark_description}
            onChange={(e) => {
              setBookmark_description(e.target.value);
            }}
            className="new_input"
          />
        </div>

        <input
          type="submit"
          value="Update Bookmark"
          className="button_control"
        />
      </form>
    </div>
  );
};

export default Editbookmark;
