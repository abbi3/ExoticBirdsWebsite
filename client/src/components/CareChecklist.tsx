import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface CareChecklistProps {
  items: string[];
}

export default function CareChecklist({ items }: CareChecklistProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Essential Care Checklist</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3" data-testid={`checklist-item-${index}`}>
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-3 w-3 text-primary" />
              </div>
            </div>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
