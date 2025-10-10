import BackButton from "@/app/_components/BackButton";
import ProductDetailsActions from "@/app/_components/ProductDetailsActions";
import Slider from "@/app/_components/Slider";
import SparkEffect from "@/app/_components/SparkEffect";
import { getProductBySlug } from "@/app/_lib/product-service";
import { formatCurrency } from "@/app/_utils/helper";
import { HiBolt, HiOutlineChevronLeft } from "react-icons/hi2";

export default async function Page({ params }) {
  // await new Promise((resolve) => setTimeout(resolve, 2000)); // NOTE: TESTING

  const { slug } = await params;

  const {
    data: { data: product },
  } = await getProductBySlug(slug);

  const {
    name,
    images,
    category,
    description,
    features,
    availability,
    warranty,
    priceDiscount,
    price,
    isUsed,
  } = product;
  return (
    // <div className="max-w-5xl 2xl:m-auto">
    <>
      <div className="flex items-start gap-3">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <div>
          <h1 className="text-3xl font-semibold text-zinc-300">{name}</h1>
          <h2 className="text-lg text-zinc-400">{category.name}</h2>
        </div>
      </div>
      <div className="mx-4 my-2 grid grid-cols-1 content-center items-center md:mx-10 xl:grid-cols-2 2xl:m-auto 2xl:max-w-6xl">
        <section>
          <Slider slides={images} />
          <div className="flex flex-col items-center">
            <p className="text-3xl font-medium text-zinc-300">
              {priceDiscount
                ? formatCurrency(price - priceDiscount)
                : formatCurrency(price)}
            </p>
            {priceDiscount && (
              <div className="mt-4">
                <p className="text-lg text-zinc-400">
                  Regular price:{" "}
                  <span className="line-through">{formatCurrency(price)}</span>
                </p>
                <p className="text-lg font-medium text-green-500">
                  Discount: {formatCurrency(priceDiscount)}
                </p>
              </div>
            )}
          </div>
        </section>
        <section className="mt-10 flex flex-col items-start gap-10 xl:m-auto">
          <p className="inline-flex gap-3">
            <span
              className={`${
                isUsed
                  ? "bg-yellow-600 text-yellow-50"
                  : "bg-green-500 text-green-50"
              } rounded-full px-2`}
            >
              {isUsed ? "Used" : "Brand new"}
            </span>
            <span className="rounded-full bg-blue-700 px-2 text-blue-50">
              {" "}
              {warranty
                ? warranty >= 12
                  ? `${Math.floor(warranty / 12)} year${
                      Math.floor(warranty / 12) > 1 ? "s" : ""
                    }${
                      warranty % 12 !== 0
                        ? ` ${warranty % 12} month${warranty % 12 > 1 ? "s" : ""}`
                        : ""
                    }`
                  : `${warranty} month${warranty === 1 ? "" : "s"}`
                : "No"}{" "}
              Warranty
            </span>
          </p>

          <div>
            <h2 className="mb-1 text-2xl font-bold tracking-wider text-zinc-300">
              Description
            </h2>
            <p className="text-base text-zinc-400"> {description}</p>
          </div>
          <div>
            <h2 className="mb-1 text-2xl font-bold tracking-wider text-zinc-300">
              Features
            </h2>
            <div className="ml-auto text-base text-zinc-400">
              {" "}
              {features.map((feature, i) => (
                <p className="mb-1 flex gap-1" key={i}>
                  <SparkEffect>
                    <HiBolt size={30} className="text-blue-600" />
                  </SparkEffect>
                  <span>{feature}</span>
                </p>
              ))}
            </div>
          </div>
          <p
            className={` ${
              availability > 10
                ? "text-green-500"
                : availability === 0
                  ? "text-red-400"
                  : "text-yellow-400"
            }`}
          >
            {availability > 10
              ? `In Stock`
              : availability === 0
                ? "Out of Stock"
                : `Only ${availability} left`}
          </p>
          <ProductDetailsActions product={product} />
        </section>
      </div>
    </>
  );
}
