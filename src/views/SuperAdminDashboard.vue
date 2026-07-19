<template>
  <div class="space-y-8 font-sans p-1">
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center space-y-2">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p class="text-sm font-semibold text-slate-500">جاري تحميل لوحة الإدارة العامة...</p>
      </div>
    </div>

    <template v-else>
      <!-- Top Welcome Title -->
      <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full" />
        <div class="absolute left-1/3 top-10 w-24 h-24 bg-white/5 rounded-full" />
        <div class="relative z-10 space-y-2">
          <div class="inline-flex items-center space-x-2 space-x-reverse bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
            <ShieldCheck class="w-4 h-4 text-emerald-300" />
            <span>بوابة مدير النظام العام للمنصة (Super Admin)</span>
          </div>
          <h1 class="text-3xl font-black">مرحباً بك، عبد الرحمن التميمي</h1>
          <p class="text-sm text-blue-100 max-w-xl font-medium">
            تمنحك هذه اللوحة الإشرافية السيطرة الكاملة على الشركات المشتركة، وإعداد اشتراكاتهم السنوية، وتوليد حسابات المدراء التنفيذيين لجميع الفروع.
          </p>
        </div>
      </div>

      <!-- Grid of Key Platform Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">الشركات المسجلة</p>
            <h4 class="text-2xl font-black text-slate-800 font-mono">{{ companies.length }}</h4>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">المدراء الفعّالين</p>
            <h4 class="text-2xl font-black text-slate-800 font-mono">{{ activeManagers.length }}</h4>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">حجم الاشتراكات الكلية</p>
            <h4 class="text-2xl font-black text-slate-800 font-mono">34,500 ر.س</h4>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Creation of new Enterprise Tenant -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 space-x-reverse border-b border-slate-100 pb-3">
            <Building2 class="w-5 h-5 text-blue-600" />
            <h3 class="text-lg font-bold text-slate-800">تسجيل شركة/مؤسسة جديدة</h3>
          </div>

          <div v-if="successMsg" class="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
            {{ successMsg }}
          </div>
          <div v-if="errMsg" class="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100">
            {{ errMsg }}
          </div>

          <form @submit.prevent="handleCreateCompany" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">اسم المنشأة التجاري</label>
                <input
                  type="text"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: شركة ساب للاتصالات"
                  v-model="name"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-600">باقة الاشتراك</label>
                  <select
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="subscriptionPlan"
                  >
                    <option value="basic">الأساسية (Basic)</option>
                    <option value="premium">المتقدمة (Premium)</option>
                    <option value="enterprise">المؤسسات (Enterprise)</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-600">الحد الأقصى للموظفين</label>
                  <input
                    type="number"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="employeeLimit"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center space-x-2 space-x-reverse text-xs"
            >
              <Plus class="w-4 h-4" />
              <span>إرسال وإطلاق تراخيص الشركة</span>
            </button>
          </form>
        </div>

        <!-- Manager Creation -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 space-x-reverse border-b border-slate-100 pb-3">
            <UserPlus class="w-5 h-5 text-indigo-600" />
            <h3 class="text-lg font-bold text-slate-800">تعيين مدير تنفيذي لشركة</h3>
          </div>

          <div v-if="mgrSuccessMsg" class="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
            {{ mgrSuccessMsg }}
          </div>
          <div v-if="mgrErrMsg" class="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100">
            {{ mgrErrMsg }}
          </div>

          <form @submit.prevent="handleCreateManager" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">اسم المدير الكامل</label>
                <input
                  type="text"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أحمد الحارثي"
                  v-model="mgrName"
                />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">المؤسسة التابعة</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="mgrCompanyId"
                >
                  <option v-for="c in companies" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">اسم مستخدم الحساب</label>
                <input
                  type="text"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="manager2"
                  v-model="mgrUsername"
                />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">كلمة المرور الآمنة</label>
                <input
                  type="password"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  v-model="mgrPassword"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-600">البريد الإلكتروني المهني</label>
              <input
                type="email"
                required
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="manager@company.com"
                v-model="mgrEmail"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center space-x-2 space-x-reverse text-xs"
            >
              <Sparkles class="w-4 h-4" />
              <span>إطلاق وتعيين كمدير مرخص</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Directory of Active Platform Enterprises -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center space-x-2 space-x-reverse">
            <Layers class="w-5 h-5 text-slate-700" />
            <h3 class="text-lg font-black text-slate-800 font-sans">دليل الشركات النشطة المشتركة</h3>
          </div>
          <span class="text-xs font-bold text-slate-400">إجمالي السجلات: {{ companies.length }} سجل</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-sm">
            <thead class="bg-slate-50 text-slate-500 font-black text-xs border-b border-slate-100">
              <tr>
                <th class="p-4">اسم المنشأة</th>
                <th class="p-4">باقة الاشتراك</th>
                <th class="p-4">سقف المستخدمين</th>
                <th class="p-4">المدير المسؤول</th>
                <th class="p-4">تاريخ التأسيس</th>
                <th class="p-4 text-center">حالة الحساب</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
              <tr v-for="c in companies" :key="c.id" class="hover:bg-slate-50/50 transition duration-150">
                <td class="p-4">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                      🏢
                    </div>
                    <span class="font-bold text-slate-800">{{ c.name }}</span>
                  </div>
                </td>
                <td class="p-4 text-xs font-bold">
                  <span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full">
                    {{
                      c.subscriptionPlan === "enterprise"
                        ? "مؤسسات (Enterprise)"
                        : c.subscriptionPlan === "premium"
                        ? "متقدمة (Premium)"
                        : "أساسية (Basic)"
                    }}
                  </span>
                </td>
                <td class="p-4 font-mono text-xs">{{ c.employeeLimit }} موظفاً</td>
                <td class="p-4 text-xs text-slate-500">
                  <span v-if="getManagerForCompany(c.id)" class="text-slate-800 font-bold">
                    {{ getManagerForCompany(c.id).name }}
                  </span>
                  <span v-else class="text-red-500 font-bold">لم يعين بعد</span>
                </td>
                <td class="p-4 text-xs text-slate-400 font-mono">
                  <div class="flex items-center space-x-1.5 space-x-reverse">
                    <Calendar class="w-3.5 h-3.5 text-slate-300" />
                    <span>{{ formatDate(c.createdAt) }}</span>
                  </div>
                </td>
                <td class="p-4 text-center">
                  <span class="inline-flex items-center space-x-1 space-x-reverse text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>نشط ومرخص</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Company, User } from "../types";
import { Building2, Plus, Sparkles, UserPlus, Layers, ShieldCheck, DollarSign, Calendar } from "lucide-vue-next";
import { formatDate } from "../utils";

const props = defineProps<{
  token: string;
}>();

const companies = ref<Company[]>([]);
const users = ref<User[]>([]);
const loading = ref(true);

const name = ref("");
const subscriptionPlan = ref<"basic" | "premium" | "enterprise">("basic");
const employeeLimit = ref(20);
const successMsg = ref("");
const errMsg = ref("");

const mgrName = ref("");
const mgrUsername = ref("");
const mgrPassword = ref("");
const mgrEmail = ref("");
const mgrCompanyId = ref("");
const mgrSuccessMsg = ref("");
const mgrErrMsg = ref("");

const activeManagers = computed(() => {
  return users.value.filter((u) => u.role === "manager");
});

const getManagerForCompany = (companyId: string) => {
  return activeManagers.value.find((u) => u.companyId === companyId);
};

const fetchData = async () => {
  try {
    loading.value = true;
    const [compRes, usrRes] = await Promise.all([
      fetch("/api/companies", { headers: { Authorization: `Bearer ${props.token}` } }),
      fetch("/api/users", { headers: { Authorization: `Bearer ${props.token}` } }),
    ]);

    const compData = await compRes.json();
    const usrData = await usrRes.json();

    if (compRes.ok) companies.value = compData;
    if (usrRes.ok) {
      users.value = usrData;
      if (compData.length > 0) {
        mgrCompanyId.value = compData[0].id;
      }
    }
  } catch (err) {
    console.error("Error loading Super Admin data", err);
  } finally {
    loading.value = false;
  }
};

const handleCreateCompany = async () => {
  errMsg.value = "";
  successMsg.value = "";
  if (!name.value) return;

  try {
    const response = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        name: name.value,
        subscriptionPlan: subscriptionPlan.value,
        employeeLimit: employeeLimit.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "فشل إنشاء الشركة");
    }

    successMsg.value = "✓ تم تسجيل الشركة بنجاح واحتساب الاشتراك تلقائياً!";
    name.value = "";
    employeeLimit.value = 20;
    fetchData();
  } catch (err: any) {
    errMsg.value = err.message || "خطأ في الاتصال بالخادم.";
  }
};

const handleCreateManager = async () => {
  mgrErrMsg.value = "";
  mgrSuccessMsg.value = "";

  if (!mgrName.value || !mgrUsername.value || !mgrPassword.value || !mgrEmail.value || !mgrCompanyId.value) {
    mgrErrMsg.value = "يرجى تعبئة جميع الخانات لإنشاء المدير.";
    return;
  }

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        name: mgrName.value,
        username: mgrUsername.value,
        password: mgrPassword.value,
        email: mgrEmail.value,
        role: "manager",
        companyId: mgrCompanyId.value,
        position: "المدير التنفيذي للمؤسسة",
        salary: 20000,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "فشل تسجيل حساب المدير");
    }

    mgrSuccessMsg.value = "✓ تم تعيين وإنشاء حساب مدير الشركة بنجاح في النظام!";
    mgrName.value = "";
    mgrUsername.value = "";
    mgrPassword.value = "";
    mgrEmail.value = "";
    fetchData();
  } catch (err: any) {
    mgrErrMsg.value = err.message || "فشل في تسجيل المدير.";
  }
};

onMounted(() => {
  fetchData();
});
</script>
