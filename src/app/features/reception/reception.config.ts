export interface ReceptionTab {
  label: string; icon: string; route: string; color: 'blue' | 'red' | 'green';
}

export const RECEPTION_TABS: ReceptionTab[] = [
  { label: 'REGISTRATION', icon: 'fa-table-list', route: 'registration', color: 'blue' },
  { label: 'SEARCH', icon: 'fa-magnifying-glass', route: 'search', color: 'blue' },
  { label: 'RECEPTION', icon: 'fa-mobile-screen', route: 'desk', color: 'blue' },
  { label: 'HANDING OUT', icon: 'fa-phone-volume', route: 'handing-out', color: 'blue' },
  { label: 'SUMMARY', icon: 'fa-table-columns', route: 'summary', color: 'blue' },
  { label: 'PREPARATION', icon: 'fa-list-ul', route: 'preparation', color: 'blue' },
  { label: 'LAB TO LAB', icon: 'fa-flask', route: 'lab-to-lab', color: 'red' },
  { label: 'REG STATUS', icon: 'fa-circle-info', route: 'reg-status', color: 'blue' },
  { label: 'PATIENTS', icon: 'fa-user-injured', route: 'patients', color: 'blue' },
  { label: 'MONEY-BACK', icon: 'fa-credit-card', route: 'money-back', color: 'green' },
];
