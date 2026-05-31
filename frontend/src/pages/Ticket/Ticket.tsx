// @ts-nocheck
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/ComponentToPrint/index";
import { v4 as uuidv4 } from "uuid";
import { gql, useQuery } from "@apollo/client";
import { useCreateTicketPaymentMutation } from "../../generated/graphql";
import { Button } from "@/components/ui/button";
import { TypeOptions, toast } from "react-toastify";
import { Ticket as TicketIcon, Loader2, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-line";
import TicketPriceConfigPage from "../TicketConfig/TicketPriceConfig";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const notify = (message: string, auto_Close: boolean | number, toastType: TypeOptions) => {
  if (!toast.isActive("alert")) {
    toast(message, { autoClose: auto_Close ? 500 : false, toastId: "alert", type: toastType });
  }
};

const datetime_format = (date_time: string) => {
  const date = new Date(date_time);
  return (
    date.toLocaleDateString("fr-CA") +
    " " +
    date.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })
  );
};

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const GET_TICKET_CONFIGS = gql`
  query GetTicketPriceConfigs {
    GetTicketPriceConfigs {
      config_id price label age_group
      facilities { facility_id name code }
    }
  }
`;

// ─── Facility colour palette (mirrors config page) ───────────────────────────

const FACILITY_COLORS: Record<string, { header: string; card: string; hover: string; text: string; dot: string }> = {
  SWIM:  { header: "bg-blue-500",   card: "bg-blue-50 border-blue-200 hover:border-blue-400",   hover: "hover:bg-blue-100",  text: "text-blue-600",  dot: "bg-blue-400" },
  GYM:   { header: "bg-green-500",  card: "bg-green-50 border-green-200 hover:border-green-400", hover: "hover:bg-green-100", text: "text-green-600", dot: "bg-green-400" },
  STEAM: { header: "bg-orange-500", card: "bg-orange-50 border-orange-200 hover:border-orange-400", hover: "hover:bg-orange-100", text: "text-orange-600", dot: "bg-orange-400" },
};

const facilityColor = (code: string) =>
  FACILITY_COLORS[code] ?? {
    header: "bg-gray-500", card: "bg-gray-50 border-gray-200 hover:border-gray-400",
    hover: "hover:bg-gray-100", text: "text-gray-600", dot: "bg-gray-400",
  };

// ─── Sale tab ────────────────────────────────────────────────────────────────

function TicketSale() {
  const [uuid, setUuid] = useState("");
  const [price, setPrice] = useState(0);
  const [seller, setSeller] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data: configData, loading: configLoading } = useQuery(GET_TICKET_CONFIGS, {
    fetchPolicy: "no-cache",
  });

  const allConfigs: any[] = configData?.GetTicketPriceConfigs ?? [];

  // Colour for a config: use first facility's code (primary colour)
  const primaryColor = (cfg: any) =>
    facilityColor(cfg.facilities?.[0]?.code ?? "");

  const componentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePrint1 = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent1(url, (response: any) => {
        console.log("Main: ", response);
      });
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe: HTMLIFrameElement) => {
      await handlePrint1(printIframe);
    },
  });

  const [createTicketPayment] = useCreateTicketPaymentMutation();

  const handleSelect = async (cfg: any) => {
    setActiveId(cfg.config_id);
    setPrice(cfg.price);
    setSeller(localStorage.getItem("display_name") || "");
    const uid = (await uuidv4()).slice(0, 16);
    setUuid(uid);
    buttonRef.current.click();

    const result = await createTicketPayment({
      variables: {
        userId: parseInt(localStorage.getItem("user_id")),
        price: cfg.price,
        ticketCode: uid + "Ticket",
      },
    });

    if (result.data?.CreateTicketPayment.success) {
      notify("Success", true, "success");
      await new Promise((r) => setTimeout(r, 700));
    } else {
      notify(result.errors, 5000, "error");
    }
    setActiveId(null);
  };

  const isLoading = activeId !== null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-100 rounded-lg">
          <TicketIcon className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold">លក់សំបុត្រ</h1>
          <p className="text-sm text-muted-foreground">ជ្រើសរើសតម្លៃ — ប្រព័ន្ធដំណើរការដោយស្វ័យប្រវត្តិ</p>
        </div>
      </div>

      {/* Hidden print button */}
      <button ref={buttonRef} className="hidden" onClick={handlePrint} />

      {configLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : allConfigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 gap-3">
          <TicketIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">មិនទាន់មានតម្លៃ Ticket</p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Admin ត្រូវចូលទៅ <strong>កំណត់តម្លៃ Ticket</strong> ដើម្បីបន្ថែម
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3">
          {allConfigs.map((cfg) => {
            const colors = primaryColor(cfg);
            const busy = activeId === cfg.config_id;
            const isMulti = cfg.facilities?.length > 1;
            return (
              <button
                key={cfg.config_id}
                disabled={isLoading}
                onClick={() => handleSelect(cfg)}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  rounded-xl border-2 p-3 h-32 transition-all
                  ${colors.card}
                  ${isLoading && !busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${busy ? "scale-95 shadow-inner" : "hover:shadow-md active:scale-95"}
                `}
              >
                {busy ? (
                  <Loader2 className={`h-7 w-7 animate-spin ${colors.text}`} />
                ) : (
                  <>
                    {/* Price */}
                    <span className={`text-3xl font-black ${colors.text}`}>
                      ${cfg.price}
                    </span>

                    {/* Facility badges */}
                    <div className="flex flex-wrap justify-center gap-0.5">
                      {cfg.facilities?.map((f: any) => {
                        const fc = facilityColor(f.code);
                        return (
                          <span key={f.facility_id} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${fc.badge}`}>
                            {f.name}
                          </span>
                        );
                      })}
                    </div>

                    {/* Age group */}
                    {cfg.age_group && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {cfg.age_group}
                      </span>
                    )}

                    {/* Label */}
                    {cfg.label && (
                      <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">
                        {cfg.label}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Hidden print template */}
      <div className="hidden">
        <ComponentToPrint
          ref={componentRef}
          price={price}
          name={seller}
          date={datetime_format(new Date())}
          uuid={uuid + "Ticket"}
        />
      </div>
    </div>
  );
}

// ─── Page: Sale + Config tabs (Config is Admin-only) ─────────────────────────

export default function Ticket() {
  const role = (typeof localStorage !== "undefined" && localStorage.getItem("role")) || "";
  const isAdmin = role === "Admin";

  // Non-admins (Sale role) only ever see the sale screen — no tabs.
  if (!isAdmin) return <TicketSale />;

  return (
    <Tabs defaultValue="sale" className="space-y-4">
      <TabsList>
        <TabsTrigger value="sale" className="gap-2">
          <TicketIcon className="h-4 w-4" /> លក់សំបុត្រ
        </TabsTrigger>
        <TabsTrigger value="config" className="gap-2">
          <Settings2 className="h-4 w-4" /> កំណត់តម្លៃ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sale">
        <TicketSale />
      </TabsContent>
      <TabsContent value="config">
        <TicketPriceConfigPage />
      </TabsContent>
    </Tabs>
  );
}
