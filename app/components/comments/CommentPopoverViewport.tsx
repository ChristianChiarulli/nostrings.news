import React, { useState, useRef } from "react";
import { Event } from "nostr-tools";

type Props = {
  post: Event;
  open: boolean;
  setOpen: (show: boolean) => void;
};

const CommentPopover = ({ post, open, setOpen }: Props) => {
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <button onClick={toggleOpen} className="...">
        Toggle Popover
      </button>
      {open && (
        <div
          className="fixed top-0 right-0 mt-12 bg-zinc-800 border border-gray-300 rounded-md shadow-lg p-4"
        >
          <div className="flex items-center justify-between text-white">
            <button
              className="rounded-md text-sm font-medium shadow-sm hover:bg-zinc-700 p-2"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button
              className="rounded-md text-sm font-medium shadow-sm hover:bg-zinc-700 p-2"
              onClick={() => setOpen(false)}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPopover;

