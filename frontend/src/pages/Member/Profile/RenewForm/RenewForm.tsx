// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useCreateCustomerPaymentMutation } from "../../../../generated/graphql";
import { TypeOptions, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { MemberInvoice } from "../../../../components/ComponentToPrint/MemberInvoice";
import { DateTimePicker } from "../../../../components/DateTimePicker/DateTimePicker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const notify = (message: string, auto_Close: boolean | number, toastType: TypeOptions) => {
  if (!toast.isActive("alert")) {
    toast(message, { autoClose: auto_Close ? 500 : false, toastId: "alert", type: toastType });
  }
};

const date_format = (date_time: Date) => new Date(date_time).toLocaleDateString("fr-CA");
const datetime_format = (date_time: Date) =>
  new Date(date_time).toLocaleDateString("fr-CA") + " " + new Date(date_time).toLocaleTimeString();

const ageLabel  = (a: string) => a === "Kid" ? "តូច" : "ធំ";
const shiftLabel = (s: string) => s === "Morning" ? "ព្រឹក" : "Full";

// ─── Facility colour palette ──────────────────────────────────────────────────

const FACILITY_COLORS: Record<string, { badge: string; dot: string }> = {
  SWIM:  { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-400" },
  GYM:   { badge: "bg-green-100 text-green-700",  dot: "bg-green-400" },
  STEAM: { badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
};
const fColor = (code: string) => FACILITY_COLORS[code] ?? { badge: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const GET_ALL_PRICES = gql`
  query getAllMemberPriceTable {
    getAllMemberPriceTable {
      id description ageGroup customerType shift monthQty price entryQty key_image
      facilities { facility_id name code }
    }
  }
`;

// ─── RenewForm ────────────────────────────────────────────────────────────────

export const RenewForm = (props: any) => {
  const { data: price_table, loading } = useQuery(GET_ALL_PRICES, { fetchPolicy: "no-cache" });

  const [selectedPrice, setSelectedPrice] = useState<any | null>(null);
  const [age, setAge]     = useState("Adult");
  const [shift, setShift] = useState("Full");
  const [monthQty, setMonthQty] = useState<number | null>(null);

  const allPrices: any[] = price_table?.getAllMemberPriceTable ?? [];

  // Derive dynamic month options from DB
  const monthOptions = [...new Set(allPrices.map((p) => p.monthQty))].sort((a, b) => a - b);

  const filtered = allPrices.filter((p) =>
    p.ageGroup === age &&
    p.shift === shift &&
    (monthQty === null || p.monthQty === monthQty)
  );

  const FilterChip = ({ active, onClick, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors
        ${active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-muted text-muted-foreground hover:border-primary/50"
        }`}
    >
      {children}
    </button>
  );

  return (
    <Dialog open={props.open_member} onOpenChange={props.setOpenMember}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>តារាងតម្លៃសមាជិក</DialogTitle>
        </DialogHeader>

        {selectedPrice ? (
          /* ── Confirm step ── */
          <ConfirmModal
            price={selectedPrice}
            old_end={props.details?.end_membership_date}
            customer_id={props.details?.customer_id}
            user_id={parseInt(localStorage.getItem("user_id"))}
            customer_name={props.details?.customer_name}
            phone={props.details?.phone}
            refetchMemberDetail={props.refetchMemberDetail}
            refetch={props.refechMemberPayment}
            setOpenMember={props.setOpenMember}
            onBack={() => setSelectedPrice(null)}
          />
        ) : (
          /* ── Price picker step ── */
          <div className="space-y-4">

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Age */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">វ័យ:</span>
                <FilterChip active={age === "Adult"} onClick={() => setAge("Adult")}>ធំ</FilterChip>
                <FilterChip active={age === "Kid"}   onClick={() => setAge("Kid")}>តូច</FilterChip>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Shift */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">វេន:</span>
                <FilterChip active={shift === "Full"}    onClick={() => setShift("Full")}>Full</FilterChip>
                <FilterChip active={shift === "Morning"} onClick={() => setShift("Morning")}>ព្រឹក</FilterChip>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Month qty — dynamic from DB */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">ខែ:</span>
                <FilterChip active={monthQty === null} onClick={() => setMonthQty(null)}>ទាំងអស់</FilterChip>
                {monthOptions.map((m) => (
                  <FilterChip key={m} active={monthQty === m} onClick={() => setMonthQty(m)}>
                    {m}ខែ
                  </FilterChip>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price list */}
            {loading ? (
              <div className="space-y-2">
                {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                គ្មានតម្លៃត្រូវនឹងការជ្រើស
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="w-10">Key</span>
                  <span>Promotion</span>
                  <span className="text-center">Facility</span>
                  <span className="text-right w-16">ខែ</span>
                  <span className="text-right w-16">តម្លៃ</span>
                </div>
                <Separator />
                {filtered.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPrice(p)}
                    className={`w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-left
                      hover:bg-primary/5 hover:border-l-2 hover:border-l-primary transition-all cursor-pointer
                      ${i !== 0 ? "border-t" : ""}`}
                  >
                    {/* Key image */}
                    <div className="w-10">
                      {p.key_image
                        ? <img src={p.key_image} alt="key" className="h-8 w-8 rounded object-cover border" />
                        : <div className="h-8 w-8 rounded bg-muted" />
                      }
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium leading-tight">{p.description || "—"}</p>
                      <p className="text-xs text-muted-foreground">{ageLabel(p.ageGroup)} · {shiftLabel(p.shift)}</p>
                    </div>

                    {/* Facility badges */}
                    <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                      {p.facilities?.map((f: any) => (
                        <span key={f.facility_id} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${fColor(f.code).badge}`}>
                          {f.name}
                        </span>
                      ))}
                    </div>

                    {/* Month */}
                    <span className="text-sm font-semibold text-right w-16">{p.monthQty}ខែ</span>

                    {/* Price */}
                    <span className="text-lg font-black text-primary text-right w-16">${p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            props.setOpenMember(false);
            setSelectedPrice(null);
          }}>
            បោះបង់
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Confirm step ─────────────────────────────────────────────────────────────

const ConfirmModal = (props: any) => {
  const { price: selectedPrice, old_end } = props;

  const getRenewalDate = (effectiveDate: Date, month_qty: number) => {
    const today = new Date();
    if (month_qty === 1.5) {
      const base = effectiveDate < today ? new Date(today) : new Date(effectiveDate);
      base.setDate(base.getDate() + 15);
      base.setMonth(base.getMonth() + 1);
      return base;
    }
    const base = effectiveDate < today ? new Date(today) : new Date(effectiveDate);
    base.setMonth(base.getMonth() + month_qty);
    return base;
  };

  const oldEndDate = new Date(old_end);
  const [start_date, setStartDate] = useState(date_format(new Date()));
  const [renewalDate, setRenewalDate] = useState(getRenewalDate(oldEndDate, selectedPrice.monthQty));
  const [payment_id, setPaymentID] = useState(0);
  const [showDateTo, setShowDateTo] = useState(false);

  const [createMemberPayment] = useCreateCustomerPaymentMutation();
  const componentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePrint1 = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent(url, (response: any) => { console.log("Main:", response); });
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe) => { await handlePrint1(printIframe); },
  });

  useEffect(() => {
    if (payment_id > 0) {
      buttonRef.current?.click();
      props.setOpenMember(false);
    }
  }, [payment_id]);

  const CalculateNewEnd = (effectiveDate: Date, month_qty: number) => {
    const d = new Date(effectiveDate);
    d.setMonth(d.getMonth() + month_qty);
    return d;
  };

  const handleChangeStartDate = (selectedDate: Date) => {
    setStartDate(date_format(selectedDate));
    setRenewalDate(CalculateNewEnd(selectedDate, selectedPrice.monthQty));
  };

  const handleSubmit = async () => {
    const result = await createMemberPayment({
      variables: {
        monthQty: selectedPrice.monthQty,
        shift: selectedPrice.shift,
        newEnd: date_format(renewalDate),
        oldEnd: old_end,
        price: selectedPrice.price,
        promotion: selectedPrice.description,
        customerId: props.customer_id,
        userId: props.user_id,
        startDate: start_date,
      },
    });
    if (result.data?.CreateCustomerPayment.success) {
      setPaymentID(result.data.CreateCustomerPayment.payment_id);
      notify("Success", true, "success");
      props.refetch();
      props.refetchMemberDetail();
      return;
    }
    notify("Failed", true, "error");
  };

  return (
    <div className="space-y-5">
      {/* Hidden print button */}
      <button className="hidden" ref={buttonRef} type="button" onClick={handlePrint} />

      {/* Selected price summary card */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
        {selectedPrice.key_image && (
          <img src={selectedPrice.key_image} alt="key" className="h-14 w-14 rounded-lg object-cover border" />
        )}
        <div className="flex-1">
          <div className="text-2xl font-black text-primary">${selectedPrice.price}</div>
          <div className="text-sm text-muted-foreground">
            {selectedPrice.monthQty}ខែ · {shiftLabel(selectedPrice.shift)} · {ageLabel(selectedPrice.ageGroup)}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedPrice.facilities?.map((f: any) => (
              <span key={f.facility_id} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${fColor(f.code).badge}`}>
                {f.name}
              </span>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={props.onBack} className="text-muted-foreground">
          ← ផ្លាស់ប្តូរ
        </Button>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground mb-1">សុពលភាពចាស់</p>
          <p className="text-lg font-semibold">{old_end}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground mb-1">សុពលភាពថ្មី</p>
          <p className="text-lg font-semibold text-primary">{date_format(renewalDate)}</p>
        </div>
      </div>

      {/* Start date picker */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">ថ្ងៃចាប់ផ្តើម:</span>
        <div className="relative">
          <Button variant="outline" size="sm" type="button">
            {start_date}
          </Button>
          <DateTimePicker
            onChange={handleChangeStartDate}
            value={start_date}
            show={showDateTo}
            setShow={setShowDateTo}
            classNames={"top-[-62px]"}
          />
        </div>
        <span className="text-sm text-muted-foreground">→</span>
        <span className="text-sm font-semibold">{date_format(renewalDate)}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={props.onBack}>← ត្រឡប់</Button>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
          យល់ព្រម
        </Button>
      </div>

      {/* Hidden print template */}
      <div className="hidden">
        <MemberInvoice
          ref={componentRef}
          invoice_id={payment_id}
          payment_date={datetime_format(new Date())}
          cashier={localStorage.getItem("display_name")}
          c_name={props.customer_name}
          phone={props.phone}
          promotion={selectedPrice.description}
          price={selectedPrice.price}
          start_date={start_date}
          old_end={old_end}
          new_end={date_format(renewalDate)}
          shift={selectedPrice.shift}
        />
      </div>
    </div>
  );
};
