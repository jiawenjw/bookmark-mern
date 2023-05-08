import React from "react";
import { useState } from "react";
import Bookmark from "./Bookmark";

const Bookmarks = ({
  bookmarks,
  loader,
  onDeletebookmark,
  tags,
  tag_filter,
  edit_bookmark,
}) => {
  const reversed_bookmarks = [...bookmarks].reverse();

  const rTags = Object.assign(
    {},
    ...tags.map((tag) => ({ [tag._id]: tag.name }))
  );

  const [filtered_tags, setFiltered_tags] = useState(tags);

  return (
    <>
      {loader ? (
        <div className="card">
          <div className="normal_card">
            <div className="preview_image skeleton"></div>
            <div className="preview_text">
              <div className="bookmark_title">
                <div className="skeleton skeleton_text"></div>
                <div className="skeleton skeleton_text"></div>
              </div>
              <div className="preview_description_wrap">
                <div className="preview_description">
                  <div className="skeleton skeleton_text"></div>
                  <div className="skeleton skeleton_text"></div>
                  <div className="skeleton skeleton_text"></div>
                </div>
              </div>
              <div className="text_footnote">
                <div className="skeleton skeleton_footnote"></div>
                <div className="skeleton skeleton_footnote"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {reversed_bookmarks.map((bookmark) => (
        <Bookmark
          key={bookmark._id}
          bookmark={bookmark}
          tag_filter={tag_filter}
          rTags={rTags}
          onDeletebookmark={onDeletebookmark}
          edit_bookmark={edit_bookmark}
        />
      ))}
    </>
  );
};

export default Bookmarks;
