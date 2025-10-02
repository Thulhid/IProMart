import { uiCategoryFormat } from "@/app/_utils/helper";

function MobileCategories({ onCloseModal, categories, onSelected }) {
  const uiCategories = [
    { name: "All Categories", _id: "10210" },
    ...categories,
  ];
  return (
    <ul className="xl:px-10px animate-fade-slide transform rounded-lg bg-zinc-900 p-2 backdrop-blur-xs transition-all duration-300 sm:w-auto">
      {uiCategories.map((category, i) => (
        <li
          key={i}
          onClick={() => {
            onSelected(category._id);
            onCloseModal();
          }}
          className="cursor-pointer px-4 py-2 text-base text-zinc-300 transition-colors duration-200 active:bg-zinc-300 active:text-blue-600"
        >
          {uiCategoryFormat(category.name)}
        </li>
      ))}
    </ul>
  );
}

export default MobileCategories;
