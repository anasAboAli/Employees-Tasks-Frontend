<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-300">
    <div class="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6 relative overflow-hidden">
      <!-- Background Decorative Gradient -->
      <div class="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500" />

      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mb-2">
          <Building class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-black text-slate-800">نظام الموارد الموحد للمؤسسات</h2>
        <p class="text-sm text-slate-500 font-medium">إدارة الموظفين والمهام والأداء الاستراتيجي</p>
      </div>

      <div v-if="error" class="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center space-x-3 space-x-reverse text-sm animate-shake">
        <AlertCircle class="w-5 h-5 shrink-0" />
        <span class="font-semibold">{{ error }}</span>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 block mr-1">اسم المستخدم</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <UserIcon class="w-5 h-5" />
            </span>
            <input
              type="text"
              class="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="أدخل اسم المستخدم (مثال: manager)"
              v-model="username"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 block mr-1">كلمة المرور</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <Lock class="w-5 h-5" />
            </span>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="w-full pr-10 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="أدخل كلمة المرور"
              v-model="password"
            />
            <button
              type="button"
              class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs mr-1">
          <label class="flex items-center space-x-2 space-x-reverse cursor-pointer font-semibold text-slate-600">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>تذكرني على هذا الجهاز</span>
          </label>
          <button
            type="button"
            @click="showForgotModal = true"
            class="font-bold text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] focus:outline-none transition-all duration-150 disabled:opacity-50"
        >
          {{ loading ? "جاري التحقق من الهوية..." : "تسجيل الدخول الآمن" }}
        </button>
      </form>

      <!-- Shortcut Testing Accounts Drawer for fast evaluation -->
      <div class="border-t border-slate-100 pt-6 space-y-3">
        <div class="text-center">
          <span class="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
            حسابات سريعة للاختبار والتقييم
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            @click="handleQuickLogin('admin')"
            class="p-2.5 border border-slate-100 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition text-right flex items-center justify-between"
          >
            <span>المدير العام للنظام</span>
            <span class="text-[10px] font-semibold text-slate-400">admin</span>
          </button>
          <button
            @click="handleQuickLogin('manager')"
            class="p-2.5 border border-slate-100 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition text-right flex items-center justify-between"
          >
            <span>مدير الشركة</span>
            <span class="text-[10px] font-semibold text-slate-400">manager</span>
          </button>
          <button
            @click="handleQuickLogin('supervisor')"
            class="p-2.5 border border-slate-100 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition text-right flex items-center justify-between"
          >
            <span>مشرف القسم</span>
            <span class="text-[10px] font-semibold text-slate-400">supervisor</span>
          </button>
          <button
            @click="handleQuickLogin('employee')"
            class="p-2.5 border border-slate-100 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition text-right flex items-center justify-between"
          >
            <span>موظف تقني</span>
            <span class="text-[10px] font-semibold text-slate-400">employee1</span>
          </button>
        </div>
        <div class="text-center">
          <span class="text-[11px] text-slate-400 font-semibold">
            كلمة المرور الافتراضية لجميع الحسابات هي: <span class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">password</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Forgot Password Dialog -->
    <div v-if="showForgotModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
        <div class="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-full mx-auto">
          <Key class="w-6 h-6" />
        </div>
        <h3 class="text-center text-lg font-bold text-slate-800">استعادة كلمة المرور</h3>
        <p class="text-center text-xs text-slate-500 font-medium">
          أدخل بريدك الإلكتروني المسجل وسيقوم النظام بإرسال رابط تعيين كلمة مرور جديدة آمنة.
        </p>

        <div v-if="forgotSuccess" class="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-center text-xs font-bold border border-emerald-100">
          ✓ تم إرسال رابط إعادة التعيين بنجاح لبريدك الإلكتروني!
        </div>
        <form v-else @submit.prevent="handleForgotPassword" class="space-y-3">
          <input
            type="email"
            required
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            placeholder="name@company.com"
            v-model="forgotEmail"
          />
          <div class="flex space-x-2 space-x-reverse text-xs font-bold pt-2">
            <button
              type="submit"
              class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              إرسال الرابط
            </button>
            <button
              type="button"
              @click="showForgotModal = false"
              class="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { User } from "../types";
import { Lock, User as UserIcon, Building, Key, Eye, EyeOff, AlertCircle } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "loginSuccess", token: string, user: User): void;
}>();

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const error = ref<string | null>(null);
const loading = ref(false);

const showForgotModal = ref(false);
const forgotEmail = ref("");
const forgotSuccess = ref(false);

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = "الرجاء إدخال اسم المستخدم وكلمة المرور.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "خطأ أثناء تسجيل الدخول");
    }

    emit("loginSuccess", data.token, data.user);
  } catch (err: any) {
    error.value = err.message || "اسم المستخدم أو كلمة المرور غير صحيحة.";
  } finally {
    loading.value = false;
  }
};

const handleQuickLogin = (role: string) => {
  let u = "";
  const p = "password";
  if (role === "admin") u = "admin";
  else if (role === "manager") u = "manager";
  else if (role === "supervisor") u = "supervisor";
  else if (role === "employee") u = "employee1";

  username.value = u;
  password.value = p;
};

const handleForgotPassword = () => {
  if (!forgotEmail.value) return;
  forgotSuccess.value = true;
  setTimeout(() => {
    showForgotModal.value = false;
    forgotSuccess.value = false;
    forgotEmail.value = "";
  }, 3000);
};
</script>
