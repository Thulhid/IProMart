"use client";

import Button from "@/app/_components/Button";
import Link from "next/link";
import {
  CiBoxList,
  CiMedicalCase,
  CiSettings,
  CiShoppingCart,
  CiUser,
} from "react-icons/ci";
import MobileCategories from "@/app/_components/MobileCategories";
import { useCategories } from "@/app/_hooks/useCategories";
import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { useEffect, useState } from "react";
import { getCustomer } from "@/app/_lib/customer-service";
import { useRouter } from "next/navigation";
import { getEmployee } from "@/app/_lib/employee-service";
import toast from "react-hot-toast";
import AdminMenuButton from "@/app/_components/AdminMenuButton";
import Modal from "@/app/_components/Modal";
import MobileSignupLogin from "@/app/_components/MobileSignUpLogin";

function BottomNavigationBar({ categories }) {
  const router = useRouter();
  const { open, setOpen, setSelected } = useCategories();
  // const { ref } = useOutsideClick(() => setOpen(false));

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  // const { ref: adminRef } = useOutsideClick(() => setShowAdminMenu(false));

  useEffect(() => {
    async function getUser() {
      try {
        const localUserRole = localStorage.getItem("role") || "guest";

        if (localUserRole === "customer") {
          const res = await getCustomer();
          if (!res) return setIsGuest(true);
          setUserRole("customer");
        } else if (localUserRole === "admin" || localUserRole === "employee") {
          const res = await getEmployee();
          if (!res) return setIsGuest(true);
          setUserRole(res.data.data.role);
        } else {
          setIsGuest(true);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
    getUser();
  }, []);

  const handleAccountClick = () => {
    if (isGuest) {
      setShowLoginPrompt(true);
    } else {
      // go to account page if logged in
      router.push("/me");
    }
  };
  const { ref: loginRef } = useOutsideClick(() => setShowLoginPrompt(false));

  return (
    <>
      {/* Bottom Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-[1000] flex justify-between bg-zinc-900 px-6 py-1.5 xl:hidden">
        {userRole === "admin" || userRole === "employee" ? (
          <AdminMenuButton userRole={userRole} />
        ) : (
          <Link href="/cart" className="flex flex-col items-center">
            <CiShoppingCart size={30} className="text-zinc-300" />
            <span className="text-xs text-zinc-400">Cart</span>
          </Link>
        )}

        {/* <Button
          configStyles="flex flex-col items-center"
          onClick={() => setOpen((c) => !c)}
        >
          <CiBoxList size={30} className="text-zinc-300" />
          <span className="text-xs text-zinc-400">Categories</span>
        </Button> */}
        <Modal>
          <Modal.Open opens="categories">
            <Button
              configStyles="flex flex-col items-center"
              // onClick={() => setOpen((c) => !c)}
            >
              <CiBoxList size={30} className="text-zinc-300" />
              <span className="text-xs text-zinc-400">Categories</span>
            </Button>
          </Modal.Open>
          <Modal.Window name="categories">
            <MobileCategories
              categories={categories}
              onSelected={setSelected}
            />
          </Modal.Window>
        </Modal>

        <Link
          href="/admin/repair-requests"
          className="flex flex-col items-center"
        >
          <CiMedicalCase size={30} className="text-zinc-300" />
          <span className="text-xs text-zinc-400">Repairing</span>
        </Link>

        {isGuest && (
          <Modal>
            <Modal.Open opens="account-signup-login">
              <button className="flex flex-col items-center">
                <CiUser size={30} className="text-zinc-300" />
                <span className="text-xs text-zinc-400">Account</span>
              </button>
            </Modal.Open>
            <Modal.Window name="account-signup-login">
              <MobileSignupLogin />
            </Modal.Window>
          </Modal>
        )}

        {!isGuest && (
          <Link className="flex flex-col items-center" href="/me">
            <CiUser size={30} className="text-zinc-300" />
            <span className="text-xs text-zinc-400">Account</span>
          </Link>
        )}
      </div>
    </>
  );
}

//export default BottomNavigationBar;

// function BottomNavigationBar({ children }) {
//   const [isCategories, setIsCategories] = useState(false);

//   return (
//     <>
//       {/* {isCategories && <Categories categories={categories} />} */}
//       <div className="fixed bottom-0 left-0 right-0 flex justify-between bg-zinc-100 px-6 py-1.5 md:hidden z-1004">
//         {children}
//       </div>
//     </>
//   );
// }

// function Cart({ children, onClick }) {
//   return (
//     <Button configStyles="flex flex-col items-center" onClick={onClick}>
//       {children}
//     </Button>
//   );
// }

// // function Categories({ children, onClick }) {
// //   return (
// //     <Button configStyles="flex flex-col items-center" onClick={onClick}>
// //       {children}
// //     </Button>
// //   );
// // }
// function Repairing({ children, onClick }) {
//   return (
//     <Button configStyles="flex flex-col items-center" onClick={onClick}>
//       {children}
//     </Button>
//   );
// }
// function Account({ children, onClick }) {
//   return (
//     <Button configStyles="flex flex-col items-center" onClick={onClick}>
//       {children}
//     </Button>
//   );
// }

// BottomNavigationBar.Cart = Cart;
// //BottomNavigationBar.Categories = Categories;
// BottomNavigationBar.Repairing = Repairing;
// BottomNavigationBar.Account = Account;
export default BottomNavigationBar;
