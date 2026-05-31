// @ts-nocheck
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus, Pencil, Settings2, Info, X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

// ─── GraphQL ────────────────────────────────────────────────────────────────

const GET_CONFIGS = gql`
  query GetTicketPriceConfigs {
    GetTicketPriceConfigs {
      config_id price label key_image age_group
      facilities { facility_id name code }
    }
  }
`;
const GET_FACILITIES = gql`
  query { facilities { facility_id name code } }
`;
const UPSERT_CONFIG = gql`
  mutation UpsertTicketPriceConfig($price: Float!, $facility_ids: [Float!]!, $label: String, $key_image: String, $age_group: String) {
    UpsertTicketPriceConfig(price: $price, facility_ids: $facility_ids, label: $label, key_image: $key_image, age_group: $age_group) {
      config_id price label key_image age_group
      facilities { facility_id name code }
    }
  }
`;
const DELETE_CONFIG = gql`
  mutation DeleteTicketPriceConfig($config_id: Float!) {
    DeleteTicketPriceConfig(config_id: $config_id)
  }
`;

// ─── Colour palette ──────────────────────────────────────────────────────────

const COLORS: Record<string, { bg: string; badge: string; dot: string; check: string }> = {
  SWIM:  { bg: "bg-blue-50 border-blue-200",   badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-400",   check: "border-blue-400" },
  GYM:   { bg: "bg-green-50 border-green-200",  badge: "bg-green-100 text-green-700",  dot: "bg-green-400",  check: "border-green-400" },
  STEAM: { bg: "bg-orange-50 border-orange-200",badge: "bg-orange-100 text-orange-700",dot: "bg-orange-400", check: "border-orange-400" },
};
const fallback = { bg: "bg-gray-50 border-gray-200", badge: "bg-gray-100 text-gray-700", dot: "bg-gray-400", check: "border-gray-400" };
const color = (code: string) => COLORS[code] ?? fallback;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const dotRow = (facilities: any[]) => (
  <div className="flex flex-wrap gap-1">
    {facilities.map((f) => (
      <span key={f.facility_id} className={`text-xs font-medium px-2 py-0.5 rounded-full ${color(f.code).badge}`}>
        {f.name}
      </span>
    ))}
  </div>
);

// Resize an uploaded image to a small base64 JPEG (keeps DB + transport light).
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function TicketPriceConfigPage() {
  const { data, loading, refetch } = useQuery(GET_CONFIGS, { fetchPolicy: "no-cache" });
  const { data: facilitiesData } = useQuery(GET_FACILITIES);
  const [upsert, { loading: saving }] = useMutation(UPSERT_CONFIG);
  const [deleteConfig] = useMutation(DELETE_CONFIG);

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [price, setPrice] = useState("");
  const [label, setLabel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [keyImage, setKeyImage] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const configs: any[] = data?.GetTicketPriceConfigs ?? [];
  const facilities: any[] = facilitiesData?.facilities ?? [];

  const toggleFacility = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openAdd = () => {
    setEditItem(null);
    setPrice("");
    setLabel("");
    setAgeGroup("");
    setKeyImage("");
    setSelectedIds(new Set());
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setPrice(String(item.price));
    setLabel(item.label ?? "");
    setAgeGroup(item.age_group ?? "");
    setKeyImage(item.key_image ?? "");
    setSelectedIds(new Set(item.facilities.map((f: any) => f.facility_id)));
    setOpen(true);
  };

  const handleSave = async () => {
    if (!price || selectedIds.size === 0) {
      toast("សូមបញ្ចូលតម្លៃ និងជ្រើសរើស Facility យ៉ាងហោចណាស់ 1", { type: "warning" });
      return;
    }
    try {
      await upsert({
        variables: {
          price: parseFloat(price),
          facility_ids: Array.from(selectedIds),
          label: label || undefined,
          age_group: ageGroup || undefined,
          key_image: keyImage || null,
        },
      });
      toast("រក្សាទុកបានជោគជ័យ", { type: "success" });
      setOpen(false);
      refetch();
    } catch (e: any) {
      toast("មានបញ្ហា: " + e.message, { type: "error" });
    }
  };

  const handleDelete = async (config_id: number) => {
    if (!confirm("លុបការកំណត់នេះ?")) return;
    try {
      await deleteConfig({ variables: { config_id } });
      toast("លុបបានជោគជ័យ", { type: "success" });
      refetch();
    } catch (e: any) {
      toast("មានបញ្ហា: " + e.message, { type: "error" });
    }
  };

  // Preview facilities for dialog
  const previewFacilities = facilities.filter((f) => selectedIds.has(f.facility_id));

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Settings2 className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">កំណត់តម្លៃ Ticket</h1>
            <p className="text-sm text-muted-foreground">
              Cashier នឹងឃើញតម្លៃទាំងនេះ — Facility ត្រូវបានកំណត់ដោយស្វ័យប្រវត្តិ
            </p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> បន្ថែមតម្លៃ
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          តម្លៃ Ticket នីមួយៗ អាចភ្ជាប់ជាមួយ Facility ច្រើន —
          ឧទាហរណ៍ $3 = Swimming + Gym។ Cashier គ្រាន់តែចុចតម្លៃ។
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : configs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 gap-3">
          <div className="p-3 bg-muted rounded-full">
            <Settings2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">មិនទាន់មានការកំណត់</p>
          <p className="text-sm text-muted-foreground">ចុច <strong>បន្ថែមតម្លៃ</strong> ដើម្បីចាប់ផ្តើម</p>
          <Button variant="outline" size="sm" onClick={openAdd} className="mt-2 gap-2">
            <Plus className="h-4 w-4" /> បន្ថែម
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {configs.map((c) => {
            const primary = c.facilities[0];
            const col = primary ? color(primary.code) : fallback;
            const isMulti = c.facilities.length > 1;
            return (
              <div
                key={c.config_id}
                className={`relative group rounded-xl border-2 ${col.bg} p-4 flex flex-col items-center gap-2 transition-shadow hover:shadow-md`}
              >
                {/* Hover actions */}
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1 rounded-md bg-white/80 hover:bg-white shadow-sm">
                    <Pencil className="h-3 w-3 text-gray-600" />
                  </button>
                  <button onClick={() => handleDelete(c.config_id)} className="p-1 rounded-md bg-white/80 hover:bg-red-50 shadow-sm">
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>

                {/* Key image */}
                {c.key_image && (
                  <img src={c.key_image} alt="key" className="h-12 w-12 rounded-md object-cover border" />
                )}

                {/* Price */}
                <span className="text-3xl font-black">${c.price}</span>

                {/* Facility badges */}
                <div className="flex flex-wrap justify-center gap-1">
                  {c.facilities.map((f: any) => (
                    <span key={f.facility_id} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color(f.code).badge}`}>
                      {f.name}
                    </span>
                  ))}
                </div>

                {/* Age group */}
                {c.age_group && (
                  <Badge className="text-[10px] px-2 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
                    {c.age_group}
                  </Badge>
                )}

                {/* Label */}
                {c.label && (
                  <span className="text-xs text-muted-foreground text-center">{c.label}</span>
                )}

                {/* Multi-facility indicator */}
                {isMulti && (
                  <Badge variant="outline" className="text-[10px] px-1.5">All Access</Badge>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editItem ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editItem ? "កែតម្លៃ Ticket" : "បន្ថែមតម្លៃ Ticket"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">

            {/* Price */}
            <div className="space-y-1.5">
              <Label>តម្លៃ ($)</Label>
              <Input
                type="number" step="0.5" min="0" placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={!!editItem}
                className="text-lg font-bold"
              />
              {editItem && (
                <p className="text-xs text-muted-foreground">តម្លៃមិនអាចផ្លាស់ប្តូរ — លុបហើយបន្ថែមថ្មី</p>
              )}
            </div>

            {/* Facility multi-select */}
            <div className="space-y-2">
              <Label>Facility (ជ្រើសរើសបានច្រើន)</Label>
              <div className="grid grid-cols-1 gap-2">
                {facilities.map((f) => {
                  const col = color(f.code);
                  const checked = selectedIds.has(f.facility_id);
                  return (
                    <label
                      key={f.facility_id}
                      className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-colors
                        ${checked ? `${col.bg} border-current` : "bg-background border-muted hover:bg-muted/30"}`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleFacility(f.facility_id)}
                      />
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <span className="font-medium text-sm">{f.name}</span>
                    </label>
                  );
                })}
              </div>
              {selectedIds.size === 0 && (
                <p className="text-xs text-destructive">ជ្រើសរើស Facility យ៉ាងហោចណាស់ 1</p>
              )}
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <Label>Label <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                placeholder="e.g. Day Pass, Morning, VIP"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            {/* Age group */}
            <div className="space-y-1.5">
              <Label>ក្រុមអាយុ <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {["កុមារ", "មនុស្សពេញវ័យ", "ចាស់"].map((ag) => (
                  <button
                    key={ag}
                    type="button"
                    onClick={() => setAgeGroup(ageGroup === ag ? "" : ag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                      ${ageGroup === ag
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-background border-muted hover:bg-muted/30 text-muted-foreground"
                      }`}
                  >
                    {ag}
                  </button>
                ))}
                <Input
                  className="h-8 w-32 text-sm"
                  placeholder="ផ្សេងទៀត..."
                  value={!["កុមារ", "មនុស្សពេញវ័យ", "ចាស់", ""].includes(ageGroup) ? ageGroup : ""}
                  onChange={(e) => setAgeGroup(e.target.value)}
                />
              </div>
              {ageGroup && (
                <p className="text-xs text-muted-foreground">ជ្រើស: <strong>{ageGroup}</strong></p>
              )}
            </div>

            {/* Key image upload — shown to check-in staff so they know which key to give */}
            <div className="space-y-1.5">
              <Label>
                រូបកូនសោ (Key) <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              {keyImage ? (
                <div className="relative inline-block">
                  <img src={keyImage} alt="key" className="h-24 w-24 rounded-lg object-cover border" />
                  <button
                    type="button"
                    onClick={() => setKeyImage("")}
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
                      if (file) setKeyImage(await fileToResizedDataUrl(file));
                    }}
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                បុគ្គលិក Check-In នឹងឃើញរូបនេះ ដើម្បីដឹងថាត្រូវផ្តល់កូនសោណា
              </p>
            </div>

            {/* Live preview */}
            {price && selectedIds.size > 0 && (
              <div className="rounded-lg border-2 border-dashed p-3 flex flex-col items-center gap-2 bg-muted/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Preview</p>
                <span className="text-2xl font-black">${price}</span>
                <div className="flex flex-wrap justify-center gap-1">
                  {previewFacilities.map((f) => (
                    <span key={f.facility_id} className={`text-xs font-medium px-2 py-0.5 rounded-full ${color(f.code).badge}`}>
                      {f.name}
                    </span>
                  ))}
                </div>
                {ageGroup && (
                  <Badge className="text-[10px] px-2 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
                    {ageGroup}
                  </Badge>
                )}
                {label && <span className="text-xs text-muted-foreground">{label}</span>}
                {selectedIds.size > 1 && <Badge variant="outline" className="text-[10px]">All Access</Badge>}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>បោះបង់</Button>
            <Button onClick={handleSave} disabled={saving || selectedIds.size === 0}>
              {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
