import { Event, getEventHash, getSignature } from "nostr-tools";
import { shortHash } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import useEventStore from "@/stores/eventStore";
import usePostStore from "@/stores/postStore";
import useStore from "@/stores/useStore";
import useLoginStore from "@/stores/loginStore";
import { useRouter } from "next/navigation";
import useReplyStore from "@/stores/replyStore";

type Props = {
  post: Event;
  open: boolean;
  setOpen: (show: boolean) => void;
  children: React.ReactNode;
};

const ReplyPopover = ({ post, open, setOpen, children }: Props) => {
  const loginStore = useStore(useLoginStore, (state) => state);

  const { reply, setReply, clearReply } = useReplyStore();
  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();
  const { clearAllEvents } = useEventStore();

  const router = useRouter();

  if (!loginStore) {
    return <div className="min-h-screen">login first</div>;
  }

  const validateBeforePublish = () => {
    if (reply.text === "") {
      alert("content cannot be empty");
      return false;
    }

    return true;
  };

  const handleSendReply = async (e: any) => {
    e.preventDefault();

    if (!validateBeforePublish()) {
      return;
    }

    if (!loginStore?.userKeyPair) {
      alert("login first");
      return;
    }

    const publicKey = loginStore.userKeyPair.publicKey || "";
    const secretKey = loginStore.userKeyPair.secretKey || "";

    const text = reply.text;
    const image = reply.image;

    const replyTags = [];

    // TODO: add every etag user is replying to

    if (image) {
      replyTags.push(["image", image]);
    }

    let newsEvent: Event = {
      id: "",
      sig: "",
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: replyTags,
      content: text,
      pubkey: publicKey,
    };

    newsEvent.id = getEventHash(newsEvent);
    if (secretKey) {
      newsEvent.sig = getSignature(newsEvent, secretKey);
    } else {
      newsEvent = await window.nostr.signEvent(newsEvent);
    }

    const onNewsEventSeen = (event: Event) => {
      console.log("news event", event);
      // TODO: append the new event to the reply cache
      // clear reply text and image
    };

    // publishPool(writeRelays, newsEvent, onNewsEventSeen);
  };

  return (
    <div className="relative">
      {children}
      {open && (
        <div className="fixed right-0 top-20 mt-12 rounded-md border border-zinc-700 bg-zinc-800 p-4 shadow-lg">
          <div className="flex flex-col items-center justify-between text-white">
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="comment"
                  className="block text-sm font-bold leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  {`reply to ${shortHash(post.id)}`}
                </label>
                <button
                  className="rounded-md text-sm font-medium shadow-sm hover:bg-zinc-700"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon
                    className="h-6 w-6 text-zinc-900 dark:text-zinc-100"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="comment"
                  id="comment"
                  className="block w-80 rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />

                <div className="max-w-lg pt-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                  >
                    image url
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="image"
                      id="image"
                      className="block w-80 rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm sm:leading-6"
                      aria-describedby="image url"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-end pt-4">
              <button
                className="rounded-lg border border-zinc-300 px-2 py-1 font-mono text-zinc-600 shadow-lg shadow-black/5 hover:text-zinc-500 dark:border-zinc-600 dark:text-zinc-200 dark:hover:text-zinc-100"
                onClick={() => setOpen(false)}
              >
                post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyPopover;
