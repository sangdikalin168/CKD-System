// @ts-nocheck
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-line";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Plus, TableIcon, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const GET_ALL_PRICES = gql`
  query getAllMemberPriceTable {
    getAllMemberPriceTable {
      id description ageGroup customerType serviceType shift monthQty price entryQty key_image
      facilities { facility_id name code }
    }
  }
`;
const GET_FACILITIES = gql`
  query { facilities { facility_id name code } }
`;
const UPDATE_PRICE = gql`
  mutation UpdatePrice($updatePriceId: Int!, $description: String, $ageGroup: String, $customerType: String, $shift: String, $monthQty: Float, $price: Float, $entryQty: Float, $key_image: String, $facility_ids: [Int!]) {
    updatePrice(id: $updatePriceId, description: $description, ageGroup: $ageGroup, customerType: $customerType, shift: $shift, monthQty: $monthQty, price: $price, entryQty: $entryQty, key_image: $key_image, facility_ids: $facility_ids) {
      id description ageGroup customerType serviceType shift monthQty price entryQty key_image
      facilities { facility_id name code }
    }
  }
`;
const CREATE_PRICE = gql`
  mutation CreateMemberPrice($price: Float!, $customerType: String!, $ageGroup: String!, $description: String!, $shift: String, $entryQty: Float, $monthQty: Float, $key_image: String, $facility_ids: [Int!]) {
    createMemberPrice(price: $price, customerType: $customerType, ageGroup: $ageGroup, description: $description, shift: $shift, entryQty: $entryQty, monthQty: $monthQty, key_image: $key_image, facility_ids: $facility_ids) {
      id description ageGroup customerType serviceType shift monthQty price entryQty key_image
      facilities { facility_id name code }
    }
  }
`;
const DELETE_PRICE = gql`
  mutation DeleteMemberPrice($deleteMemberPriceId: Float!) {
    deleteMemberPrice(id: $deleteMemberPriceId)
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  { value: "Swim",         label: "ហែលទឹក",                code: "SWIM" },
  { value: "SwimGym",      label: "ហែលទឹក + Gym",           code: "SWIMGYM" },
  { value: "SwimSteam",    label: "ហែលទឹក + Steam",          code: "SWIMSTEAM" },
  { value: "SwimGymSteam", label: "ហែលទឹក + Gym + Steam",    code: "ALL" },
];
const AGE_GROUPS    = [{ value: "Kid", label: "តូច (Kid)" }, { value: "Adult", label: "ធំ (Adult)" }];
const CUSTOMER_TYPES = [
  { value: "Full", label: "ពេញ (Full Price)" },
  { value: "Old",  label: "ចាស់ (Existing Member)" },
  { value: "New",  label: "ថ្មី (New Member)" },
];
const SHIFTS = [{ value: "Full", label: "Full" }, { value: "Morning", label: "ព្រឹក (Morning)" }];

// ─── Facility colour palette (mirrors TicketPriceConfig) ─────────────────────

const FACILITY_COLORS: Record<string, { badge: string; dot: string; check: string }> = {
  SWIM:  { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-400",   check: "border-blue-400" },
  GYM:   { badge: "bg-green-100 text-green-700",  dot: "bg-green-400",  check: "border-green-400" },
  STEAM: { badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400", check: "border-orange-400" },
};
const fColor = (code: string) =>
  FACILITY_COLORS[code] ?? { badge: "bg-gray-100 text-gray-700", dot: "bg-gray-400", check: "border-gray-400" };

// ─── Color palette ────────────────────────────────────────────────────────────

const SERVICE_COLORS: Record<string, { bg: string; text: string; badge: string; dot: string }> = {
  Swim:         { bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-400" },
  SwimGym:      { bg: "bg-green-50",  text: "text-green-700",  badge: "bg-green-100 text-green-700",  dot: "bg-green-400" },
  SwimSteam:    { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  SwimGymSteam: { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
};
const svc = (s: string) => SERVICE_COLORS[s] ?? { bg: "bg-gray-50", text: "text-gray-700", badge: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
const svcLabel = (s: string) => SERVICE_TYPES.find((x) => x.value === s)?.label ?? s;
const ageLabel  = (a: string) => a === "Kid" ? "តូច" : "ធំ";
const custLabel = (c: string) => ({ Full: "ពេញ", Old: "ចាស់", New: "ថ្មី" })[c] ?? c;
const shiftLabel = (s: string) => s === "Morning" ? "ព្រឹក" : "Full";

const buildDescription = (f: any) =>
  `${svcLabel(f.serviceType)} ${custLabel(f.customerType)} ${f.monthQty}ខែ ${ageLabel(f.ageGroup)} (${f.price}$)`;

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm = () => ({
  id: 0, description: "", ageGroup: "", customerType: "",
  serviceType: "", shift: "Full", monthQty: 1, price: 0, entryQty: 1, key_image: "",
});

function fileToResizedDataUrl(file: File, maxSize = 512, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize; }
        else if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MemberPriceTable = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRICES);
  const { data: facilitiesData } = useQuery(GET_FACILITIES);
  const [prices, setPrices] = useState<any[]>([]);
  const facilities: any[] = facilitiesData?.facilities ?? [];

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (data?.getAllMemberPriceTable) setPrices(data.getAllMemberPriceTable);
  }, [data]);

  const [updatePrice, { loading: updating }] = useMutation(UPDATE_PRICE, {
    onCompleted: () => { refetch(); setOpen(false); toast("រក្សាទុកបានជោគជ័យ", { type: "success" }); },
    onError: (e) => toast("Error: " + e.message, { type: "error" }),
  });
  const [createPrice, { loading: creating }] = useMutation(CREATE_PRICE, {
    onCompleted: () => { refetch(); setOpen(false); toast("បន្ថែមបានជោគជ័យ", { type: "success" }); },
    onError: (e) => toast("Error: " + e.message, { type: "error" }),
  });
  const [deletePrice] = useMutation(DELETE_PRICE, {
    onCompleted: () => { refetch(); toast("លុបបានជោគជ័យ", { type: "success" }); },
    onError: (e) => toast("Error: " + e.message, { type: "error" }),
  });

  const toggleFacility = (id: number) =>
    setSelectedFacilityIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm());
    setSelectedFacilityIds(new Set());
    setOpen(true);
  };
  const openEdit = (row: any) => {
    setEditItem(row);
    setForm({ ...row });
    setSelectedFacilityIds(new Set((row.facilities ?? []).map((f: any) => f.facility_id)));
    setOpen(true);
  };
  const handleDelete = (id: number) => {
    if (!confirm("លុបការកំណត់នេះ?")) return;
    deletePrice({ variables: { deleteMemberPriceId: id } });
  };

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const { ageGroup, customerType, shift, monthQty, price, entryQty } = form;
    if (!ageGroup || !customerType || !shift || !monthQty || !price || !entryQty || selectedFacilityIds.size === 0) {
      toast("សូមបំពេញព័ត៌មានទាំងអស់ និងជ្រើស Facility យ៉ាងហោចណាស់ 1", { type: "warning" }); return;
    }
    const description = buildDescription(form);
    const key_image = form.key_image || null;
    const facility_ids = Array.from(selectedFacilityIds);
    if (editItem) {
      updatePrice({ variables: { updatePriceId: editItem.id, description, ageGroup, customerType, shift, monthQty: +monthQty, price: +price, entryQty: +entryQty, key_image, facility_ids } });
    } else {
      createPrice({ variables: { description, ageGroup, customerType, shift, monthQty: +monthQty, price: +price, entryQty: +entryQty, key_image, facility_ids } });
    }
  };

  // Rows per service type
  const rowsFor = (serviceType: string) =>
    prices.filter((p) => p.serviceType === serviceType).sort((a, b) => a.price - b.price);

  const PriceTable = ({ serviceType }: { serviceType: string }) => {
    const col = svc(serviceType);
    const rows = rowsFor(serviceType);
    if (rows.length === 0) return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 gap-3">
        <TableIcon className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">មិនទាន់មានការកំណត់</p>
        <Button variant="outline" size="sm" onClick={openAdd} className="gap-2 mt-1">
          <Plus className="h-4 w-4" /> បន្ថែម
        </Button>
      </div>
    );
    return (
      <div className={`rounded-xl border overflow-hidden ${col.bg}`}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">ចំនួនខែ</TableHead>
              <TableHead className="font-semibold">ក្រុមអាយុ</TableHead>
              <TableHead className="font-semibold">អតិថិជន</TableHead>
              <TableHead className="font-semibold">វេន</TableHead>
              <TableHead className="font-semibold">ចំនួនចូល</TableHead>
              <TableHead className="font-semibold text-right">តម្លៃ</TableHead>
              <TableHead className="font-semibold">Facility</TableHead>
              <TableHead className="font-semibold text-center w-16">Key</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="bg-white/60 hover:bg-white/90">
                <TableCell>
                  <span className={`font-semibold ${col.text}`}>{row.monthQty} ខែ</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${row.ageGroup === "Kid" ? "border-pink-300 text-pink-700" : "border-gray-300"}`}>
                    {ageLabel(row.ageGroup)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{custLabel(row.customerType)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">{shiftLabel(row.shift)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{row.entryQty}x</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`text-lg font-black ${col.text}`}>${row.price}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(row.facilities ?? []).map((f: any) => (
                      <span key={f.facility_id} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${fColor(f.code).badge}`}>
                        {f.name}
                      </span>
                    ))}
                    {(!row.facilities || row.facilities.length === 0) && (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {row.key_image ? (
                    <img src={row.key_image} alt="key" className="h-8 w-8 rounded object-cover border mx-auto" />
                  ) : (
                    <span className="text-xs text-muted-foreground/40 block text-center">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => handleDelete(row.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) return <LoadingPage message="Loading..." />;
  if (error) return <div className="p-4 text-destructive">Error: {error.message}</div>;

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <TableIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">តារាងតម្លៃសមាជិក</h1>
            <p className="text-sm text-muted-foreground">គ្រប់គ្រងតម្លៃសមាជិកតាមប្រភេទ / ក្រុមអាយុ / វេន</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> បន្ថែម
        </Button>
      </div>

      {/* Tabs — one per service type */}
      <Tabs defaultValue="Swim" className="space-y-4">
        <TabsList>
          {SERVICE_TYPES.map((st) => {
            const col = svc(st.value);
            const count = rowsFor(st.value).length;
            return (
              <TabsTrigger key={st.value} value={st.value} className="gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                {st.label}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">{count}</Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SERVICE_TYPES.map((st) => (
          <TabsContent key={st.value} value={st.value}>
            <PriceTable serviceType={st.value} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editItem ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editItem ? "កែតម្លៃសមាជិក" : "បន្ថែមតម្លៃសមាជិក"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">

            {/* Facility multi-select */}
            <div className="space-y-2">
              <Label>Facility (ជ្រើសរើសបានច្រើន)</Label>
              <div className="grid grid-cols-1 gap-2">
                {facilities.map((f: any) => {
                  const fc = fColor(f.code);
                  const checked = selectedFacilityIds.has(f.facility_id);
                  return (
                    <label
                      key={f.facility_id}
                      className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-colors
                        ${checked ? `${fc.badge.replace("text-", "bg-").split(" ")[0].replace("bg-", "bg-")} border-current ${fc.badge}` : "bg-background border-muted hover:bg-muted/30"}`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleFacility(f.facility_id)}
                      />
                      <span className={`w-2.5 h-2.5 rounded-full ${fc.dot}`} />
                      <span className="font-medium text-sm">{f.name}</span>
                    </label>
                  );
                })}
              </div>
              {selectedFacilityIds.size === 0 && (
                <p className="text-xs text-destructive">ជ្រើស Facility យ៉ាងហោចណាស់ 1</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age group */}
              <div className="space-y-1.5">
                <Label>ក្រុមអាយុ</Label>
                <div className="flex gap-2">
                  {AGE_GROUPS.map((ag) => (
                    <button
                      key={ag.value}
                      type="button"
                      onClick={() => set("ageGroup", ag.value)}
                      className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors
                        ${form.ageGroup === ag.value
                          ? ag.value === "Kid"
                            ? "bg-pink-50 border-pink-300 text-pink-700"
                            : "bg-gray-100 border-gray-400 text-gray-700"
                          : "bg-background border-muted hover:bg-muted/30 text-muted-foreground"
                        }`}
                    >
                      {ag.value === "Kid" ? "តូច" : "ធំ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift */}
              <div className="space-y-1.5">
                <Label>វេន</Label>
                <div className="flex gap-2">
                  {SHIFTS.map((sh) => (
                    <button
                      key={sh.value}
                      type="button"
                      onClick={() => set("shift", sh.value)}
                      className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors
                        ${form.shift === sh.value
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-background border-muted hover:bg-muted/30 text-muted-foreground"
                        }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer type */}
            <div className="space-y-1.5">
              <Label>ប្រភេទអតិថិជន</Label>
              <div className="grid grid-cols-3 gap-2">
                {CUSTOMER_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => set("customerType", ct.value)}
                    className={`rounded-lg border-2 py-2 text-sm font-medium transition-colors
                      ${form.customerType === ct.value
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-background border-muted hover:bg-muted/30 text-muted-foreground"
                      }`}
                  >
                    {custLabel(ct.value)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>ចំនួនខែ</Label>
                <Input type="number" min="1" step="0.5" value={form.monthQty} onChange={(e) => set("monthQty", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>តម្លៃ ($)</Label>
                <Input type="number" min="0" step="0.5" value={form.price} onChange={(e) => set("price", e.target.value)} className="font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label>ចំនួនចូល</Label>
                <Input type="number" min="1" step="1" value={form.entryQty} onChange={(e) => set("entryQty", e.target.value)} />
              </div>
            </div>

            {/* Key image upload */}
            <div className="space-y-1.5">
              <Label>
                រូបកូនសោ <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              {form.key_image ? (
                <div className="relative inline-block">
                  <img src={form.key_image} alt="key" className="h-24 w-24 rounded-lg object-cover border" />
                  <button
                    type="button"
                    onClick={() => set("key_image", "")}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-1 h-24 w-full rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/30">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">ចុចដើម្បីដាក់រូបកូនសោ</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) set("key_image", await fileToResizedDataUrl(file));
                    }}
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                បុគ្គលិក Check-In នឹងឃើញរូបនេះ ដើម្បីដឹងថាត្រូវផ្តល់កូនសោណា
              </p>
            </div>

            {/* Live preview */}
            {form.serviceType && form.ageGroup && form.customerType && form.price > 0 && (
              <div className={`rounded-lg border-2 border-dashed p-3 ${svc(form.serviceType).bg}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Preview</p>
                <p className={`text-sm font-semibold ${svc(form.serviceType).text}`}>
                  {buildDescription(form)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={updating || creating}>
              បោះបង់
            </Button>
            <Button onClick={handleSave} disabled={updating || creating}>
              {updating || creating ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
