import { Person } from './person.entity';

const avatar = (n: number) => `https://i.pravatar.cc/100?img=${n}`;

function handleFor(name: string): string {
  return '@' + name.toLowerCase().replace(/[^a-z]+/g, '_');
}

const NAMES: { name: string; following: boolean; img: number }[] = [
  // Followers / following list people
  { name: 'Rodolfo Goode', following: false, img: 11 },
  { name: 'Chiaka Chute', following: true, img: 16 },
  { name: 'Kylee Danford', following: false, img: 5 },
  { name: 'Chantal Shelburne', following: false, img: 20 },
  { name: 'Phyllis Godley', following: true, img: 27 },
  { name: 'Francene Vandyne', following: false, img: 25 },
  { name: 'Tyra Dhillon', following: true, img: 32 },
  { name: 'Edgar Torrey', following: false, img: 51 },
  { name: 'Tynisha Obey', following: false, img: 60 },
  { name: 'Hannah Burress', following: true, img: 45 },
  // "Cooper" people for people-search
  { name: 'Jane Cooper', following: false, img: 5 },
  { name: 'Merrill Cooper', following: false, img: 12 },
  { name: 'Charolette Cooper', following: true, img: 9 },
  { name: 'Jamel Cooper', following: false, img: 33 },
  { name: 'Marielle Cooper', following: true, img: 44 },
  { name: 'Janetta Cooper', following: false, img: 48 },
  { name: 'Krishna Cooper', following: false, img: 31 },
  { name: 'Pedro Cooper', following: true, img: 53 },
  { name: 'Clinton Cooper', following: false, img: 60 },
];

export const PEOPLE: Partial<Person>[] = NAMES.map(({ name, following, img }) => ({
  name,
  handle: handleFor(name),
  avatarUrl: avatar(img),
  following,
}));
