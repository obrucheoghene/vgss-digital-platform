import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const FormValues = z.object({
  graduateFirstname: z
    .string()
    .trim()
    .min(1, "Firstname is required")
    .min(2, "Firstname must be at least 3 characters long"),
  graduateSurname: z
    .string()
    .trim()
    .min(1, "Surname is required")
    .min(2, "Surname must be at least 3 characters long"),
  graduateGender: z.enum(["FEMALE", "MALE"], "Gender must be MALE or FEMALE"),
  graduatePhoneNumber: z.string().trim().min(1, "Phone number is required"),
  nameOfUniversity: z.string().trim().min(1, "University is required"),
  courseOfStudy: z.string().trim().min(1, "Course of study is required"),
  graduationYear: z.string().trim().min(1, "Year of graduation is required"),
  chapter: z.string().trim().min(1, "Chapter is required"),
  nameOfZonalPastor: z.string().trim().min(1, "Zonal Pastor name is required"),
  nameOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor name is required"),
  phoneNumberOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
  emailOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
  kingschatIDOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
});

const UploadGraduateForm = () => {
  type FormType = z.infer<typeof FormValues>;
  const form = useForm<FormType>({
    resolver: zodResolver(FormValues),
    defaultValues: {
      graduateFirstname: "",
      graduateSurname: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Graduate Record</CardTitle>
        <CardDescription>Complete the form </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-3 flex-col"
          >
            <div className=" grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              {/* <div cl> */}
              <FormField
                control={form.control}
                name="graduateFirstname"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>First name</FormLabel>
                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduate firstname"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduateSurname"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Surname</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduate surname"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduateSurname"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Surname</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Graduate gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">MALE</SelectItem>
                        <SelectItem value="FEMALE">FEMALE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduatePhoneNumber"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Phone number</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduate phone number"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfUniversity"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>University</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduate university"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseOfStudy"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Course of Study</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduate course of Study"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Graduation Year</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduation Year"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>BLW Chapter</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Chapter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Chapter 1">Chapter 1</SelectItem>
                        <SelectItem value="Chapter 2">Chapter 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameOfZonalPastor"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Zonal Pastor Name</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Zonal Pastor Name"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameOfChapterPastor"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Chapter Pastor Name</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Graduation Year"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumberOfChapterPastor"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Chapter Pastor Phone Number</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Chapter Pastor phone number"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingschatIDOfChapterPastor"
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Chapter Pastor Kingschat Id</FormLabel>

                    <FormControl className="">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Chapter Pastor Kingschat Id"
                        // onKeyUp={handleKeyPress}
                        className="w-full  px-4 py-3 order text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-1/2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadGraduateForm;
