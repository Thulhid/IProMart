import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import Table from "@/app/_components/Table";
import Tag from "@/app/_components/Tag";
import UpdateOrderStatus from "@/app/_components/UpdateOrderStatus";
import { formatCurrency, formatDistanceFromNow } from "@/app/_utils/helper";
import { format, isToday, parseISO } from "date-fns";
import { HiTrash, HiArrowDownOnSquare, HiEye } from "react-icons/hi2";

const nextStatusMap = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};
function OrderRow({ order, onDelete, onOrder }) {
  const {
    _id: id,
    createdAt,
    orderStatus,
    totalAmount,
    orderItems,
    customer: { fullName: customerName, email },
  } = order;
  return (
    <Table.Row
      styles="grid gap-2 text-xs sm:text-sm md:text-base items-start border-t border-zinc-700 py-3 px-2
              grid-cols-2 sm:grid-cols-3 md:grid-cols-[2.5fr_3fr_2fr_2fr_1fr_0.5fr]"
    >
      {/* Product */}
      <div className="col-span-2 text-[11px] text-zinc-200 sm:col-span-1 sm:text-xs">
        {orderItems.map((item, i) => (
          <span key={i} className="block">
            {item.name}
          </span>
        ))}
      </div>

      {/* Customer */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-300">
          {customerName}
        </span>
        <span className="text-[10px] break-words text-zinc-400 sm:text-xs">
          {email}
        </span>
      </div>

      {/* Date */}
      <div className="flex flex-col text-zinc-300">
        <span>
          {isToday(parseISO(createdAt))
            ? "Today"
            : formatDistanceFromNow(createdAt)}
        </span>
        <span className="text-[10px] text-zinc-400 sm:text-xs">
          {format(parseISO(createdAt), "MMM dd yyyy")}
        </span>
      </div>

      {/* Status */}
      <Tag status={orderStatus} />

      {/* Amount */}
      <div className="text-sm font-semibold text-zinc-200">
        {formatCurrency(totalAmount)}
      </div>

      {/* Actions */}
      <div className="ml-auto">
        <Modal>
          <Menus>
            <Menus.Toggle id={id} />
            <Menus.List id={id}>
              <Menus.ButtonMenu
                icon={<HiEye size={18} className="text-zinc-400" />}
                variant="menu"
                link={`/admin/orders/${id}`}
              >
                See details
              </Menus.ButtonMenu>

              {nextStatusMap[orderStatus]?.length > 0 && (
                <Modal.Open opens="order-update">
                  <Menus.ButtonMenu
                    icon={
                      <HiArrowDownOnSquare
                        size={18}
                        className="text-zinc-400"
                      />
                    }
                    variant="menu"
                  >
                    Update status
                  </Menus.ButtonMenu>
                </Modal.Open>
              )}

              <Modal.Open opens="order-delete">
                <Menus.ButtonMenu
                  icon={<HiTrash size={18} className="text-zinc-400" />}
                  variant="menu"
                >
                  Delete
                </Menus.ButtonMenu>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="order-update">
              <UpdateOrderStatus
                currentStatus={orderStatus}
                orderId={id}
                onOrder={onOrder}
              />
            </Modal.Window>
            <Modal.Window name="order-delete">
              <ConfirmDelete resource="order" onConfirm={() => onDelete(id)} />
            </Modal.Window>
          </Menus>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default OrderRow;
