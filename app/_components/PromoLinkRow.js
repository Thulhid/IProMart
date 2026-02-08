import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Button from "@/app/_components/Button";
import Menus from "@/app/_components/Menus";
import Modal from "@/app/_components/Modal";
import Table from "@/app/_components/Table";
import { useState } from "react";
import {
  HiCheckCircle,
  HiPencilSquare,
  HiTrash,
  HiXCircle,
} from "react-icons/hi2";

function PromoLinkRow({ link, onDelete, onToggleActive, onUpdate }) {
  const id = link._id || link.id;
  const productName =
    link?.Product?.name ||
    link?.product?.name ||
    link?.productName ||
    link?.product ||
    "-";
  const couponCode =
    link?.Coupon?.code || link?.coupon?.code || link?.couponCode || "-";
  const active = Boolean(link.isActive);
  const redeemed = Number(link.redeemedCount || 0);
  const maxRedemptionsRaw = link?.maxRedemptions ?? link?.maxRedemtions;
  const maxRedemptions = (() => {
    if (maxRedemptionsRaw == null || maxRedemptionsRaw === "") return null;
    const max = Number(maxRedemptionsRaw);
    return Number.isFinite(max) ? max : null;
  })();
  const redeemedLabel =
    Number.isFinite(maxRedemptions) && maxRedemptions >= 1
      ? `${redeemed}/${maxRedemptions}`
      : `${redeemed}`;

  function EditPromoLinkForm({ onCloseModal }) {
    const [isActive, setIsActive] = useState(Boolean(link.isActive));
    const [maxRedemptionsInput, setMaxRedemptionsInput] = useState(
      maxRedemptions == null ? "" : String(maxRedemptions),
    );
    const [saving, setSaving] = useState(false);

    const maxRedemptionsError = (() => {
      if (maxRedemptionsInput === "") return "";
      const max = Number(maxRedemptionsInput);
      if (!Number.isFinite(max) || max < 1 || !Number.isInteger(max)) {
        return "Must be a whole number (>= 1)";
      }
      return "";
    })();

    const handleSave = async () => {
      if (saving) return;
      if (maxRedemptionsError) return;

      const patch = { isActive: Boolean(isActive) };

      if (maxRedemptionsInput === "") {
        if (maxRedemptions != null) patch.maxRedemptions = null;
      } else {
        const max = Number(maxRedemptionsInput);
        patch.maxRedemptions = max;
      }

      setSaving(true);
      const ok = await onUpdate?.(id, patch, "Promo link updated");
      setSaving(false);
      if (ok) onCloseModal?.();
    };

    return (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-semibold text-zinc-200">Edit promo link</h2>

        <div className="flex items-center gap-3">
          <input
            id={`promo-link-active-${id}`}
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={Boolean(isActive)}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label
            htmlFor={`promo-link-active-${id}`}
            className="text-sm text-zinc-300"
          >
            Active (can be redeemed)
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">
            Max redemptions (optional)
          </label>
          <input
            type="number"
            min={1}
            step={1}
            className="input"
            placeholder="Leave empty for unlimited"
            value={maxRedemptionsInput}
            onChange={(e) => setMaxRedemptionsInput(e.target.value)}
          />
          {maxRedemptionsError ? (
            <p className="text-xs text-red-400">{maxRedemptionsError}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              Send empty to clear the limit.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCloseModal} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || Boolean(maxRedemptionsError)}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Table.Row styles="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] items-start gap-x-4 border-t border-t-zinc-600 p-2 text-zinc-300 max-w-6xl bg-zinc-900">
      <div className="truncate text-xs md:text-sm">{productName}</div>
      <div className="truncate text-[10px] md:text-sm">{couponCode}</div>
      <div className="text-[10px] md:text-sm">
        <span className={active ? "text-green-400" : "text-red-400"}>
          {active ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="text-[10px] md:text-sm">{redeemedLabel}</div>
      <Modal>
        <Menus>
          <Menus.Toggle id={id} />
          <Menus.List id={id}>
            <Modal.Open opens="promo-link-edit">
              <Menus.ButtonMenu
                icon={<HiPencilSquare size={18} className="text-zinc-400" />}
                variant="menu"
              >
                Edit
              </Menus.ButtonMenu>
            </Modal.Open>
            <Menus.ButtonMenu
              icon={
                active ? (
                  <HiXCircle size={18} className="text-red-400" />
                ) : (
                  <HiCheckCircle size={18} className="text-green-400" />
                )
              }
              variant="menu"
              onClick={() => onToggleActive(id, !active)}
            >
              {active ? "Set Inactive" : "Set Active"}
            </Menus.ButtonMenu>
            <Modal.Open opens="promo-link-delete">
              <Menus.ButtonMenu
                icon={<HiTrash size={18} className="text-zinc-400" />}
                variant="menu"
              >
                Delete
              </Menus.ButtonMenu>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name="promo-link-edit">
            <EditPromoLinkForm />
          </Modal.Window>
          <Modal.Window name="promo-link-delete">
            <ConfirmDelete
              resource="promo link"
              onConfirm={() => onDelete(id)}
            />
          </Modal.Window>
        </Menus>
      </Modal>
    </Table.Row>
  );
}

export default PromoLinkRow;
