"use client";

import AdminMenuButton from "@/app/_components/AdminMenuButton";
import Button from "@/app/_components/Button";
import { getEmployee } from "@/app/_lib/employee-service";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect, useState } from "react";
import { HiShoppingBag } from "react-icons/hi2";

function NavBar() {
  const [userRole, setUserRole] = useState("");
  const router = useRouter();
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
  return (
    <ul className="flex items-center gap-5 text-lg font-medium">
      {/* <li className="hidden xl:block">
        {" "}
        <Button link="#" variant="header">
          Category
        </Button>
      </li> */}
      {(userRole === "customer" || !userRole) && (
        <motion.li
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_200%] px-3 py-1 transition duration-300 ease-in-out hover:scale-105"
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
      )}
      <li>
        {userRole === "admin" || userRole === "employee" ? (
          <AdminMenuButton userRole={userRole} />
        ) : (
          <Button link="/cart">
            <HiShoppingBag
              size={30}
              className="text-blue-400 hover:brightness-105"
            />
          </Button>
        )}
      </li>
    </ul>
  );
}

export default NavBar;
