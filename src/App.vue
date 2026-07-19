<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col transition-all duration-300">
    <template v-if="!token || !user">
      <Login @login-success="handleLoginSuccess" />
    </template>

    <template v-else>
      <!-- Global Arabic Navigation bar -->
      <header class="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
              <Building class="w-5 h-5" />
            </div>
            <div>
              <span class="block text-sm font-black text-slate-900">نظام الموارد الموحد للشركات</span>
              <span class="block text-[10px] text-slate-400 font-bold">بوابة الأعمال الذكية الآمنة</span>
            </div>
          </div>

          <div class="flex items-center space-x-4 space-x-reverse">
            <!-- Notifications panel toggle button -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition relative"
              >
                <Bell class="w-5 h-5" />
                <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                  {{ unreadCount }}
                </span>
              </button>

              <div v-if="showNotifications" class="absolute left-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-right">
                <div class="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                  <span class="text-xs font-black text-slate-700">التنبيهات والإشعارات</span>
                  <span v-if="unreadCount > 0" class="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">{{ unreadCount }} غير مقروء</span>
                </div>
                <div class="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  <div v-if="notifications.length === 0" class="p-4 text-center text-xs text-slate-400 font-bold">لا توجد إشعارات جديدة حالياً.</div>
                  <div
                    v-else
                    v-for="n in notifications"
                    :key="n.id"
                    @click="handleMarkNotificationRead(n.id)"
                    :class="['p-3 text-xs cursor-pointer hover:bg-slate-50 transition', !n.isRead ? 'bg-blue-50/40' : '']"
                  >
                    <p class="font-bold text-slate-800">{{ n.title }}</p>
                    <p class="text-slate-500 mt-0.5 font-semibold leading-relaxed">{{ n.message }}</p>
                    <span class="text-[9px] text-slate-400 mt-1 block">{{ n.createdAt }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- User credentials summary -->
            <div class="hidden sm:flex items-center space-x-3 space-x-reverse border-r border-slate-100 pr-4">
              <div class="text-right">
                <span class="block text-xs font-black text-slate-900">{{ user.name }}</span>
                <span class="block text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">
                  {{ ROLE_TRANSLATIONS[user.role] || user.role }}
                </span>
              </div>
              <div class="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold font-mono text-slate-700 uppercase">
                {{ user.name.charAt(0) }}
              </div>
            </div>

            <!-- Logout button -->
            <button
              @click="handleLogout"
              class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="تسجيل الخروج الآمن"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Container Stage -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SuperAdminDashboard v-if="user.role === 'super_admin'" :token="token" />
        <ManagerDashboard v-else-if="user.role === 'manager'" :token="token" :current-user="user" />
        <SupervisorDashboard v-else-if="user.role === 'supervisor'" :token="token" :current-user="user" />
        <EmployeeDashboard v-else-if="user.role === 'employee'" :token="token" :current-user="user" />
      </main>

      <!-- Soft branding footer -->
      <footer class="bg-white border-t border-slate-100 py-6 text-center text-xs font-semibold text-slate-400">
        <p>© ٢٠٢٦ نظام الموارد والعمليات الموحد للمؤسسات • جميع الحقوق محفوظة لجهة العمل</p>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { User, Notification } from "./types";
import { authStorage, ROLE_TRANSLATIONS } from "./utils";
import Login from "./views/Login.vue";
import SuperAdminDashboard from "./views/SuperAdminDashboard.vue";
import ManagerDashboard from "./views/ManagerDashboard.vue";
import SupervisorDashboard from "./views/SupervisorDashboard.vue";
import EmployeeDashboard from "./views/EmployeeDashboard.vue";
import { LogOut, Bell, Building } from "lucide-vue-next";

const token = ref<string | null>(null);
const user = ref<User | null>(null);
const notifications = ref<Notification[]>([]);
const showNotifications = ref(false);

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.isRead).length;
});

let intervalId: any = null;

const loadNotifications = async (tok: string) => {
  try {
    const response = await fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (response.ok) {
      notifications.value = await response.json();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleLoginSuccess = (newToken: string, newUser: User) => {
  authStorage.saveSession(newToken, newUser);
  token.value = newToken;
  user.value = newUser;

  loadNotifications(newToken);
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => loadNotifications(newToken), 15000);
};

const handleLogout = () => {
  authStorage.clearSession();
  token.value = null;
  user.value = null;
  notifications.value = [];
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const handleMarkNotificationRead = async (id: string) => {
  if (!token.value) return;
  try {
    await fetch(`/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    notifications.value = notifications.value.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  // Ensure we display Right-to-Left Arabic layouts
  document.documentElement.dir = "rtl";

  const savedToken = authStorage.getToken();
  const savedUser = authStorage.getUser();
  if (savedToken && savedUser) {
    token.value = savedToken;
    user.value = savedUser;
    loadNotifications(savedToken);
    intervalId = setInterval(() => loadNotifications(savedToken), 15000);
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
