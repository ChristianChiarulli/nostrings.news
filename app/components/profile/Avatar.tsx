import React, { useState, useEffect } from "react";
import { classNames } from "@/lib/utils";

interface AvatarProps {
  pubkey: string;
  picture: string;
  className?: string;
}

const Avatar = ({ pubkey, picture, className = "" }: AvatarProps) => {
  const BOT_AVATAR_ENDPOINT = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${pubkey}`;
  const [imageSrc, setImageSrc] = useState(picture || BOT_AVATAR_ENDPOINT);

  useEffect(() => {
    // Only update the image source if the picture prop is truthy
    if (picture) {
      setImageSrc(picture);
    }
  }, [picture]);

  const handleError = () => {
    setImageSrc(BOT_AVATAR_ENDPOINT);
  };

  return (
    <img
      src={imageSrc}
      alt="avatar"
      draggable="false"
      onError={handleError}
      className={classNames(
        "aspect-square select-none rounded-full object-cover",
        className
      )}
    />
  );
};

export default Avatar;

