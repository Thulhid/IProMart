"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import { HiTrash } from "react-icons/hi2";
import Spinner from "@/app/_components/Spinner";
import MiniSpinner from "@/app/_components/MiniSpinner";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategorySubcategories,
  // ⬇️ NEW
  deleteCategory,
} from "@/app/_lib/category-service";
import {
  createSubcategory,
  // ⬇️ NEW
  deleteSubcategory,
} from "@/app/_lib/subcategory-service";
import Empty from "@/app/_components/Empty";
import Modal from "@/app/_components/Modal";
import ConfirmDelete from "@/app/_components/ConfirmDelete";

export default function AdminCategoriesPage() {
  // ---------- Create Category (+ batch subcats) ----------
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: "" } });

  const [subNames, setSubNames] = useState([]);
  const [subInput, setSubInput] = useState("");

  function addSubName() {
    const n = subInput.trim();
    if (!n) return;
    if (subNames.includes(n)) {
      toast("Already added");
      return;
    }
    setSubNames((s) => [...s, n]);
    setSubInput("");
  }
  function removeSubName(n) {
    setSubNames((s) => s.filter((x) => x !== n));
  }

  async function onCreateCategory(values) {
    if (!values.name?.trim()) return toast.error("Category name is required");

    try {
      // 1) create empty category
      const created = await createCategory({
        name: values.name.trim(),
        subcategories: [],
      });

      const catPayload =
        created?.data?.data || created?.data || created?.category || created;
      const categoryId = catPayload?._id || catPayload?.id;
      if (!categoryId) throw new Error("Could not read created category id");

      // 2) create subcategories → collect IDs
      const createdSubIds = [];
      for (const subName of subNames) {
        try {
          const subRes = await createSubcategory({
            category: categoryId,
            name: subName,
          });
          const subPayload =
            subRes?.data?.data || subRes?.data || subRes?.subcategory || subRes;
          const subId = subPayload?._id || subPayload?.id;
          if (subId) createdSubIds.push(subId);
        } catch {
          toast.error(`Failed to create subcategory: ${subName}`);
        }
      }

      // 3) patch category with its subcategory IDs
      if (createdSubIds.length > 0) {
        await updateCategorySubcategories(categoryId, createdSubIds);
      }

      toast.success(
        `Category "${values.name}" created${
          createdSubIds.length
            ? ` (+${createdSubIds.length} subcategories)`
            : ""
        }`,
      );
      reset({ name: "" });
      setSubNames([]);

      // refresh categories list
      await refetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to create category");
    }
  }

  // ---------- Quick subcategory form ----------
  const {
    register: rSub,
    handleSubmit: hSub,
    reset: resetSub,
    formState: { isSubmitting: submittingSub },
  } = useForm({ defaultValues: { name: "", categoryId: "" } });

  const [cats, setCats] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // ⬅️ per-item delete loading

  const catOptions = useMemo(() => {
    const raw = cats?.data?.docs || cats?.data || cats || [];
    return Array.isArray(raw) ? raw : [];
  }, [cats]);

  const refetchCategories = async () => {
    setCatsLoading(true);
    try {
      const data = await getCategories();
      setCats(data?.data?.data ?? data);
    } catch (e) {
      toast.error(e.message || "Failed to load categories");
    } finally {
      setCatsLoading(false);
    }
  };

  useEffect(() => {
    refetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreateSub(values) {
    const { name, categoryId } = values;
    if (!name?.trim() || !categoryId)
      return toast.error("Both category and subcategory name are required");

    try {
      const subRes = await createSubcategory({
        category: categoryId,
        name: name.trim(),
      });
      const subPayload =
        subRes?.data?.data || subRes?.data || subRes?.subcategory || subRes;
      const subId = subPayload?._id || subPayload?.id;
      if (!subId) throw new Error("Could not read created subcategory id");

      const cat = await getCategoryById(categoryId);
      const catPayload =
        cat?.data?.data || cat?.data || cat?.category || cat || {};
      const currentSubIds = (catPayload?.subcategories || []).map(
        (s) => s?._id || s?.id || s,
      );

      const merged = Array.from(new Set([...currentSubIds, subId]));
      await updateCategorySubcategories(categoryId, merged);

      toast.success(`Subcategory "${name}" created`);
      resetSub({ name: "", categoryId });
      await refetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to create subcategory");
    }
  }

  async function handleDeleteCategory(categoryId, categoryName) {
    setDeletingId(categoryId);
    try {
      // get subcategories first (so we can delete them after category is gone)
      let subIds = [];
      try {
        const cat = await getCategoryById(categoryId);
        const subs = cat?.data?.data?.subcategories || [];
        subIds = subs.map((s) => s?._id || s?.id || s);
      } catch {
        // if we fail to read subs, still attempt to delete category
        subIds = [];
      }

      // 1) try deleting the category first — backend should block if in use
      await deleteCategory(categoryId);

      // 2) then clean up subcategories (best-effort)
      if (subIds.length > 0) {
        const results = await Promise.allSettled(
          subIds.map((sid) => deleteSubcategory(sid)),
        );
        const failed = results.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          toast.error(
            `Category deleted, but ${failed.length} subcategories failed to delete`,
          );
        }
      }

      toast.success(`Deleted category "${categoryName}"`);
      await refetchCategories();
    } catch (error) {
      // Friendly message if backend blocked due to products referencing the category
      const msg =
        error?.message?.toLowerCase().includes("in use") ||
        error?.message?.toLowerCase().includes("product")
          ? "Cannot delete: this category is in use by one or more products"
          : error?.message || "Failed to delete category";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Categories</h1>
      </div>

      {/* Body */}
      {catsLoading ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="my-15 grid gap-6 md:grid-cols-2">
            {/* Card: Create Category */}
            <form
              onSubmit={handleSubmit(onCreateCategory)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
            >
              <h2 className="mb-6 text-lg font-medium text-zinc-200">
                Create Category
              </h2>

              <div className="grid gap-6">
                <div>
                  <label className="mb-1 block text-zinc-400">
                    Category name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., mice"
                    {...register("name")}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-zinc-400">
                    Subcategories (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={subInput}
                      onChange={(e) => setSubInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSubName();
                        }
                      }}
                      placeholder="e.g., wireless"
                      className="input w-full"
                    />
                    <Button
                      buttonType="button"
                      variant="primary"
                      onClick={addSubName}
                      disabled={!subInput.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {subNames.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {subNames.map((n) => (
                        <span
                          key={n}
                          className="group inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
                        >
                          {n}
                          <button
                            type="button"
                            onClick={() => removeSubName(n)}
                            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                            aria-label={`remove ${n}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  buttonType="reset"
                  variant="secondary"
                  onClick={() => {
                    reset({ name: "" });
                    setSubNames([]);
                  }}
                >
                  Clear
                </Button>
                <Button variant="primary" disabled={isSubmitting}>
                  {!isSubmitting ? (
                    "Create Category"
                  ) : (
                    <MiniSpinner size={20} configStyles="text-zinc-300" />
                  )}
                </Button>
              </div>
            </form>

            {/* Card: Quick Create Subcategory */}
            <QuickCreateSubcategory
              rSub={rSub}
              hSub={hSub}
              resetSub={resetSub}
              submittingSub={submittingSub}
              catOptions={catOptions}
              onCreateSub={onCreateSub}
            />
          </div>

          {catOptions.length === 0 ? (
            <Empty resourceName={"category"} />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
              {catOptions.map((c) => {
                const id = c?._id || c?.id;
                const name = c?.name || "(no name)";
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <p className="font-medium text-zinc-100">{name}</p>
                    </div>

                    <Modal>
                      <Modal.Open opens={"delete-category"}>
                        <Button variant="danger">
                          <HiTrash size={15} />
                        </Button>
                      </Modal.Open>
                      <Modal.Window name={"delete-category"}>
                        <ConfirmDelete
                          resource={"category"}
                          onConfirm={() => handleDeleteCategory(id, name)}
                          disabled={deletingId === id}
                        />
                      </Modal.Window>
                    </Modal>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- tiny helper component for cleanliness ---------- */
function QuickCreateSubcategory({
  rSub,
  hSub,
  resetSub,
  submittingSub,
  catOptions,
  onCreateSub,
}) {
  return (
    <form
      onSubmit={hSub(onCreateSub)}
      className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
    >
      <h2 className="mb-6 text-lg font-medium text-zinc-200">
        Create Subcategory
      </h2>

      <div className="grid gap-6">
        <div>
          <label className="mb-1 block text-zinc-400">Parent category</label>
          <select
            {...rSub("categoryId")}
            defaultValue=""
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 focus:ring-2 focus:ring-blue-700 focus:outline-none"
          >
            <option value="" disabled>
              Select a category…
            </option>
            {catOptions.map((c) => {
              const id = c?._id || c?.id;
              const name = c?.name || "(no name)";
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-zinc-400">Subcategory name</label>
          <input
            type="text"
            placeholder="e.g., webcams"
            {...rSub("name")}
            className="input w-full"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          buttonType="reset"
          variant="secondary"
          onClick={() => resetSub({ name: "", categoryId: "" })}
        >
          Clear
        </Button>
        <Button variant="primary" disabled={submittingSub}>
          {!submittingSub ? (
            "Create Subcategory"
          ) : (
            <MiniSpinner size={20} configStyles="text-zinc-300" />
          )}
        </Button>
      </div>
    </form>
  );
}
