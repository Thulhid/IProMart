import { LiaSpinnerSolid } from "react-icons/lia";

function Spinner() {
  return (
    <div className="flex h-full items-center justify-center">
      {/*<GiSpinningBlades*/}
      <LiaSpinnerSolid
        size={60}
        style={{ animationDuration: "2s" }}
        className="animate-spin text-zinc-300"
      />
    </div>
  );
}

export default Spinner;
