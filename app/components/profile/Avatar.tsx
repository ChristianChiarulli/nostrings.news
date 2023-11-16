import { classNames } from "@/lib/utils";

interface AvatarProps {
  pubkey: string;
  picture: string;
  className?: string;
}

const Avatar = ({ pubkey, picture, className = "" }: AvatarProps) => {
  const BOT_AVATAR_ENDPOINT = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${pubkey}`;

  return (
    <img
      src={picture || BOT_AVATAR_ENDPOINT}
      alt={"avatar"}
      draggable="false"
      className={classNames(
        "aspect-square select-none rounded-full object-cover",
        className,
      )}
    />
  );
};

export default Avatar;
