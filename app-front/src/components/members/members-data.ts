export type MemberStatus = 'Online' | 'Offline'

export interface Member {
  id: string
  name: string
  email: string
  avatarUrl: string
  functionTitle: string
  functionDept: string
  status: MemberStatus
  employed: string // DD/MM/YY
}

export const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Alexa Liras',
    email: 'alexa@creative-tim.com',
    avatarUrl: 'https://i.pravatar.cc/40?img=1',
    functionTitle: 'Programator',
    functionDept: 'Developer',
    status: 'Offline',
    employed: '23/04/18',
  },
  {
    id: '2',
    name: 'Laurent Perrier',
    email: 'laurent@creative-tim.com',
    avatarUrl: 'https://i.pravatar.cc/40?img=2',
    functionTitle: 'Executive',
    functionDept: 'Projects',
    status: 'Offline',
    employed: '19/09/17',
  },
  {
    id: '3',
    name: 'Richard Gran',
    email: 'richard@creative-tim.com',
    avatarUrl: 'https://i.pravatar.cc/40?img=3',
    functionTitle: 'Manager',
    functionDept: 'Executive',
    status: 'Offline',
    employed: '04/10/21',
  },
  {
    id: '4',
    name: 'John Michael',
    email: 'john@creative-tim.com',
    avatarUrl: 'https://i.pravatar.cc/40?img=4',
    functionTitle: 'Manager',
    functionDept: 'Organization',
    status: 'Online',
    employed: '23/04/18',
  },
  {
    id: '5',
    name: 'Michael Levi',
    email: 'michael@creative-tim.com',
    avatarUrl: 'https://i.pravatar.cc/40?img=5',
    functionTitle: 'Programator',
    functionDept: 'Developer',
    status: 'Online',
    employed: '24/12/08',
  },
]

export const PAGE_SIZE = 5
