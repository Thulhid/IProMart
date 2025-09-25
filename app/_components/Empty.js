function Empty({ resourceName }) {
  return (
    <p className="mt-5 bg-zinc-900 p-6 text-center text-xs text-zinc-300 shadow sm:text-base mx-10">
      No {resourceName} could be found!
    </p>
  );
}

export default Empty;
