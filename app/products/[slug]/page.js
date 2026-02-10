import BackButton from "@/app/_components/BackButton";
import KokoPaymentIndicator from "@/app/_components/KokoPaymentIndicator";
import ProductDetailsActions from "@/app/_components/ProductDetailsActions";
import Slider from "@/app/_components/Slider";
import SparkEffect from "@/app/_components/SparkEffect";
import { getProductBySlug } from "@/app/_lib/product-service";
import { formatCurrency } from "@/app/_utils/helper";
import { HiBolt, HiOutlineChevronLeft } from "react-icons/hi2";
import { cookies } from "next/headers";

export default async function Page({ params, searchParams }) {
  const { slug } = await params;

  const cookieStore = cookies();
  const promoFromQuery = (await searchParams)?.promo;
  const promoFromCookie = cookieStore.get("promo_token")?.value;

  // priority: query > cookie
  const promo = promoFromQuery || promoFromCookie || null;

  const {
    data: { data: product },
  } = await getProductBySlug(slug, promo);

  const {
    name,
    images,
    category,
    description,
    features,
    availability,
    warranty,
    price,
    priceDiscount,
    isUsed,

    // ✅ promo-aware fields from backend
    finalPrice,
    originalFinalPrice,
    promoApplied,
    promoCouponCode,
  } = product;

  // ✅ Display price should be promo finalPrice if promo applied,
  // otherwise fallback to normal (price - priceDiscount) logic
  const baseFinal = priceDiscount ? price - priceDiscount : price;
  const displayPrice =
    promoApplied && typeof finalPrice === "number" ? finalPrice : baseFinal;

  // ✅ “Regular” line-through:
  // - if promo applied and backend sent originalFinalPrice (usually price - priceDiscount),
  //   use that (shows “before promo”).
  // - else if normal discount exists, show price.
  const regularPrice =
    promoApplied && typeof originalFinalPrice === "number"
      ? originalFinalPrice
      : priceDiscount
        ? price
        : null;

  const shownDiscount =
    regularPrice !== null ? Math.max(0, regularPrice - displayPrice) : 0;

  const installmentTotal = Number.isFinite(displayPrice)
    ? Math.max(0, Math.round(displayPrice))
    : 0;
  const installmentBase = Math.floor(installmentTotal / 3);
  const installmentRemainder = installmentTotal - installmentBase * 3;
  const installments = [
    installmentBase + (installmentRemainder > 0 ? 1 : 0),
    installmentBase + (installmentRemainder > 1 ? 1 : 0),
    installmentBase,
  ];

  return (
    <div className="m-auto max-w-[1440px]">
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

      <div className="2xl:m-auto] mx-4 my-2 grid grid-cols-1 content-center items-center md:mx-10 xl:grid-cols-2">
        <section>
          <Slider slides={images} />

          <div className="flex flex-col items-center">
            {/* ✅ main price */}
            <div className="flex items-center gap-2">
              <p className="text-3xl font-medium text-zinc-300">
                {formatCurrency(displayPrice)}
              </p>

              {/* ✅ small tag to show promo is applied */}
              {promoApplied && (
                <span className="rounded-full bg-green-600/20 px-2 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-500/30">
                  Promo price
                </span>
              )}
            </div>

            {/* ✅ price breakdown */}
            {regularPrice !== null && (
              <div className="mt-4 text-center">
                <p className="text-lg text-zinc-400">
                  Regular price:{" "}
                  <span className="line-through">
                    {formatCurrency(regularPrice)}
                  </span>
                </p>

                {shownDiscount > 0 && (
                  <p className="text-lg font-medium text-green-500">
                    Discount: {formatCurrency(shownDiscount)}
                  </p>
                )}

                {/* ✅ optional small tag showing which promo */}
                {promoApplied && promoCouponCode && (
                  <p className="mt-1 text-sm text-blue-400">
                    Applied: {promoCouponCode}
                  </p>
                )}
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
              {warranty
                ? warranty >= 12
                  ? `${Math.floor(warranty / 12)} year${
                      Math.floor(warranty / 12) > 1 ? "s" : ""
                    }${
                      warranty % 12 !== 0
                        ? ` ${warranty % 12} month${
                            warranty % 12 > 1 ? "s" : ""
                          }`
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

          <KokoPaymentIndicator
            todayAmount={formatCurrency(installments[0])}
            day30Amount={formatCurrency(installments[1])}
            day60Amount={formatCurrency(installments[2])}
            totalAmount={formatCurrency(installmentTotal)}
            compact={true}
          />

          <ProductDetailsActions product={product} />
        </section>
      </div>
    </div>
  );
}
