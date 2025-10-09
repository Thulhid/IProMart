import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import Table from "@/app/_components/Table";
import { useRouter } from "next/navigation";
import { HiTrash, HiPencilSquare, HiMiniCheckBadge } from "react-icons/hi2";

function CustomerRow({ customer, onDelete }) {
  const router = useRouter();
  const {
    _id: id,
    firstName,
    lastName,
    email,
    shippingAddresses,
    emailVerified,
  } = customer;
  console.log(id);

  //const contacts = shippingAddress?.street;

  return (
    <Table.Row styles=" grid grid-cols-[1.5fr_2fr_3fr_0.5fr] md:grid-cols-[2fr_1fr_3fr_0.5fr] grid-rows-1 items-start border-t border-t-zinc-600 pt-2 text-zinc-300 md:p-2 max-w-6xl bg-zinc-900">
      <div className="flex flex-col">
        <span className="inline-flex items-center gap-0 text-xs md:gap-1 md:text-sm">
          {`${firstName} ${lastName}`}
          {emailVerified && (
            <span className="text-blue-400">
              <HiMiniCheckBadge />{" "}
            </span>
          )}
        </span>
        <span className="max-w-[75px] text-[9px] break-words text-zinc-400 md:max-w-xs md:text-xs">
          {email}
        </span>
      </div>
      <div className="text-[9px] md:text-sm">
        {shippingAddresses?.map((address, i) => (
          <div key={i}>
            <span className={`${address.isDefault && "text-blue-400"}`}>
              {address.mobileNumber}
            </span>
          </div>
        ))}
      </div>
      <div className="text-[9px] md:text-xs">
        {shippingAddresses?.map((address, i) => (
          <div key={i}>
            <span className={`${address.isDefault && "text-blue-400"}`}>
              {address.street}, {address.city}
            </span>
          </div>
        ))}
      </div>
      <Modal>
        <Menus>
          <Menus.Toggle id={id} />
          <Menus.List id={id}>
            <Menus.ButtonMenu
              icon={<HiPencilSquare size={18} className="text-zinc-400" />}
              variant="menu"
              link={`/admin/customers/${id}`}
              // onClick={() => router.push(`/admin/employees/${id}`)}
            >
              Edit
            </Menus.ButtonMenu>
            <Modal.Open opens="customer-delete">
              <Menus.ButtonMenu
                icon={<HiTrash size={18} className="text-zinc-400" />}
                variant="menu"
              >
                Delete
              </Menus.ButtonMenu>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name="customer-delete">
            <ConfirmDelete resource="customer" onConfirm={() => onDelete(id)} />
          </Modal.Window>
        </Menus>
      </Modal>
    </Table.Row>
  );
}

export default CustomerRow;
