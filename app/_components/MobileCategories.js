import { uiCategoryFormat } from "@/app/_utils/helper";

function MobileCategories({ onCloseModal, categories, onSelected }) {
  const uiCategories = ["All Categories", ...categories];

  return (
    <ul className="xl:px-10px transform rounded-lg bg-zinc-900 p-2 transition-all duration-300 sm:w-auto backdrop-blur-xs animate-fade-slide">
      {uiCategories.map((category, i) => (
        <li
          key={i}
          onClick={() => {
            onSelected(category);
            onCloseModal();
          }}
          className="px-4 py-2 cursor-pointer transition-colors duration-200 text-zinc-300 text-base active:bg-zinc-300 active:text-red-600"
        >
          {uiCategoryFormat(category)}
        </li>
      ))}
    </ul>
  );
}

export default MobileCategories;
