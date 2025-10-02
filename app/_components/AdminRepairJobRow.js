"use client";

import Button from "@/app/_components/Button";
import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import StatusTag from "@/app/_components/RepairJobStatusTag";
import RepairPaymentStatusTag from "@/app/_components/RepairPaymentStatusTag";
import Table from "@/app/_components/Table";
import UpdateRepairJobPayment from "@/app/_components/UpdateRepairJobPayment";
import UpdateRepairJobStatus from "@/app/_components/UpdateRepairJobStatus";
import { formatCurrency } from "@/app/_utils/helper";
import { useState } from "react";
import { HiArrowDownOnSquare, HiEye, HiTrash } from "react-icons/hi2";

function AdminRepairJobRow({ job, onUpdateRepairJob, onDeleteRepairJob }) {
  let isPayhere = false;

  const {
    _id: id,
    request,
    status,
    paymentStatus,
    amount,
    paymentMethod,
    shippingFee,
  } = job;

  if (paymentMethod === "PAYHERE" && paymentStatus === "PAID") isPayhere = true;

  return (
    <Table.Row
      styles="grid gap-2 text-xs sm:text-sm md:text-base items-start border-t border-zinc-700 py-3 px-2
                grid-cols-2 sm:grid-cols-3 md:grid-cols-[2fr_2fr_2fr_2fr_0.5fr]"
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-300">
          {request.device}
        </span>
        <span className="text-[10px] break-words text-zinc-400 sm:text-xs">
          {request.brand}
        </span>
        <span className="text-[10px] break-words text-zinc-400 sm:text-xs">
          {request.model}
        </span>
        <span className="text-[10px] break-words text-zinc-400 sm:text-xs">
          {request.serialNumber}
        </span>
      </div>
      <div>
        {/* {StatusTag(status)} */}

        <StatusTag status={status} />
      </div>
      <div>
        <RepairPaymentStatusTag status={paymentStatus} />
      </div>

      {/* Status */}
      {/* <Tag status={orderStatus} /> */}

      {/* Amount */}
      <div className="text-sm font-semibold text-zinc-200">
        {amount ? formatCurrency(amount) : "N/A"}
      </div>

      {/* Actions */}
      <div className="ml-auto">
        <Button
          link={`/admin/repair-jobs/${id}`}
          configStyles="cursor-pointer inline-block mx-1"
        >
          <HiEye size={18} className="text-zinc-400" title="See Details" />
        </Button>
        <Modal>
          <Menus>
            <Menus.Toggle id={2} />
            <Menus.List id={2}>
              <Modal.Open opens="job-update">
                <Menus.ButtonMenu
                  icon={
                    <HiArrowDownOnSquare size={18} className="text-zinc-400" />
                  }
                  variant="menu"
                >
                  Update status
                </Menus.ButtonMenu>
              </Modal.Open>
              {!isPayhere && (
                <Modal.Open opens="job-payment-update">
                  <Menus.ButtonMenu
                    icon={
                      <HiArrowDownOnSquare
                        size={18}
                        className="text-zinc-400"
                      />
                    }
                    variant="menu"
                  >
                    Update Payments
                  </Menus.ButtonMenu>
                </Modal.Open>
              )}

              <Modal.Open opens="job-delete">
                <Menus.ButtonMenu
                  icon={<HiTrash size={18} className="text-zinc-400" />}
                  variant="menu"
                >
                  Delete
                </Menus.ButtonMenu>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="job-update">
              <UpdateRepairJobStatus
                currentStatus={status}
                id={id}
                onUpdateRepairJob={onUpdateRepairJob}
              />
            </Modal.Window>
            {!isPayhere && (
              <Modal.Window name="job-payment-update">
                <UpdateRepairJobPayment
                  currentMethod={paymentMethod}
                  currentStatus={paymentStatus}
                  total={shippingFee + amount}
                  id={id}
                  onUpdateRepairJob={onUpdateRepairJob}
                />
              </Modal.Window>
            )}
            <Modal.Window name="job-delete">
              <ConfirmDelete
                onConfirm={() => onDeleteRepairJob(id)}
                resource={"job"}
              />
            </Modal.Window>
          </Menus>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default AdminRepairJobRow;
