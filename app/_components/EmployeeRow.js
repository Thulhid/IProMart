import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import Table from "@/app/_components/Table";
import { useRouter } from "next/navigation";
import { HiTrash, HiPencilSquare } from "react-icons/hi2";

function EmployeeRow({ employee, onDelete }) {
  const router = useRouter();
  const { _id: id, firstName, lastName, email, mobileNumber, role } = employee;
  return (
    <Table.Row styles=" grid grid-cols-[4fr_3fr_3fr_1fr] md:grid-cols-[4fr_3fr_3fr_1fr] grid-rows-1 items-start border-t border-t-zinc-600 pt-2 text-zinc-300 md:p-2 max-w-6xl bg-zinc-900">
      <div className="flex flex-col">
        <span className="text-xs md:text-sm">{`${firstName} ${lastName}`}</span>
        <span className="max-w-[75px] text-[10px] break-words text-zinc-400 md:max-w-xs md:text-xs">
          {role}
        </span>
      </div>
      <div className="text-[9px] md:text-sm">{mobileNumber}</div>
      <div className="text-[9px] md:text-sm">{email}</div>
      <Modal>
        <Menus>
          <Menus.Toggle id={id} />
          <Menus.List id={id}>
            <Menus.ButtonMenu
              icon={<HiPencilSquare size={18} className="text-zinc-400" />}
              variant="menu"
              link={`/admin/employees/${id}`}
              // onClick={() => router.push(`/admin/employees/${id}`)}
            >
              Edit
            </Menus.ButtonMenu>
            <Modal.Open opens="employee-delete">
              <Menus.ButtonMenu
                icon={<HiTrash size={18} className="text-zinc-400" />}
                variant="menu"
              >
                Delete
              </Menus.ButtonMenu>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name="employee-delete">
            <ConfirmDelete resource="employee" onConfirm={() => onDelete(id)} />
          </Modal.Window>
        </Menus>
      </Modal>
    </Table.Row>
  );
}

export default EmployeeRow;
