import data from "./assets/locations.json";

interface DiningLocation {
  opening_hours: string;
  closing_hours: string;
  open_24: number;
  location_title: string;
  breakfast_menu: string;
  lunch_menu: string;
  dinner_menu: string;
  locations: string;
  livestream_entrance_link: string | null;
  livestream_entrance_text: string | null;
  livestream_seating_link: string | null;
  livestream_seating_text: string | null;
  location_id: number;
  accepted_payment: string;
  short_name: string;
  business_level: number;
  notbusy_level: number;
  moderate_level: number;
  short_description: string;
  short_description_v2: string;
  location_url: string;
  distance: number | null;
  address: string;
  is_new: string;
  map_address: string;
  contact_information: string;
  contact_information_plain: string;
  reservation_information: string;
  reservation_information_plain: string;
  featured_image: string;
}
export type DiningLocations = DiningLocation[];

export const Locations = data.data as DiningLocations;
