export const Layout = (
  props: React.PropsWithChildren<{ menuItems?: React.ReactNode }>,
) => {
  return (
    <div className="w-full shadow-lg text-sm mb-10">
      <div className="flex flex-col gap-4 p-4 pb-0 shadow-sm bg-gradient-to-l from-purple-100 to-blue-200 rounded-md">
        <div className="flex justify-between items-center border-b">
          <h1 className="font-bold px-4 rounded-full bold text-white shadow uppercase tracking-tight text-xs  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Outreachr 🚀
          </h1>

          {props.menuItems}
        </div>

        <div className="max-h-[400px] no-scrollbar overflow-auto p-0 pb-4">
          {props.children}
        </div>
      </div>
    </div>
  );
};
