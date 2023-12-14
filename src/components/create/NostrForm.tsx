"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import useAuth from "~/hooks/useAuth";
import { TAGS } from "~/lib/constants";
import { cn } from "~/lib/utils";
import usePublishEvent from "~/nostr-query/client/hooks/usePublishEvent";
import { type UsePublishEventParams } from "~/nostr-query/types";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { getEventHash, nip19, type Event } from "nostr-tools";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z.object({
  title: z
    .string()
    .min(4, { message: "title must be at least 4 characters." })
    .max(80, { message: "title must be under 80 characters." }),
  nostrEvent: z.string().regex(/^(naddr|nevent|note)/, {
    message: "event must start with 'naddr', 'nevent', or 'note'.",
  }),
  tag: z.string().min(1, { message: "you must select a tag" }),
});

export function NostrForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // TODO: hold onto form values on page change, clear on submit
    // probably a good use case for jotai
    defaultValues: {
      title: "",
      nostrEvent: "",
      tag: "",
    },
  });
  const { pubRelays } = useRelayStore();
  const { newPostEvents, setNewPostEvents } = useEventStore();
  const { pubkey } = useAuth();

  const params: UsePublishEventParams = {
    relays: pubRelays,
  };
  const { publishEvent, status } = usePublishEvent(params);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!pubkey) {
      // TODO: show error toast
      return;
    }

    const { title, nostrEvent, tag } = values;

    const decodedEvent = nip19.decode(nostrEvent);

    if (!decodedEvent) {
      return;
    }

    const tags = [
      ["title", title],
      ["t", tag],
      ["n", nostrEvent]
    ];

    if (decodedEvent.type === "naddr") {
      const data = decodedEvent.data;
      const { kind, pubkey, identifier, relays } = data;
      if (relays?.[0]) {
        tags.push(["a", `${kind}:${pubkey}:${identifier}`, relays[0]]);
      } else {
        tags.push(["a", `${kind}:${pubkey}:${identifier}`]);
      }
      tags.push(["k", `${kind}`]);
    }

    if (decodedEvent.type === "nevent") {
      const data = decodedEvent.data;
      const { kind, id, relays } = data;
      if (relays?.[0]) {
        tags.push(["e", `${id}`, relays[0]]);
      } else {
        tags.push(["e", `${id}`]);
      }
      tags.push(["k", `${kind}`]);
    }

    if (decodedEvent.type === "note") {
      const data = decodedEvent.data;
      tags.push(["e", data]);
      tags.push(["k", "1"]);
    }

    let event: Event = {
      kind: 1070,
      tags: tags,
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      pubkey: pubkey,
      id: "",
      sig: "",
    };
    event.id = getEventHash(event);
    event = (await nostr.signEvent(event)) as Event;
    const onSeen = (event: Event) => {
      if (newPostEvents && newPostEvents.length > 0) {
        setNewPostEvents([event, ...newPostEvents]);
      }
      router.push("/");
    };

    await publishEvent(event, onSeen);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>title</FormLabel>
              <FormControl>
                <Input placeholder="80 characters max" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nostrEvent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>event</FormLabel>
              <FormControl>
                <Input placeholder="note, naddr, or nevent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>tag</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800",
                        !field.value && "text-zinc-500 dark:text-zinc-400",
                      )}
                    >
                      {field.value
                        ? TAGS.find((tag) => tag === field.value)
                        : "select tag"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
                  <Command className="dark:bg-zinc-800">
                    <CommandInput placeholder="search tags..." />
                    <CommandEmpty>no tag found.</CommandEmpty>
                    <CommandGroup className="max-h-36 overflow-y-auto">
                      {TAGS.map((tag) => (
                        <CommandItem
                          value={tag}
                          key={tag}
                          onSelect={() => {
                            form.setValue("tag", tag);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              tag === field.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {tag}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "pending" ? (
          <Button disabled>Submitting...</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
