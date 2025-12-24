"use client";

import AdminMenuButton from "@/app/_components/AdminMenuButton";
import Button from "@/app/_components/Button";
import PcBuilderButton from "@/app/_components/PcBuilderButton";
import { getCustomerCart } from "@/app/_lib/cart-service";
import { getCustomer } from "@/app/_lib/customer-service";
import { getEmployee } from "@/app/_lib/employee-service";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiShoppingBag } from "react-icons/hi2";

function NavBar() {
  const [userRole, setUserRole] = useState("");
  const [cartCount, setCartCount] = useState([]);
  const pathname = usePathname();

  const count = cartCount?.length ?? 0;
  useEffect(function () {
    async function getUserRole() {
      try {
        const role = localStorage.getItem("role") || "guest";
        if (role === "employee") {
          const res = await getEmployee();
          setUserRole(res.data.data.role);
        }
        setUserRole(role);
        //setUserRole(res.doc?.role || "customer");
      } catch (error) {}
    }

    getUserRole();
  }, []);

  useEffect(() => {
    setCartCount([]);
    (async function () {
      const resCustomer = await getCustomer();
      if (resCustomer) {
        const cartRes = await getCustomerCart();
        setCartCount(cartRes.cart?.cartItems);
      } else {
        setCartCount(JSON.parse(localStorage.getItem("guestCart")));
      }
    })();
  }, []);

  return (
    <ul className="flex items-center gap-3 text-lg font-medium">
      {/* <li className="hidden xl:block">
        {" "}
        <Button link="#" variant="header">
          Category
        </Button>
      </li> */}
      {(userRole === "customer" || userRole === "guest") && (
        <>
          <motion.li
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 bg-[length:200%_200%] px-1 py-1 transition duration-300 ease-in-out hover:scale-105"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {" "}
            <Button link="/repairs" variant="header">
              Repairing
            </Button>
          </motion.li>
          <PcBuilderButton />
        </>
      )}
      <li>
        {userRole === "admin" || userRole === "employee" ? (
          <div className="flex gap-2">
            {pathname !== "/admin/dashboard" && (
              <div className="rounded-lg bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 bg-[length:200%_200%] px-1 py-1 transition duration-300 ease-in-out hover:scale-105">
                {" "}
                <Button link="/admin/dashboard" variant="header">
                  Dashboard
                </Button>
              </div>
            )}
            <AdminMenuButton userRole={userRole} />
          </div>
        ) : (
          <div className="relative">
            <Button link="/cart" aria-label="Cart">
              <HiShoppingBag
                size={30}
                className="text-blue-600 hover:brightness-105"
              />
            </Button>

            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-xs font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </div>
        )}
      </li>
    </ul>
  );
}

export default NavBar;
