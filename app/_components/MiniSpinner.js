import { LiaSpinnerSolid } from "react-icons/lia";

function MiniSpinner({ size, configStyles }) {
  return (
    <div className="flex h-full items-center justify-center">
      <LiaSpinnerSolid
        size={size}
        style={{ animationDuration: "2s" }}
        className={`animate-spin ${configStyles}`}
      />
    </div>
  );
}

export default MiniSpinner;
