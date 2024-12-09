import React from "react";

const TagBadge = ({ tags }) => (
  <div className="d-flex flex-wrap gap-2 mb-3">
    {tags && tags.length > 0 ? (
      tags.map((tag, index) => (
        <span key={index} className="badge tag-pill">
          {tag.name}
        </span>
      ))
    ) : (
      <span className="text-muted">Tag tidak tersedia</span>
    )}
  </div>
);

export default TagBadge;
