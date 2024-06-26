"use client";

import api from "@/app/api/instance";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { EditContactReponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
});

function AddPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const { data } = await api.post<EditContactReponse>("/contact", values);

      toast("Contact Added Successfully!", {
        description: `${data.contact.name} has been added to your phone book`,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });

      form.reset();
    } catch (e) {
      toast("An Error Occured!", {
        description: `Failed to save the contact`,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-screen-md px-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-0 mx-auto max-w-lg space-y-3 overflow-hidden rounded-lg bg-slate-50 p-5 shadow-md dark:bg-slate-900"
        >
          <Logo className="absolute -right-10 -top-10 -z-10 h-64 w-64 fill-slate-100 dark:fill-slate-800" />

          <h2 className="text-center text-2xl font-bold">Add a New Contact</h2>
          <hr />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Marcille"
                    className="placeholder:text-slate-300 dark:placeholder:text-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+62-xxx-xxxx-xxxx"
                    className="placeholder:text-slate-300 dark:placeholder:text-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 pt-5">
            <Button
              type="button"
              size={"sm"}
              disabled={isLoading}
              variant={"secondary"}
              className="w-full"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isLoading}
              className="w-full bg-yellow-500 font-bold hover:bg-yellow-600"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}

export default AddPage;
