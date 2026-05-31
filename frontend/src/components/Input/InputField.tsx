import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const InputField = ({ value, type, label, readOnly, classNames, onChange }: any) => {
    return (
        <div className={cn("space-y-2", classNames)}>
            <Label className="text-sm font-medium leading-6 text-gray-900">
                {label}
            </Label>
            <Input
                type={type}
                readOnly={readOnly}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default InputField;
