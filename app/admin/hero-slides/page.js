"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import {
  HiMiniXMark,
  HiOutlineChevronLeft,
  HiPencilSquare,
} from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import {
  createHeroSlide,
  getHeroSlides,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/app/_lib/heroSlide-service";
import { useEffect, useState } from "react";
import Image from "next/image";
import { heroSlideSchema } from "@/app/_utils/validationSchema";
import Spinner from "@/app/_components/Spinner";

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(heroSlideSchema),
    mode: "onTouched",
    context: { editingId },
  });

  useEffect(() => {
    async function fetchSlides() {
      setIsLoading(true);
      try {
        const res = await getHeroSlides();

        setSlides(res.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlides();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("order", data.order);
      if (data.link) formData.append("link", data.link);
      if (data.image?.[0]) formData.append("image", data.image[0]);

      if (editingId) {
        try {
          delete data.image;
          await updateHeroSlide(editingId, data);
          toast.success("Slide updated");
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        await createHeroSlide(formData);
        toast.success("Slide created");
      }

      const res = await getHeroSlides();
      setSlides(res.data.data);
      reset();
      setEditingId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide._id);
    setValue("title", slide.title);
    setValue("link", slide.link);
    setValue("order", slide.order);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHeroSlide(id);
      toast.success("Slide deleted");
      const res = await getHeroSlides();
      setSlides(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Hero Slides</h1>
      </div>
      {slides.length <= 10 && editingId && (
        <Button
          onClick={() => setEditingId(null)}
          variant="primary"
          configStyles="ml-auto "
        >
          + Add Slides
        </Button>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <div className="space-y-6">
            {slides.length <= 10 && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl border border-zinc-700 bg-zinc-900 p-6"
              >
                <h2 className="text-lg font-medium text-zinc-200">
                  {editingId ? "Update Slide" : "Create New Slide"}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="Slide Title"
                      className="input"
                    />
                    <p className="text-sm text-red-500">
                      {errors.title?.message}
                    </p>
                  </div>

                  {/* Link */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">
                      Link (optional)
                    </label>
                    <input
                      type="text"
                      {...register("link")}
                      placeholder="/some-link"
                      className="input"
                    />
                  </div>

                  {/* Order */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">Order</label>
                    <input
                      type="number"
                      {...register("order")}
                      placeholder="1 - 10"
                      className="input"
                    />
                    <p className="text-sm text-red-500">
                      {errors.order?.message}
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div className="col-span-full flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">Image</label>
                    {!editingId && (
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="w-fit cursor-pointer rounded-md bg-zinc-800 text-zinc-400 file:cursor-pointer file:rounded file:bg-blue-600 file:px-3 file:py-1 file:font-semibold file:text-white"
                      />
                    )}
                    <p className="text-sm text-red-500">
                      {errors.image?.message}
                    </p>

                    {editingId && (
                      <div className="relative mt-3 h-25 w-45 overflow-hidden rounded border border-zinc-700">
                        <Image
                          src={
                            slides.find((s) => s._id === editingId)?.image || ""
                          }
                          alt="Current Slide"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    configStyles="ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingId
                        ? "Updating..."
                        : "Creating..."
                      : editingId
                        ? "Update Slide"
                        : "Create Slide"}
                  </Button>
                </div>
              </form>
            )}
            {slides.map((slide) => (
              <div
                key={slide._id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-medium text-zinc-200">{slide.title}</h3>
                  <p className="text-sm text-zinc-400">Order: {slide.order}</p>
                  {slide.link && (
                    <p className="text-sm text-zinc-500">Link: {slide.link}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="edit" onClick={() => handleEdit(slide)}>
                    <HiPencilSquare size={22} />
                  </Button>
                  {/* <Button variant="close" onClick={() => handleDelete(slide._id)}>
                  Delete
                </Button> */}
                  <Button
                    variant="close"
                    onClick={() => handleDelete(slide._id)}
                  >
                    <HiMiniXMark className="" size={20} strokeWidth={1} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ContainerBox>
      )}
    </div>
  );
}
