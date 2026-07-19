<template>
  <div class="space-y-8 font-sans p-1">
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center space-y-2">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p class="text-sm font-semibold text-slate-500">جاري تحميل لوحة المشرف المالي والإداري...</p>
      </div>
    </div>

    <template v-else>
      <!-- Arabic Supervisor Welcome Banner -->
      <div class="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full" />
        <div class="relative z-10 space-y-2">
          <div class="inline-flex items-center space-x-2 space-x-reverse bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
            <ShieldCheck class="w-4 h-4 text-sky-300" />
            <span>بوابة الإشراف والمتابعة الإدارية للقسم</span>
          </div>
          <h1 class="text-3xl font-black">مرحباً بك، {{ currentUser.name }}</h1>
          <p class="text-sm text-slate-300 max-w-xl font-medium">
            بصفتك <span class="font-bold underline text-white">مشرفاً لقسم تقنية المعلومات</span>، يمكنك مراجعة المهام المنجزة وإعطاء توجيهات الاعتماد أو طلب التعديلات من الموظفين فوراً.
          </p>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">موظفي القسم الفعليين</p>
            <h4 class="text-2xl font-black text-slate-800 font-mono">{{ employees.length }}</h4>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <FileText class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">مهام بانتظار مراجعتك</p>
            <h4 class="text-2xl font-black text-purple-600 font-mono">{{ tasksToReview.length }}</h4>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 space-x-reverse">
          <div class="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400">المهام المغلقة للقسم</p>
            <h4 class="text-2xl font-black text-emerald-600 font-mono">
              {{ tasks.filter((t) => t.status === TaskStatus.COMPLETED).length }}
            </h4>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-200 space-x-4 space-x-reverse pb-1 text-sm font-bold overflow-x-auto">
        <button
          @click="activeTab = 'employees'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'employees' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          موظفو القسم ({{ employees.length }})
        </button>
        <button
          @click="activeTab = 'reviews'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          مراجعة واعتماد المهام ({{ tasksToReview.length }})
        </button>
        <button
          @click="activeTab = 'attendance'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'attendance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          انضباط وحضور موظفي القسم
        </button>
      </div>

      <!-- TAB 1: Employees View -->
      <div v-if="activeTab === 'employees'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-md font-bold text-slate-800">بيانات الكادر البشري بالقسم</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs md:text-sm">
              <thead class="bg-slate-50 text-slate-500 font-black border-b border-slate-100">
                <tr>
                  <th class="p-4">اسم الموظف</th>
                  <th class="p-4">المسمى الوظيفي</th>
                  <th class="p-4">البريد الإلكتروني</th>
                  <th class="p-4 text-center">أحدث تقييم</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr v-for="emp in employees" :key="emp.id" class="hover:bg-slate-50/50">
                  <td class="p-4">
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <div class="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold">
                        👤
                      </div>
                      <span class="font-bold text-slate-800">{{ emp.name }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-xs text-slate-500">{{ emp.position }}</td>
                  <td class="p-4 text-xs font-mono text-slate-400">{{ emp.email }}</td>
                  <td class="p-4 text-center font-mono font-bold text-blue-600">
                    {{ emp.performanceScore ? `${emp.performanceScore}%` : "100%" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-6">
          <ArabicBarChart
            title="توزيع أداء القسم"
            :data="employees.map((emp) => ({
              label: emp.name,
              value: emp.performanceScore || 90,
              color: 'bg-blue-600'
            }))"
          />
        </div>
      </div>

      <!-- TAB 2: Task Reviews -->
      <div v-if="activeTab === 'reviews'" class="space-y-6">
        <h3 class="text-lg font-bold text-slate-800">الطلبات الواردة للمراجعة والاعتماد</h3>

        <div v-if="tasksToReview.length === 0" class="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center text-slate-400 font-bold">
          ✓ لا توجد أي مهمة معلقة تتطلب المراجعة حالياً. جميع مهام الموظفين مغلقة أو قيد العمل!
        </div>

        <div v-else class="space-y-6">
          <div v-for="task in tasksToReview" :key="task.id" class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div class="space-y-1">
                <span class="text-[10px] bg-purple-50 text-purple-700 font-black px-2.5 py-0.5 rounded-full">
                  مهمة بانتظار المراجعة
                </span>
                <h4 class="text-md font-black text-slate-800">{{ task.title }}</h4>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">
                  المكلف بالمهمة: <strong class="text-slate-700">{{ getEmployeeName(task.assignedEmployeeId) }}</strong> • تاريخ التسليم: {{ task.dueDate }}
                </p>
              </div>

              <span :class="['text-xs font-bold px-3 py-1 rounded-full border', PRIORITY_TRANSLATIONS[task.priority]?.color, PRIORITY_TRANSLATIONS[task.priority]?.bg]">
                الأولوية: {{ PRIORITY_TRANSLATIONS[task.priority]?.label || task.priority }}
              </span>
            </div>

            <p class="text-xs text-slate-600 font-semibold leading-relaxed">{{ task.description }}</p>

            <!-- Checklists and logs preview -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
              <div v-if="task.checklist && task.checklist.length > 0" class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <span class="block text-slate-500">قائمة المهام الفرعية المنجزة:</span>
                <div class="space-y-1.5 text-slate-600">
                  <div v-for="item in task.checklist" :key="item.id" class="flex items-center space-x-2 space-x-reverse">
                    <span>{{ item.isCompleted ? "✓" : "○" }}</span>
                    <span :class="item.isCompleted ? 'line-through text-slate-400' : ''">
                      {{ item.text }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="task.attachments && task.attachments.length > 0" class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <span class="block text-slate-500">الملفات والمستندات المرفقة للتسليم:</span>
                <div class="space-y-1 text-blue-600">
                  <a
                    v-for="(file, idx) in task.attachments"
                    :key="idx"
                    :href="file.url"
                    target="_blank"
                    rel="noreferrer"
                    referrerpolicy="no-referrer"
                    class="block truncate hover:underline"
                  >
                    🔗 {{ file.name }} ({{ file.size }})
                  </a>
                </div>
              </div>
            </div>

            <!-- Action form -->
            <div class="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="text"
                v-model="reviewNotes[task.id]"
                placeholder="أدخل مذكرات المراجعة أو ملاحظات التعديل..."
                class="flex-1 bg-slate-50 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
              <div class="flex space-x-2 space-x-reverse text-xs font-black">
                <button
                  @click="handleReviewTask(task.id, true, reviewNotes[task.id] || '')"
                  class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                >
                  اعتماد وقبول التسليم (Approve)
                </button>
                <button
                  @click="handleReviewTask(task.id, false, reviewNotes[task.id] || '')"
                  class="px-5 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
                >
                  طلب تعديلات وإعادة (Reject)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: Attendance Logs -->
      <div v-if="activeTab === 'attendance'" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 class="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">سجل الحضور اليومي للموظفين</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs md:text-sm">
            <thead class="bg-slate-50 text-slate-500 font-black border-b border-slate-100">
              <tr>
                <th class="p-3">اسم الموظف</th>
                <th class="p-3">التاريخ</th>
                <th class="p-3">تسجيل حضور</th>
                <th class="p-3">تسجيل انصراف</th>
                <th class="p-3">ساعات العمل</th>
                <th class="p-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
              <template v-for="att in attendance" :key="att.id">
                <tr v-if="getEmployeeObj(att.employeeId)" class="hover:bg-slate-50/50">
                  <td class="p-3 font-bold text-slate-800">{{ getEmployeeObj(att.employeeId).name }}</td>
                  <td class="p-3 font-mono">{{ att.date }}</td>
                  <td class="p-3 font-mono text-slate-500">{{ att.clockIn || "--:--" }}</td>
                  <td class="p-3 font-mono text-slate-500">{{ att.clockOut || "--:--" }}</td>
                  <td class="p-3 font-mono">
                    {{ att.workingHours ? `${att.workingHours} ساعة` : "--" }}
                  </td>
                  <td class="p-3 text-center">
                    <span
                      :class="['text-[10px] font-black px-2.5 py-0.5 rounded-full', att.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100']"
                    >
                      {{ att.status === "present" ? "حاضر بالوقت" : "متأخر" }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { User, Task, DailyEvaluation, Attendance, TaskStatus } from "../types";
import { PRIORITY_TRANSLATIONS } from "../utils";
import { Users, FileText, CheckCircle2, ShieldCheck } from "lucide-vue-next";
import ArabicBarChart from "../components/ArabicBarChart.vue";

const props = defineProps<{
  token: string;
  currentUser: User;
}>();

const employees = ref<User[]>([]);
const tasks = ref<Task[]>([]);
const evaluations = ref<DailyEvaluation[]>([]);
const attendance = ref<Attendance[]>([]);
const loading = ref(true);

const activeTab = ref<"employees" | "reviews" | "attendance">("employees");
const reviewNotes = ref<Record<string, string>>({});

const tasksToReview = computed(() => {
  return tasks.value.filter((t) => t.status === TaskStatus.UNDER_REVIEW);
});

const getEmployeeName = (id: string) => {
  const emp = employees.value.find((u) => u.id === id);
  return emp ? emp.name : "موظف";
};

const getEmployeeObj = (id: string) => {
  return employees.value.find((u) => u.id === id);
};

const fetchData = async () => {
  try {
    loading.value = true;
    const headers = { Authorization: `Bearer ${props.token}` };
    const [usrRes, taskRes, evalRes, attRes] = await Promise.all([
      fetch("/api/users", { headers }),
      fetch("/api/tasks", { headers }),
      fetch("/api/evaluations", { headers }),
      fetch("/api/attendance", { headers }),
    ]);

    if (usrRes.ok) {
      const uList: User[] = await usrRes.json();
      employees.value = uList.filter(
        (u) => u.departmentId === props.currentUser.departmentId && u.role === "employee"
      );
    }
    if (taskRes.ok) tasks.value = await taskRes.json();
    if (evalRes.ok) evaluations.value = await evalRes.json();
    if (attRes.ok) attendance.value = await attRes.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleReviewTask = async (taskId: string, approve: boolean, note: string) => {
  const finalStatus = approve ? TaskStatus.COMPLETED : TaskStatus.REJECTED;
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ status: finalStatus }),
    });

    if (response.ok) {
      if (note) {
        await fetch(`/api/tasks/${taskId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify({ text: `تنويه المراجع/المشرف: ${note}` }),
        });
      }
      reviewNotes.value[taskId] = "";
      fetchData();
      alert(
        approve
          ? "✓ تم اعتماد وإغلاق المهمة كمنجزة بنجاح!"
          : "✓ تم رفض المهمة وإعادتها للموظف للتعديل مع التنويه."
      );
    }
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchData();
});
</script>
