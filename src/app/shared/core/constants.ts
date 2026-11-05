import { ModuleCard } from './../ModuleCard ';
export const MODULES: ModuleCard[] = [
  { title: 'لوحة التحكم', description: 'لمحات مجملة عن سير العمل في فروع المعمل', icon: 'dashboard', color: '#7cbdb4', iconColor: '#8bc34a', route: 'dashboard' },
  { title: 'المستخدمون', description: 'التحكم في حسابات المستخدمين وصلاحياتهم', icon: 'account_circle', color: '#f4a7b9', iconColor: '#ef5350', route: 'users' },
  { title: 'الاستقبال', description: 'بحث وإدخال بيانات المرضى والزيارات', icon: 'how_to_reg', color: '#a6aec3', iconColor: '#ab47bc', route: 'reception' },

  { title: 'العينات', description: 'تتبع وبحث أحوال ومواضع العينات', icon: 'science', color: '#e8d5a5', iconColor: '#ab47bc', route: 'samples' },
  { title: 'النتائج', description: 'بحث وتتبع وإدخال النتائج', icon: 'assessment', color: '#a9c8f5', iconColor: '#42a5f5', route: 'results' },
  { title: 'إعدادات', description: 'إعدادات المعمل المختلفة وخصائص الاختبارات', icon: 'settings', color: '#a9d4a5', iconColor: '#26a69a', route: 'settings' },

  { title: 'الأسعار', description: 'بحث وتحرير خطط الأسعار', icon: 'sell', color: '#d3bfb2', iconColor: '#8d6e63', route: 'prices' },
  { title: 'المطالبات', description: 'المطالبات الدورية للعقود والمختبر للمختبر', icon: 'receipt_long', color: '#dcb985', iconColor: '#ffa726', route: 'claims' },
  { title: 'الأمور المالية', description: 'نظرة سريعة على سير العمل في المختبر', icon: 'account_balance_wallet', color: '#e2dea5', iconColor: '#26c6da', route: 'finance' },

  { title: 'التقارير', description: 'سير العمل والتقارير الإحصائية', icon: 'fact_check', color: '#e58f94', iconColor: '#ef5350', route: 'reports' },
  { title: 'العينات الصادرة', description: 'إدارة سير عمل العينات الصادرة إلى المختبرات الخارجية', icon: 'outbox', color: '#9ccbc4', iconColor: '#26a69a', route: 'outgoing-samples' },
  { title: 'قوائم العمل', description: 'قائمة طلبات المرضى حسب معايير البحث المختلفة', icon: 'checklist', color: '#cba9d9', iconColor: '#ab47bc', route: 'worklists' },
];
