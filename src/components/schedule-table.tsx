import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CalendarDays } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ScheduleEntry = {
  day: string;
  startTime: string;
  endTime: string;
};

interface ScheduleTableProps {
  value: ScheduleEntry[];
  onChange: (schedules: ScheduleEntry[]) => void;
}

export const ScheduleTable = ({ value, onChange }: ScheduleTableProps) => {
  const schedules = value || [];

  const addRow = () => {
    onChange([...schedules, { day: "", startTime: "", endTime: "" }]);
  };

  const removeRow = (index: number) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ScheduleEntry, val: string) => {
    const updated = schedules.map((entry, i) =>
      i === index ? { ...entry, [field]: val } : entry
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Class Schedule</span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Slot
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">No schedule slots added yet. Click "Add Slot" to start building the timetable.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left font-medium text-muted-foreground px-3 py-2 w-[35%]">Day</th>
                <th className="text-left font-medium text-muted-foreground px-3 py-2 w-[25%]">Start Time</th>
                <th className="text-left font-medium text-muted-foreground px-3 py-2 w-[25%]">End Time</th>
                <th className="text-center font-medium text-muted-foreground px-3 py-2 w-[15%]">Remove</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((entry, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2">
                    <Select value={entry.day} onValueChange={(val) => updateRow(index, "day", val)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="time"
                      className="h-9"
                      value={entry.startTime}
                      onChange={(e) => updateRow(index, "startTime", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="time"
                      className="h-9"
                      value={entry.endTime}
                      onChange={(e) => updateRow(index, "endTime", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
