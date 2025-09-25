import Link from "next/link";

function Button({
  children,
  disabled,
  onClick,
  buttonType,
  variant,
  selected,
  configStyles,
  link,
}) {
  const base =
    "flex cursor-pointer items-center gap-1 rounded-md text-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:border-none";
  const styles = {
    primary:
      base +
      " bg-blue-500 text-blue-50 hover:brightness-105 font-semibold  p-1.5 disabled:bg-zinc-700",
    secondary:
      base +
      " border text-gray-300 font-semibold py-1 px-1.5 sm:p-1.5 active:bg-gray-200",
    small:
      base + " w-full p-0.5 sm:p-1.5 text-sm hover:bg-zinc-300 text-red-50",
    danger:
      base +
      " text-red-50 bg-red-700 p-2 font-semibold text-sm hover:brightness-105",

    filter:
      base +
      `  p-1 !text-base  ${
        selected === children ? " font-medium text-zinc-200" : " text-zinc-400"
      }`,

    pagination:
      base +
      " p-1 hover:brightness-125 shadow text-zinc-300 sm:text-xs md:text-sm disabled:text-zinc-500 disabled:opacity-75 disabled:cursor-not-allowed !text-base transition-colors duration-300",

    shipped:
      base +
      " bg-blue-500 rounded-lg! text-base! text-blue-50 p-2 shadow-sm shadow-blue-500/80 hover:shadow-blue-500/80 active:shadow-none hover:shadow-sm hover:scale-101 active:scale-100 transition-all duration-300 font-semibold disabled:bg-gray-400/60 disabled:shadow-none",
    delivered:
      base +
      " bg-green-500 rounded-lg! text-base! text-green-50 p-2 shadow-sm shadow-green-500/80 hover:shadow-green-500/80 active:shadow-none hover:shadow-sm hover:scale-105 active:scale-100 transition-all duration-300 font-semibold disabled:bg-gray-400 disabled:shadow-none",

    login:
      base +
      " bg-blue-600 text-blue-50 hover:brightness-105  font-medium text-xl p-1.5 sm:p-2 shadow-md flex items-center justify-center",

    header: base + " text-gray-50 w-full p-0.5 sm:p-1 text-lg",
    round: base + " bg-red-600 text-red-50 px-3 py-1",
    buy:
      base +
      " relative inline-flex h-12 overflow-hidden rounded-xl p-[2px] focus:outline-none group",
    cart:
      base +
      " border-2 border-zinc-200 rounded-xl px-5 text-base text-zinc-200 !text-base font-semibold hover:bg-zinc-200 hover:text-blue-600 active:text-blue-600 active:bg-zinc-200",
    updateQuantity:
      base +
      " p-1.5 cursor-pointer group focus:outline-none !rounded-full bg-zinc-400/20",
    back:
      base + " group text-2xl inline hover:text-red-600 cursor-pointer my-1",
    close:
      base +
      " p-1.5 cursor-pointer group focus:outline-none !rounded-full hover:text-red-600 text-zinc-50/50 transition-colors duration-300",
    signup:
      base +
      " bg-blue-600 text-blue-50 hover:brightness-105 font-semibold p-1.5 ml-auto !text-lg my-4 px-10 disabled:bg-zinc-700",
    menu:
      base +
      " hover:text-blue-400 transition-colors duration-200 w-full !rounded-none active:text-blue-400 xl:text-base",

    edit: base + " text-zinc-50/50 hover:text-blue-400 cursor-pointer",
  };

  //border border-red-600
  return (
    <>
      {!link ? (
        <button
          type={buttonType}
          className={`${styles[variant]} ${configStyles}`}
          onClick={onClick}
          disabled={disabled || selected === children}
        >
          {variant === "buy" ? (
            <>
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_110deg_at_50%_50%,#bfdbfe_0%,#93c5fd_50%,#60a5fa_100%)]" />
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-950 px-5 py-1 text-base font-semibold text-zinc-50 backdrop-blur-3xl transition-colors duration-300 group-hover:bg-blue-400 group-active:bg-blue-600 hover:text-blue-50 ${
                  disabled || selected === children
                    ? ""
                    : "group-hover:bg-blue-600 group-active:bg-blue-600"
                }`}
              >
                {children}
              </span>
            </>
          ) : (
            children
          )}
        </button>
      ) : (
        <Link href={link} className={`${styles[variant]} ${configStyles}`}>
          {children}
        </Link>
      )}
    </>
  );
}

export default Button;
