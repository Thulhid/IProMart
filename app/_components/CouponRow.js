import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import Table from "@/app/_components/Table";
import { formatCurrency } from "@/app/_utils/helper";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";
import { format, parseISO } from "date-fns";

function CouponRow({ coupon, onEdit, onDelete }) {
  const { _id: id, code, minSubtotal, discountAmount, expiresAt, isActive } =
    coupon;

  return (
    <Table.Row styles="grid grid-cols-[1.5fr_1.5fr_1.5fr_2fr_1fr_0.5fr] items-start gap-x-4 border-t border-t-zinc-600 p-2 text-zinc-300 max-w-6xl bg-zinc-900">
      <div className="truncate text-xs font-medium uppercase md:text-sm">
        {code}
      </div>
      <div className="text-[10px] md:text-sm">
        {formatCurrency(minSubtotal)}
      </div>
      <div className="text-[10px] md:text-sm">
        -{formatCurrency(discountAmount)}
      </div>
      <div className="text-[10px] md:text-sm">
        {expiresAt ? format(parseISO(expiresAt), "MMM d yyyy, HH:mm") : "Never"}
      </div>
      <div className="text-[10px] md:text-sm">
        <span className={isActive ? "text-green-400" : "text-red-400"}>
          {isActive ? "Active" : "Disabled"}
        </span>
      </div>
      <Modal>
        <Menus>
          <Menus.Toggle id={id} />
          <Menus.List id={id}>
            <Menus.ButtonMenu
              icon={<HiPencilSquare size={18} className="text-zinc-400" />}
              variant="menu"
              onClick={() => onEdit(coupon)}
            >
              Edit
            </Menus.ButtonMenu>
            <Modal.Open opens="coupon-delete">
              <Menus.ButtonMenu
                icon={<HiTrash size={18} className="text-zinc-400" />}
                variant="menu"
              >
                Delete
              </Menus.ButtonMenu>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name="coupon-delete">
            <ConfirmDelete resource="coupon" onConfirm={() => onDelete(id)} />
          </Modal.Window>
        </Menus>
      </Modal>
    </Table.Row>
  );
}

export default CouponRow;
