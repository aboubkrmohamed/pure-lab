import { PrivilegeDef, PrivilegeGroup, RoleDef } from '../models/user.model';

const p = (group: PrivilegeGroup, labels: string[]): PrivilegeDef[] =>
  labels.map(label => ({
    key: `${group}.${label.toLowerCase().replace(/\s+/g, '-')}`,
    label,
    group,
  }));

export const PRIVILEGE_GROUPS: { value: PrivilegeGroup; label: string }[] = [
  { value: 'general', label: 'general' },
  { value: 'reg', label: 'reg' },
  { value: 'reports', label: 'reports' },
  { value: 'results', label: 'results' },
  { value: 'sampling', label: 'sampling' },
  { value: 'financial', label: 'financial' },
];

export const PRIVILEGES: PrivilegeDef[] = [
  ...p('reg', [
    'Batch Reg', 'Create Requests', 'View Old Requests', 'Edit Personal Data',
    'Edit Registered Panel', 'Delete Edited Panel', 'Edit Saved Panel List',
    'Patient Preparation', 'Registration Enabled', 'Price Plans Enabled',
    'Contracts Enabled', 'Lab To Lab Enabled', 'Update History',
  ]),
  ...p('reports', [
    'View Expenses', 'Services Report', 'View Cashier Data',
    'View Own Cashier Details', 'Test Statistics', 'Referral Statistics', 'Work Flow',
  ]),
  ...p('results', [
    'Worklist', 'Delta Check', 'Edit Results', 'Print Results', 'Results Enabled',
    'Edit Panel Status', 'Parameter History', 'Print Debted Results',
    'Result Revision', 'Result Verification', 'Edit Verified Results',
    'View Verified Results',
  ]),
  ...p('sampling', [
    'Split Samples', 'Accept Samples', 'Export Samples', 'Reject Samples',
    'Collect Samples', 'Receive Samples', 'Reserve Samples', 'Merge Compatible Samples',
  ]),
  ...p('financial', [
    'Refund', 'Closure', 'Invoice', 'Edit Branch Prices', 'View Installments',
    'Delete Installments', 'View Financial Reports',
  ]),
];

const keysOf = (group: PrivilegeGroup) =>
  PRIVILEGES.filter(x => x.group === group).map(x => x.key);

export const ROLES: RoleDef[] = [
  {
    key: 'financial-officer', label: 'مسئول مالي',
    description: 'كل الصلاحيات المالية + عرض المصروفات',
    privileges: [...keysOf('financial'), 'reports.view-expenses'],
  },
  {
    key: 'tests-editor', label: 'تعديل التحاليل',
    description: 'تعديل النتائج وحالة التحاليل',
    privileges: ['results.edit-results', 'results.edit-panel-status'],
  },
  {
    key: 'tests-statistics', label: 'إحصائيات التحاليل',
    description: 'إحصائيات التحاليل والإحالات',
    privileges: ['reports.test-statistics', 'reports.referral-statistics'],
  },
  {
    key: 'prices', label: 'الأسعار',
    description: 'تعديل أسعار الفرع وخطط الأسعار',
    privileges: ['financial.edit-branch-prices', 'reg.price-plans-enabled'],
  },
];
