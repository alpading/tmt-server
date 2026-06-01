import { 
  Mountain, 
  ParkingCircle, 
  Accessibility, 
  Baby, 
  CreditCard, 
  Dog, 
  Info,
  Flame,
  User as UserIcon,
  Soup,
  Coffee,
  FlameKindling,
  Tv,
  Bath,
  Armchair,
  Monitor,
  XCircle,
  Users
} from 'lucide-react';
import { PlaceAttribute } from '../types';

interface AttributeSectionProps {
  attributes?: PlaceAttribute[];
}

const attributeIconMap: Record<string, any> = {
  indoor_outdoor: Mountain,
  parking: ParkingCircle,
  wheelchair_access: Accessibility,
  kids_allowed: Baby,
  price_type: CreditCard,
  pet_allowed: Dog,
  spicy_food: Flame,
  solo_space: UserIcon,
  cooking: Soup,
  breakfast: Coffee,
  bbq: FlameKindling,
  tv: Tv,
  bath: Bath,
  floor_seats: Armchair,
  bar_table: Monitor,
  room: XCircle,
  group_seats: Users
};

export default function AttributeSection({ attributes }: AttributeSectionProps) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {attributes.map((attr, idx) => {
        const IconComponent = (attr.key && attributeIconMap[attr.key]) || Info;
        return (
          <div key={idx} className="flex gap-4 items-start p-4 rounded-xl hover:bg-neutral-50 transition-colors group" id={`attr-${attr.key || idx}`}>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
              <IconComponent className="w-5 h-5 transition-colors" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{attr.label}</p>
              <p className="font-bold text-neutral-900 text-sm md:text-base">{attr.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
