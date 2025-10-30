import CareChecklist from '../CareChecklist';

export default function CareChecklistExample() {
  const mockItems = [
    "Provide fresh food and water daily",
    "Spend 2-3 hours of social interaction",
    "Clean cage and perches weekly",
    "Regular vet checkups (annually)",
    "Mental stimulation with toys"
  ];

  return (
    <div className="p-6 max-w-md">
      <CareChecklist items={mockItems} />
    </div>
  );
}
