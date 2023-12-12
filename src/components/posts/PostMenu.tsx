import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function PostMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal strokeWidth={1} className="h-5 w-5 cursor-pointer rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>bookmark</DropdownMenuItem>
        <DropdownMenuItem>copy link</DropdownMenuItem>
        <DropdownMenuItem>raw</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="dark:text-red-400 dark:focus:bg-red-400/10 dark:focus:text-red-400 ">
          remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
