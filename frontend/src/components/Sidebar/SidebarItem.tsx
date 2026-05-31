import { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSideBarContext } from "../../context/SideBarContext";
import { cn } from "@/lib/utils";

export default function SideBarItems({ item }: any) {
  const [open, setOpen] = useState(false);
  const { setExpanded } = useSideBarContext();

  if (item.childrens) {
    return (
      <div>
        <button
          type="button"
          className={cn(
            "w-full flex items-center py-2 px-4 text-gray-300 hover:bg-blue-600 hover:text-gray-100 rounded-md transition-colors",
          )}
          onClick={() => setOpen(!open)}
        >
          {item.icon ? item.icon : <MdOutlineDashboard />}
          <span className="flex-1 text-sm text-left">{item.title}</span>
          {item.childrens && (
            <BsChevronDown className={cn("mr-2 transition-transform", open && "rotate-180")} />
          )}
        </button>
        {open && (
          <div className="px-5 text-white space-y-1">
            {item.childrens.map((child: any, index: number) => (
              <SideBarItems key={index} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <Link
        className={cn(
          "mb-1 flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md transition-colors",
          "group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
        )}
        to={item.path}
      >
        {item.icon ? item.icon : <MdOutlineDashboard />}
        <span className="text-sm">{item.title}</span>
      </Link>
    );
  }
}