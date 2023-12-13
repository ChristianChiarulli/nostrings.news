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
import { TAGS } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
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
  url: z
    .string()
    .url({ message: "Invalid URL format." })
    .regex(/^https:\/\//, { message: "url must start with https." }),
  tag: z.string().min(1, { message: "you must select a tag" }),
});

export function LinkForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      tag: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>url</FormLabel>
              <FormControl>
                <Input placeholder="https..." {...field} />
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
                <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
