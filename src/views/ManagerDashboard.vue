<template>
  <div class="space-y-8 font-sans p-1 text-right">
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center space-y-2">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p class="text-sm font-semibold text-slate-500">جاري تحميل مساحة الإدارة العامة والتحليلات...</p>
      </div>
    </div>

    <template v-else>
      <!-- Premium Welcoming Hero Header Banner -->
      <div class="bg-gradient-to-r from-indigo-800 via-slate-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
        <div class="absolute left-1/3 top-5 w-24 h-24 bg-white/5 rounded-full" />
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 space-x-reverse bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
              <ShieldCheck class="w-4 h-4 text-indigo-300" />
              <span>مساحة الإدارة التنفيذية</span>
            </div>
            <h1 class="text-3xl font-black">مرحباً بك، القائد {{ currentUser.name }}</h1>
            <p class="text-sm text-indigo-100 max-w-xl font-medium">
              المنصب: <span class="font-bold underline">{{ currentUser.position }}</span> • تابع تقدم الموظفين والمشاريع الإدارية، صغ التعاميم الرسمية، واستعن بـ Gemini AI لتقييم الأداء.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-full md:w-80 space-y-3">
            <div class="flex items-center justify-between text-xs font-bold text-indigo-200 border-b border-white/5 pb-2">
              <span class="flex items-center space-x-1 space-x-reverse">
                <Users class="w-4 h-4" />
                <span>إجمالي القوة البشرية</span>
              </span>
              <span class="font-mono bg-indigo-900/40 px-2.5 py-0.5 rounded-full text-white">
                {{ employees.length }} موظف
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center text-xs">
              <div class="bg-white/5 p-2 rounded-xl">
                <span class="block text-[10px] text-indigo-200">المهام الكلية</span>
                <span class="font-black font-mono text-white text-base">{{ tasks.length }}</span>
              </div>
              <div class="bg-white/5 p-2 rounded-xl">
                <span class="block text-[10px] text-indigo-200">الأقسام الفعالة</span>
                <span class="font-black font-mono text-white text-base">{{ departments.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Search and Filter Toolbar -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1">
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="البحث السريع عن موظف، مهمة عمل، مسمى وظيفي..."
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white"
            v-model="searchQuery"
          />
        </div>

        <div class="flex items-center space-x-2 space-x-reverse shrink-0">
          <span class="text-xs font-bold text-slate-400">تصفية العرض:</span>
          <select
            class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            v-model="filterDeptId"
          >
            <option value="all">جميع الأقسام بالمنشأة</option>
            <option v-for="d in departments" :key="d.id" :value="d.id">
              {{ d.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Dashboard Primary Segment Tabs -->
      <div class="flex border-b border-slate-200 space-x-3 space-x-reverse overflow-x-auto pb-1 text-xs md:text-sm font-bold">
        <button
          v-for="tab in tabsList"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['pb-3 px-2 shrink-0 transition-colors', activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800']"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB 1: General Analytical Overview -->
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-3xl border border-indigo-100/30 shadow-xs">
            <span class="text-2xl">📊</span>
            <p class="text-xs text-slate-500 font-bold mt-2">إجمالي الرواتب الشهرية</p>
            <h3 class="text-2xl font-black font-mono text-indigo-900 mt-1">
              {{ formatCurrency(totalSalaries) }}
            </h3>
          </div>

          <div class="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-100/30 shadow-xs">
            <span class="text-2xl">✅</span>
            <p class="text-xs text-slate-500 font-bold mt-2">المهام المنجزة المعتمدة</p>
            <h3 class="text-2xl font-black font-mono text-emerald-900 mt-1">
              {{ completedTasksCount }} / {{ tasks.length }}
            </h3>
          </div>

          <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-3xl border border-amber-100/30 shadow-xs">
            <span class="text-2xl">⏳</span>
            <p class="text-xs text-slate-500 font-bold mt-2">مهام قيد المراجعة والمصادقة</p>
            <h3 class="text-2xl font-black font-mono text-amber-900 mt-1">
              {{ reviewTasksCount }}
            </h3>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-3xl border border-purple-100/30 shadow-xs">
            <span class="text-2xl">🎯</span>
            <p class="text-xs text-slate-500 font-bold mt-2">متوسط كفاءة الكادر الإجمالية</p>
            <h3 class="text-2xl font-black font-mono text-purple-900 mt-1">
              {{ averagePerformance }}%
            </h3>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-md font-bold text-slate-800">حالة مهام العمل ونسبة اكتمالها</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <p class="text-[10px] font-bold text-slate-500">بانتظار العمل</p>
                <h4 class="text-lg font-bold text-slate-800 mt-0.5">
                  {{ tasks.filter((t) => t.status === TaskStatus.PEND).length }}
                </h4>
              </div>
              <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-50 text-center">
                <p class="text-[10px] font-bold text-blue-600">قيد الإنجاز</p>
                <h4 class="text-lg font-bold text-blue-800 mt-0.5">
                  {{ tasks.filter((t) => t.status === TaskStatus.PROG).length }}
                </h4>
              </div>
              <div class="bg-purple-50/50 p-4 rounded-xl border border-purple-50 text-center">
                <p class="text-[10px] font-bold text-purple-600">قيد المراجعة</p>
                <h4 class="text-lg font-bold text-purple-800 mt-0.5">
                  {{ tasks.filter((t) => t.status === TaskStatus.REV).length }}
                </h4>
              </div>
              <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-50 text-center">
                <p class="text-[10px] font-bold text-emerald-600">مكتملة ومقبولة</p>
                <h4 class="text-lg font-bold text-emerald-800 mt-0.5">
                  {{ tasks.filter((t) => t.status === TaskStatus.COMP).length }}
                </h4>
              </div>
            </div>

            <!-- Double charts for visual engagement -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <ArabicBarChart
                title="توزيع كفاءة مهارات العمل"
                :data="[
                  { label: 'دقة المخرجات', value: 88, color: 'bg-indigo-600' },
                  { label: 'السرعة القياسية', value: 82, color: 'bg-indigo-600' },
                  { label: 'الالتزام التقني', value: 92, color: 'bg-indigo-600' },
                  { label: 'روح المبادرة', value: 85, color: 'bg-indigo-600' },
                ]"
              />
              <ArabicBarChart
                title="أكثر الأقسام إنتاجية"
                :data="[
                  { label: 'القسم التقني', value: 95, color: 'bg-emerald-600' },
                  { label: 'التسويق والمبيعات', value: 80, color: 'bg-emerald-600' },
                  { label: 'إدارة العمليات', value: 88, color: 'bg-emerald-600' },
                  { label: 'الموارد البشرية', value: 90, color: 'bg-emerald-600' },
                ]"
              />
            </div>
          </div>

          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-md font-bold text-slate-800">نشاط وموثوقية الحضور الذاتي</h3>
            <p class="text-xs text-slate-400 font-bold leading-relaxed">
              توزيع الحضور اليومي للكادر لمطابقة الالتزام والوصول المباشر في الدوام.
            </p>

            <div class="space-y-4 pt-2 text-xs font-bold text-slate-600">
              <div class="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <span class="text-slate-500">حاضرون بالموعد القياسي:</span>
                <span class="text-emerald-600 font-black font-mono">100%</span>
              </div>
              <div class="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <span class="text-slate-500">سجل الوصول المتأخر:</span>
                <span class="text-amber-600 font-black font-mono">0%</span>
              </div>
              <div class="flex items-center justify-between pb-1">
                <span class="text-slate-500">سجل الغيابات / إجازات معتمدة:</span>
                <span class="text-rose-600 font-black font-mono">0 موظفين</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: Employee Profiles Management -->
      <div v-if="activeTab === 'employees'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-md font-bold text-slate-800">قائمة الكوادر المسجلة بالنظام</h3>
          <button
            @click="openNewEmployeeModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus class="w-4 h-4" />
            <span>تسجيل موظف جديد بالهيكل</span>
          </button>
        </div>

        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs md:text-sm">
              <thead class="bg-slate-50 text-slate-500 font-black border-b border-slate-100">
                <tr>
                  <th class="p-4">الاسم الكامل</th>
                  <th class="p-4">المنصب</th>
                  <th class="p-4">القسم</th>
                  <th class="p-4">الراتب الأساسي</th>
                  <th class="p-4 text-center">أداء تراكمي</th>
                  <th class="p-4 text-center">حالة الخدمة</th>
                  <th class="p-4 text-center">خيارات التعديل</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr v-for="emp in filteredEmployees" :key="emp.id" class="hover:bg-slate-50/50 transition">
                  <td class="p-4">
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <div class="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold">
                        {{ emp.name.charAt(0) }}
                      </div>
                      <div>
                        <span class="block text-slate-800 font-black">{{ emp.name }}</span>
                        <span class="text-[10px] text-slate-400 font-mono">@{{ emp.username }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 text-xs text-slate-500">{{ emp.position }}</td>
                  <td class="p-4 text-xs text-slate-600">
                    {{ departments.find((d) => d.id === emp.departmentId)?.name || "غير محدد" }}
                  </td>
                  <td class="p-4 text-xs text-slate-800 font-mono">{{ formatCurrency(emp.salary) }}</td>
                  <td class="p-4 text-center text-blue-600 font-mono font-bold">
                    {{ emp.performanceScore || 100 }}%
                  </td>
                  <td class="p-4 text-center">
                    <button
                      @click="handleToggleDeactivate(emp)"
                      :class="['inline-flex items-center space-x-1 space-x-reverse text-[10px] font-bold px-2 py-0.5 rounded-full border', emp.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100']"
                    >
                      <span :class="['w-1.5 h-1.5 rounded-full', emp.status === 'active' ? 'bg-emerald-500' : 'bg-red-500']" />
                      <span>{{ emp.status === "active" ? "على رأس العمل" : "موقوف مؤقتاً" }}</span>
                    </button>
                  </td>
                  <td class="p-4 text-center">
                    <div class="inline-flex space-x-1.5 space-x-reverse">
                      <button
                        @click="handleEditEmployee(emp)"
                        class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 class="w-4 h-4" />
                      </button>
                      <button
                        @click="handleDeleteEmployee(emp.id)"
                        class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: Tasks Allocation Engine -->
      <div v-if="activeTab === 'tasks'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-md font-bold text-slate-800">محرك توزيع وإدارة المهام الفنية</h3>
          <button
            @click="openNewTaskModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus class="w-4 h-4" />
            <span>تعيين وإسناد مهمة جديدة</span>
          </button>
        </div>

        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div v-if="filteredTasks.length === 0" class="p-12 text-center text-slate-400 font-bold">
            لا توجد مهام مطابقة لبحثك في النظام.
          </div>

          <div v-else v-for="task in filteredTasks" :key="task.id" class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/20 transition">
            <div class="space-y-2 flex-1">
              <div class="flex items-center space-x-2 space-x-reverse text-[10px] font-bold">
                <span :class="['px-2 py-0.5 rounded-full border', STATUS_TRANSLATIONS[task.status]?.color, STATUS_TRANSLATIONS[task.status]?.bg]">
                  {{ STATUS_TRANSLATIONS[task.status]?.label || task.status }}
                </span>
                <span :class="['px-2 py-0.5 rounded-full border', PRIORITY_TRANSLATIONS[task.priority]?.color, PRIORITY_TRANSLATIONS[task.priority]?.bg]">
                  {{ PRIORITY_TRANSLATIONS[task.priority]?.label || task.priority }}
                </span>
                <span class="text-slate-400">
                  القسم: {{ departments.find((d) => d.id === task.departmentId)?.name || "تقني" }}
                </span>
              </div>
              <h4 class="text-sm font-black text-slate-800">{{ task.title }}</h4>
              <p class="text-xs text-slate-500 line-clamp-1 font-semibold">{{ task.description }}</p>
            </div>

            <div class="flex items-center space-x-6 space-x-reverse text-xs font-bold">
              <div class="text-right">
                <span class="block text-[9px] text-slate-400 font-bold">المكلف بها</span>
                <span class="text-slate-700">
                  {{ employees.find((e) => e.id === task.assignedEmployeeId)?.name || "غير معين" }}
                </span>
              </div>
              <div class="text-right font-mono text-slate-600">
                <span class="block text-[9px] text-slate-400 font-bold">تاريخ التسليم</span>
                <span>{{ task.dueDate }}</span>
              </div>
              <div class="text-center shrink-0">
                <button
                  @click="handleDeleteTask(task.id)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: Daily Evaluations and Smart Review -->
      <div v-if="activeTab === 'evals'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-md font-bold text-slate-800">التقييم المهني اليومي للأعضاء</h3>
            <p class="text-xs text-slate-400 font-semibold leading-relaxed">
              يتيح لك هذا المعالج تقييم أداء كل موظف يومياً وحساب معدل تميزهم التلقائي بشكل دوري.
            </p>
          </div>

          <div v-if="evalSuccessMsg" class="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
            {{ evalSuccessMsg }}
          </div>

          <form @submit.prevent="handleSubmitEvaluation" class="space-y-4 text-xs font-bold">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-slate-600">اختر الموظف للتقييم</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                  v-model="evalEmpId"
                >
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name }} ({{ emp.position }})
                  </option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-slate-600">التاريخ المستهدف</label>
                <input
                  type="date"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  v-model="evalDate"
                />
              </div>
            </div>

            <!-- Sliders for parameters -->
            <div class="space-y-3 pt-2">
              <div class="space-y-1">
                <div class="flex justify-between font-bold text-slate-700">
                  <span>جودة تسليم المهام الفنية (Quality)</span>
                  <span class="font-mono text-blue-600">{{ evalQuality }}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  v-model.number="evalQuality"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between font-bold text-slate-700">
                  <span>سرعة الاستجابة والتنفيذ (Speed)</span>
                  <span class="font-mono text-blue-600">{{ evalSpeed }}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  v-model.number="evalSpeed"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between font-bold text-slate-700">
                  <span>الالتزام والانضباط بالتوجيهات (Commitment)</span>
                  <span class="font-mono text-blue-600">{{ evalCommitment }}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  v-model.number="evalCommitment"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between font-bold text-slate-700">
                  <span>الانضباط بالحضور والانصراف (Attendance)</span>
                  <span class="font-mono text-blue-600">{{ evalAttendance }}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  v-model.number="evalAttendance"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between font-bold text-slate-700">
                  <span>مهارات التواصل والمشاركة الجماعية (Communication)</span>
                  <span class="font-mono text-blue-600">{{ evalCommunication }}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  v-model.number="evalCommunication"
                />
              </div>
            </div>

            <!-- Notes with AI assistant -->
            <div class="space-y-1 pt-3">
              <div class="flex justify-between items-center mr-1">
                <label class="text-slate-600">ملاحظات وتقييم عام للموظف</label>
                <button
                  type="button"
                  @click="handleConsultGeminiReview"
                  :disabled="aiReviewLoading"
                  class="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition flex items-center space-x-1 space-x-reverse"
                >
                  <Sparkles class="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                  <span>{{ aiReviewLoading ? "جاري الاستعانة بـ Gemini..." : "استعن بالذكاء الاصطناعي لوصف الأداء" }}</span>
                </button>
              </div>
              <textarea
                class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                placeholder="صِف كفاءة الموظف لليوم يدوياً أو دع Gemini يصوغ لك فقرة احترافية وبليغة بضغطة زر واحدة..."
                v-model="evalNotes"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 text-xs transition"
            >
              حفظ وإعلان تقييم اليوم
            </button>
          </form>
        </div>

        <div class="space-y-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-center">
            <Award class="w-12 h-12 text-indigo-600 mx-auto" />
            <h3 class="text-md font-bold text-slate-800">منظومة ذكاء الأداء الاستراتيجي</h3>
            <p class="text-xs text-slate-400 font-bold leading-relaxed">
              يقوم النظام بالتقييم التلقائي للأوزان النسبية وربطها بالتقارير الاستشارية التي تصدر للإدارة العليا لتوفير ترقيات وعلاوات عادلة.
            </p>
          </div>
        </div>
      </div>

      <!-- TAB 5: Departments Management -->
      <div v-if="activeTab === 'departments'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-md font-bold text-slate-800">الأقسام الإدارية والتشغيلية المعتمدة</h3>
          <button
            @click="showDeptModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus class="w-4 h-4" />
            <span>تأسيس قسم جديد</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="dept in departments" :key="dept.id" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-2xl">🗂️</span>
              <h4 class="text-md font-black text-slate-800">{{ dept.name }}</h4>
              <p class="text-xs text-slate-500 leading-relaxed font-semibold">{{ dept.description }}</p>
            </div>

            <div class="border-t border-slate-50 pt-3 text-xs font-bold text-slate-600 space-y-1.5">
              <div class="flex justify-between">
                <span>إجمالي المنتمين للقسم:</span>
                <span class="font-mono text-blue-600">
                  {{ employees.filter((e) => e.departmentId === dept.id).length }} موظفاً
                </span>
              </div>
              <div class="flex justify-between">
                <span>المشرف المسؤول:</span>
                <span class="text-slate-800 font-black">
                  {{ employees.find((e) => e.id === dept.managerId)?.name || "لم يعين بعد" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 6: Strategic Projects Progress -->
      <div v-if="activeTab === 'projects'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-md font-bold text-slate-800">خارطة تقدم المشاريع الاستراتيجية</h3>
          <button
            @click="showProjModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus class="w-4 h-4" />
            <span>إطلاق مشروع جديد</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="proj in projects" :key="proj.id" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-bold">
                {{ departments.find((d) => d.id === proj.departmentId)?.name || "القسم الفني والتقني" }}
              </span>
              <span class="text-xs font-mono font-bold text-slate-400">
                تاريخ البدء: {{ proj.startDate }}
              </span>
            </div>

            <h4 class="text-sm font-black text-slate-800">{{ proj.name }}</h4>
            <p class="text-xs text-slate-500 leading-relaxed font-semibold">{{ proj.description }}</p>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-bold text-slate-700">
                <span>نسبة تقدم أعمال المشروع الإجمالية</span>
                <span class="font-mono">{{ getProjectProgress(proj.id) }}%</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  :style="{ width: `${getProjectProgress(proj.id)}%` }"
                />
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-50 pt-2.5">
              <span>المهام المربوطة بالمشروع: {{ tasks.filter((t) => t.projectId === proj.id).length }} مهمة</span>
              <span>موعد التسليم المتوقع: {{ proj.endDate || "مفتوح" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 7: AI Executive Reports Compilation -->
      <div v-if="activeTab === 'reports'" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h3 class="text-lg font-black text-slate-800 flex items-center space-x-2 space-x-reverse">
            <Sparkles class="w-6 h-6 text-indigo-600 animate-pulse" />
            <span>محلل تقارير الأعمال الذكي (Gemini Performance Analytics)</span>
          </h3>
          <p class="text-xs text-slate-400 font-bold leading-relaxed">
            يقوم المعالج الذكي بمراجعة شاملة للبيانات الحالية للشركة (المهام المتأخرة، الحضور اليومي، التقييمات) وتوليد ملخص تنفيذي رفيع المستوى باللغة العربية مخصص لمجلس الإدارة.
          </p>
        </div>

        <button
          @click="handleCompileAIReport"
          :disabled="aiReportLoading"
          class="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 space-x-reverse mx-auto shadow-lg shadow-indigo-200"
        >
          <template v-if="aiReportLoading">
            <Loader2 class="w-4 h-4 animate-spin text-white" />
            <span>جاري معالجة الكفاءة وتجميع البيانات من Gemini...</span>
          </template>
          <template v-else>
            <Sparkles class="w-4.5 h-4.5 text-white" />
            <span>توليد تقرير أداء المؤسسة بالذكاء الاصطناعي</span>
          </template>
        </button>

        <div v-if="aiReportResult" class="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 max-w-3xl mx-auto shadow-inner relative">
          <span class="absolute top-4 left-4 bg-indigo-50 text-indigo-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase">
            بصمة الاستجابة: Gemini AI
          </span>
          <h4 class="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 flex items-center space-x-1.5 space-x-reverse">
            <FileText class="w-4.5 h-4.5 text-indigo-600" />
            <span>الملخص التنفيذي وتوصيات رفع الأداء التشغيلي للمؤسسة</span>
          </h4>
          <p class="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
            {{ aiReportResult }}
          </p>
        </div>
      </div>

      <!-- TAB 8: Corporate Announcements Broadcast -->
      <div v-if="activeTab === 'announcements'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">صياغة ونشر إعلان مؤسسي جديد</h3>

          <form @submit.prevent="handleCreateAnnouncement" class="space-y-4 text-xs font-bold">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-slate-600">عنوان التعميم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تعديل مواعيد العمل الصيفية"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  v-model="annTitle"
                />
              </div>

              <div class="space-y-1">
                <label class="text-slate-600">أولوية التعميم</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  v-model="annPriority"
                >
                  <option value="normal">إعلاني عادي (Normal)</option>
                  <option value="important">تعميم هام (Important)</option>
                  <option value="urgent">عاجل جداً وحرج (Urgent)</option>
                </select>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-slate-600">محتوى وبث الإعلان</label>
              <textarea
                required
                class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold leading-relaxed"
                placeholder="اكتب تفاصيل الإعلان ليتم بثه وإرسال إشعار فوري لجميع لوحات معلومات الكادر بالشركة..."
                v-model="annContent"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 space-x-reverse"
            >
              <Megaphone class="w-4 h-4" />
              <span>بث التعميم فوراً بالنظام</span>
            </button>
          </form>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">التعاميم النشطة حالياً ({{ announcements.length }})</h3>
          <div class="space-y-3 max-h-[300px] overflow-y-auto">
            <div v-for="ann in announcements" :key="ann.id" class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span class="block text-[9px] text-amber-600 font-bold mb-1">الكاتب: {{ ann.createdBy }}</span>
              <h4 class="font-black text-slate-800">{{ ann.title }}</h4>
              <p class="text-slate-500 line-clamp-2 mt-1 font-semibold">{{ ann.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 9: Settings and Branding -->
      <div v-if="activeTab === 'settings'" class="max-w-2xl bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="text-lg font-black text-slate-800 flex items-center space-x-2 space-x-reverse">
            <Settings class="w-5 h-5 text-slate-600" />
            <span>إعدادات المؤسسة والهوية المرئية</span>
          </h3>
          <p class="text-xs text-slate-400 font-bold">تخصيص أوقات العمل الرسمية وأوزان تقييم الأداء.</p>
        </div>

        <div class="space-y-4 text-xs font-bold text-slate-600">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label>اسم المنشأة القانوني</label>
              <input
                type="text"
                disabled
                class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                value="مؤسسة النخبة للحلول التقنية"
              />
            </div>

            <div class="space-y-1">
              <label>الرقم الضريبي الموحد</label>
              <input
                type="text"
                disabled
                class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
                value="300054789124403"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label>وقت الحضور الرسمي الصباحي</label>
              <input
                type="text"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                defaultValue="08:30:00"
              />
            </div>

            <div class="space-y-1">
              <label>وقت الانصراف اليومي المعتمد</label>
              <input
                type="text"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                defaultValue="17:30:00"
              />
            </div>
          </div>

          <button
            @click="alert('✓ تم تحديث إعدادات الشركة بنجاح.')"
            class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition"
          >
            حفظ الهوية ومصفوفة العمليات
          </button>
        </div>
      </div>

      <!-- Employee Modal Form Dialog -->
      <div v-if="showEmployeeModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-right">
          <button
            @click="showEmployeeModal = false"
            class="absolute top-4 left-4 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-md font-black text-slate-800 border-b border-slate-100 pb-2">
            {{ editingEmployee ? "تحديث مسمى ومستحقات الموظف" : "تسجيل موظف جديد بالهيكل الإداري" }}
          </h3>

          <form @submit.prevent="handleSaveEmployee" class="space-y-3 text-xs font-bold text-slate-600">
            <div class="space-y-1">
              <label>الاسم الثلاثي للموظف</label>
              <input
                type="text"
                required
                placeholder="مثال: تركي بن فهد"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                v-model="empName"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>اسم المستخدم</label>
                <input
                  type="text"
                  required
                  placeholder="turki99"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                  v-model="empUsername"
                />
              </div>

              <div class="space-y-1">
                <label>رقم المرور الآمن</label>
                <input
                  type="password"
                  :placeholder="editingEmployee ? 'اترك فارغاً لعدم التغيير' : 'password'"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  v-model="empPassword"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label>البريد الإلكتروني المهني</label>
              <input
                type="email"
                required
                placeholder="name@elite.com"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                v-model="empEmail"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>المنصب والمسمى الوظيفي</label>
                <input
                  type="text"
                  required
                  placeholder="مطور تطبيقات أول"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  v-model="empPosition"
                />
              </div>

              <div class="space-y-1">
                <label>الراتب الشهري الأساسي (SAR)</label>
                <input
                  type="number"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                  v-model.number="empSalary"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>نوع صلاحية الحساب</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                  v-model="empRole"
                >
                  <option :value="UserRole.EMPLOYEE">موظف ممارس (Employee)</option>
                  <option :value="UserRole.SUPERVISOR">مشرف قسم (Supervisor)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label>القسم الإداري المربوط</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                  v-model="empDept"
                >
                  <option v-for="d in departments" :key="d.id" :value="d.id">
                    {{ d.name }}
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-xs"
            >
              {{ editingEmployee ? "حفظ التحديثات والملف" : "تسجيل الموظف بشكل رسمي" }}
            </button>
          </form>
        </div>
      </div>

      <!-- Task Modal Form Dialog -->
      <div v-if="showTaskModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-right overflow-y-auto max-h-[90vh]">
          <button
            @click="showTaskModal = false"
            class="absolute top-4 left-4 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-md font-black text-slate-800 border-b border-slate-100 pb-2">
            إسناد وتكليف مهمة عمل فنية جديدة
          </h3>

          <form @submit.prevent="handleCreateTask" class="space-y-3 text-xs font-bold text-slate-600">
            <div class="space-y-1">
              <label>عنوان المهمة الأساسي</label>
              <input
                type="text"
                required
                placeholder="مثال: ربط واجهات الدفع الإلكتروني"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                v-model="taskTitle"
              />
            </div>

            <div class="space-y-1">
              <label>صياغة وتفاصيل كراسة المهمة</label>
              <textarea
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 text-slate-700"
                placeholder="اكتب المعايير الفنية والمهام التفصيلية المرجوة..."
                v-model="taskDesc"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>الموظف المكلف بها</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                  v-model="taskAssignedTo"
                >
                  <option value="">اختر الموظف...</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-1">
                <label>تاريخ الاستحقاق والتسليم</label>
                <input
                  type="date"
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                  v-model="taskDueDate"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>مستوى أولوية المهمة</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                  v-model="taskPriority"
                >
                  <option :value="TaskPriority.LOW">منخفضة (Low)</option>
                  <option :value="TaskPriority.MEDIUM">متوسطة (Medium)</option>
                  <option :value="TaskPriority.HIGH">عالية الأهمية (High)</option>
                  <option :value="TaskPriority.URGENT">عاجلة جداً وحرجة (Urgent)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label>مشروع المتابعة</label>
                <select
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                  v-model="taskProject"
                >
                  <option v-for="p in projects" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Checklist dynamic builder -->
            <div class="space-y-1.5 pt-1.5">
              <label class="block text-slate-600 font-bold">إضافة قائمة المهام الفرعية (Checklist)</label>
              <div class="flex space-x-1.5 space-x-reverse">
                <input
                  type="text"
                  placeholder="مثال: إتمام مراجعة الأكواد"
                  class="flex-1 bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                  v-model="newCheckItem"
                />
                <button
                  type="button"
                  @click="handleAddChecklist"
                  class="px-3 bg-blue-600 text-white rounded-xl"
                >
                  أضف
                </button>
              </div>
              <div v-if="taskChecklist.length > 0" class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 max-h-[100px] overflow-y-auto">
                <div v-for="(item, idx) in taskChecklist" :key="idx" class="flex items-center justify-between text-[11px] text-slate-700">
                  <span>• {{ item }}</span>
                  <button
                    type="button"
                    @click="handleRemoveChecklist(idx)"
                    class="text-red-500 hover:underline"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            </div>

            <!-- Mandatory delivery file checkbox -->
            <label class="flex items-center space-x-2 space-x-reverse cursor-pointer font-semibold text-slate-600 mr-1 pt-1">
              <input
                type="checkbox"
                v-model="taskReqFiles"
                class="rounded border-slate-300 text-blue-600"
              />
              <span>تتطلب رفع مستند تسليم (PDF/Doc) للاعتماد المباشر</span>
            </label>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-xs"
            >
              تثبيت التكليف وبث المهمة
            </button>
          </form>
        </div>
      </div>

      <!-- Dept Modal Form -->
      <div v-if="showDeptModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-right">
          <button
            @click="showDeptModal = false"
            class="absolute top-4 left-4 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-md font-black text-slate-800 border-b border-slate-100 pb-2">تأسيس قسم تشغيلي جديد</h3>

          <form @submit.prevent="handleCreateDept" class="space-y-3 text-xs font-bold text-slate-600">
            <div class="space-y-1">
              <label>اسم القسم التشغيلي</label>
              <input
                type="text"
                required
                placeholder="قسم البحوث والدراسات"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                v-model="deptName"
              />
            </div>

            <div class="space-y-1">
              <label>أهداف ورسالة القسم</label>
              <textarea
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 text-slate-700 font-semibold"
                placeholder="صِف طبيعة الأنشطة التشغيلية التابعة للقسم..."
                v-model="deptDesc"
              />
            </div>

            <div class="space-y-1">
              <label>تسمية المشرف المباشر المسؤول عن القسم</label>
              <select
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                v-model="deptMgr"
              >
                <option value="">اختر مشرفاً...</option>
                <option v-for="sup in employees.filter((e) => e.role === 'supervisor')" :key="sup.id" :value="sup.id">
                  {{ sup.name }}
                </option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
            >
              تأسيس واعتماد القسم
            </button>
          </form>
        </div>
      </div>

      <!-- Project Modal Form -->
      <div v-if="showProjModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-right">
          <button
            @click="showProjModal = false"
            class="absolute top-4 left-4 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-md font-black text-slate-800 border-b border-slate-100 pb-2">إطلاق مشروع استراتيجي جديد</h3>

          <form @submit.prevent="handleCreateProj" class="space-y-3 text-xs font-bold text-slate-600">
            <div class="space-y-1">
              <label>اسم المشروع التجاري</label>
              <input
                type="text"
                required
                placeholder="نظام التحول الرقمي الداخلي"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                v-model="projName"
              />
            </div>

            <div class="space-y-1">
              <label>كراسة وأهداف الخطة العامة</label>
              <textarea
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 text-slate-700 font-semibold"
                placeholder="صِف طبيعة الأنشطة التشغيلية التابعة للقسم..."
                v-model="projDesc"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label>تاريخ إطلاق المشروع</label>
                <input
                  type="date"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  v-model="projStart"
                />
              </div>

              <div class="space-y-1">
                <label>تاريخ التسليم النهائي</label>
                <input
                  type="date"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  v-model="projEnd"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label>ربطه بقسم تشغيلي مسؤول</label>
              <select
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold"
                v-model="projDept"
              >
                <option v-for="d in departments" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
            >
              بث وإطلاق المشروع الاستراتيجي
            </button>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { User, Task, Department, Project, DailyEvaluation, Announcement, UserRole, TaskStatus, TaskPriority } from "../types";
import { STATUS_TRANSLATIONS, PRIORITY_TRANSLATIONS, formatCurrency } from "../utils";
import {
  ShieldCheck,
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  Award,
  Sparkles,
  Loader2,
  FileText,
  Megaphone,
  Settings
} from "lucide-vue-next";
import ArabicBarChart from "../components/ArabicBarChart.vue";

const props = defineProps<{
  token: string;
  currentUser: User;
}>();

const loading = ref(true);
const activeTab = ref("overview");

const employees = ref<User[]>([]);
const tasks = ref<Task[]>([]);
const departments = ref<Department[]>([]);
const projects = ref<Project[]>([]);
const announcements = ref<Announcement[]>([]);

const searchQuery = ref("");
const filterDeptId = ref("all");

// Modals
const showEmployeeModal = ref(false);
const editingEmployee = ref<User | null>(null);
const showTaskModal = ref(false);
const showDeptModal = ref(false);
const showProjModal = ref(false);

// Employee form bindings
const empName = ref("");
const empUsername = ref("");
const empPassword = ref("");
const empEmail = ref("");
const empPosition = ref("");
const empSalary = ref(5000);
const empRole = ref<UserRole>(UserRole.EMPLOYEE);
const empDept = ref("");

// Task form bindings
const taskTitle = ref("");
const taskDesc = ref("");
const taskAssignedTo = ref("");
const taskDueDate = ref("");
const taskPriority = ref<TaskPriority>(TaskPriority.MEDIUM);
const taskProject = ref("");
const taskReqFiles = ref(false);
const newCheckItem = ref("");
const taskChecklist = ref<string[]>([]);

// Evaluation form bindings
const evalEmpId = ref("");
const evalDate = ref(new Date().toISOString().split("T")[0]);
const evalQuality = ref(8);
const evalSpeed = ref(8);
const evalCommitment = ref(8);
const evalAttendance = ref(10);
const evalCommunication = ref(8);
const evalNotes = ref("");
const evalSuccessMsg = ref("");
const aiReviewLoading = ref(false);

// AI Corporate reportbindings
const aiReportLoading = ref(false);
const aiReportResult = ref("");

// Announcement bindings
const annTitle = ref("");
const annContent = ref("");
const annPriority = ref("normal");

// Department creation form
const deptName = ref("");
const deptDesc = ref("");
const deptMgr = ref("");

// Project creation form
const projName = ref("");
const projDesc = ref("");
const projStart = ref(new Date().toISOString().split("T")[0]);
const projEnd = ref("");
const projDept = ref("");

const tabsList = [
  { id: "overview", label: "الرؤية والتحليلات الشاملة" },
  { id: "employees", label: "هيكلية وملفات الكوادر" },
  { id: "tasks", label: "محرك توزيع المهام" },
  { id: "evals", label: "التقييم اليومي والذكاء" },
  { id: "departments", label: "الأقسام التشغيلية" },
  { id: "projects", label: "إدارة المشاريع" },
  { id: "reports", label: "تقارير Gemini الفنية" },
  { id: "announcements", label: "بث وتعميم الإعلانات" },
  { id: "settings", label: "الهوية واللوائح" },
];

const alert = (msg: string) => {
  window.alert ? window.alert(msg) : console.log(msg);
};

// Computeds
const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDept = filterDeptId.value === "all" || emp.departmentId === filterDeptId.value;
    return matchesSearch && matchesDept;
  });
});

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDept = filterDeptId.value === "all" || task.departmentId === filterDeptId.value;
    return matchesSearch && matchesDept;
  });
});

const totalSalaries = computed(() => {
  return employees.value.reduce((acc, curr) => acc + (curr.salary || 0), 0);
});

const completedTasksCount = computed(() => {
  return tasks.value.filter((t) => t.status === TaskStatus.COMPLETED).length;
});

const reviewTasksCount = computed(() => {
  return tasks.value.filter((t) => t.status === TaskStatus.UNDER_REVIEW).length;
});

const averagePerformance = computed(() => {
  if (employees.value.length === 0) return 100;
  const total = employees.value.reduce((acc, curr) => acc + (curr.performanceScore || 100), 0);
  return Math.round(total / employees.value.length);
});

// Load data
const fetchData = async () => {
  try {
    const headers = { Authorization: `Bearer ${props.token}` };
    const [empRes, taskRes, deptRes, projRes, annRes] = await Promise.all([
      fetch("/api/users", { headers }),
      fetch("/api/tasks", { headers }),
      fetch("/api/departments", { headers }),
      fetch("/api/projects", { headers }),
      fetch("/api/announcements", { headers }),
    ]);

    if (empRes.ok) employees.value = await empRes.json();
    if (taskRes.ok) tasks.value = await taskRes.json();
    if (deptRes.ok) {
      const depts = await deptRes.json();
      departments.value = depts;
      if (depts.length > 0) {
        empDept.value = depts[0].id;
        projDept.value = depts[0].id;
      }
    }
    if (projRes.ok) {
      const projs = await projRes.json();
      projects.value = projs;
      if (projs.length > 0) {
        taskProject.value = projs[0].id;
      }
    }
    if (annRes.ok) announcements.value = await annRes.json();

    if (employees.value.length > 0 && !evalEmpId.value) {
      evalEmpId.value = employees.value[0].id;
    }
  } catch (err) {
    console.error("Error fetching manager dashboard data", err);
  } finally {
    loading.value = false;
  }
};

let pollInterval: any = null;

onMounted(() => {
  fetchData();
  pollInterval = setInterval(fetchData, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

// Employee methods
const openNewEmployeeModal = () => {
  editingEmployee.value = null;
  empName.value = "";
  empUsername.value = "";
  empPassword.value = "";
  empEmail.value = "";
  empPosition.value = "";
  empSalary.value = 8000;
  empRole.value = UserRole.EMPLOYEE;
  if (departments.value.length > 0) empDept.value = departments.value[0].id;
  showEmployeeModal.value = true;
};

const handleEditEmployee = (emp: User) => {
  editingEmployee.value = emp;
  empName.value = emp.name;
  empUsername.value = emp.username;
  empPassword.value = "";
  empEmail.value = emp.email;
  empPosition.value = emp.position;
  empSalary.value = emp.salary || 5000;
  empRole.value = emp.role;
  empDept.value = emp.departmentId || "";
  showEmployeeModal.value = true;
};

const handleSaveEmployee = async () => {
  try {
    const url = editingEmployee.value ? `/api/users/${editingEmployee.value.id}` : "/api/users";
    const method = editingEmployee.value ? "PUT" : "POST";

    const payload: any = {
      name: empName.value,
      username: empUsername.value,
      email: empEmail.value,
      position: empPosition.value,
      salary: empSalary.value,
      role: empRole.value,
      departmentId: empDept.value,
    };

    if (empPassword.value) {
      payload.password = empPassword.value;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showEmployeeModal.value = false;
      fetchData();
      alert(editingEmployee.value ? "✓ تم تحديث بيانات الموظف بنجاح." : "✓ تم تسجيل الموظف بالهيكل بنجاح.");
    } else {
      const errData = await response.json();
      alert(`⚠️ خطأ: ${errData.error || "فشل حفظ الملف"}`);
    }
  } catch (err) {
    console.error(err);
  }
};

const handleToggleDeactivate = async (emp: User) => {
  const newStatus = emp.status === "active" ? "deactivated" : "active";
  try {
    const response = await fetch(`/api/users/${emp.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteEmployee = async (id: string) => {
  if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الملف الوظيفي بالكامل من السجلات؟")) return;
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${props.token}` },
    });
    if (response.ok) {
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

// Task methods
const openNewTaskModal = () => {
  taskTitle.value = "";
  taskDesc.value = "";
  taskAssignedTo.value = employees.value.length > 0 ? employees.value[0].id : "";
  taskDueDate.value = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]; // +3 days
  taskPriority.value = TaskPriority.MEDIUM;
  taskReqFiles.value = false;
  taskChecklist.value = [];
  newCheckItem.value = "";
  if (projects.value.length > 0) taskProject.value = projects.value[0].id;
  showTaskModal.value = true;
};

const handleAddChecklist = () => {
  if (!newCheckItem.value) return;
  taskChecklist.value.push(newCheckItem.value);
  newCheckItem.value = "";
};

const handleRemoveChecklist = (idx: number) => {
  taskChecklist.value.splice(idx, 1);
};

const handleCreateTask = async () => {
  if (!taskAssignedTo.value) {
    alert("الرجاء اختيار الموظف المكلف بها أولاً.");
    return;
  }
  const empObj = employees.value.find((e) => e.id === taskAssignedTo.value);

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        title: taskTitle.value,
        description: taskDesc.value,
        assignedEmployeeId: taskAssignedTo.value,
        departmentId: empObj ? empObj.departmentId : "",
        dueDate: taskDueDate.value,
        priority: taskPriority.value,
        projectId: taskProject.value,
        requiredFiles: taskReqFiles.value,
        checklist: taskChecklist.value.map((text, idx) => ({
          id: `chk-${Date.now()}-${idx}`,
          text,
          isCompleted: false,
        })),
      }),
    });

    if (response.ok) {
      showTaskModal.value = false;
      fetchData();
      alert("✓ تم بث وتكليف الموظف بالمهمة الجديدة بنجاح.");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteTask = async (id: string) => {
  if (!confirm("هل أنت متأكد من حذف وإلغاء تكليف هذه المهمة؟")) return;
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${props.token}` },
    });
    if (response.ok) {
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

// Projects
const getProjectProgress = (id: string) => {
  const projTasks = tasks.value.filter((t) => t.projectId === id);
  if (projTasks.length === 0) return 0;
  const completedProjTasks = projTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
  return Math.round((completedProjTasks / projTasks.length) * 100);
};

const handleCreateProj = async () => {
  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        name: projName.value,
        description: projDesc.value,
        startDate: projStart.value,
        endDate: projEnd.value,
        departmentId: projDept.value,
      }),
    });
    if (response.ok) {
      showProjModal.value = false;
      projName.value = "";
      projDesc.value = "";
      fetchData();
      alert("✓ تم إطلاق المشروع وبث خطة العمل بنجاح.");
    }
  } catch (err) {
    console.error(err);
  }
};

// Departments
const handleCreateDept = async () => {
  try {
    const response = await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        name: deptName.value,
        description: deptDesc.value,
        managerId: deptMgr.value,
      }),
    });
    if (response.ok) {
      showDeptModal.value = false;
      deptName.value = "";
      deptDesc.value = "";
      deptMgr.value = "";
      fetchData();
      alert("✓ تم تأسيس وإقرار القسم التشغيلي بنجاح.");
    }
  } catch (err) {
    console.error(err);
  }
};

// Evaluations
const handleConsultGeminiReview = async () => {
  if (!evalEmpId.value) return;
  aiReviewLoading.value = true;

  try {
    const response = await fetch("/api/evaluations/gemini-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        employeeId: evalEmpId.value,
        quality: evalQuality.value,
        speed: evalSpeed.value,
        commitment: evalCommitment.value,
        attendance: evalAttendance.value,
        communication: evalCommunication.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      evalNotes.value = data.reviewText;
    }
  } catch (err) {
    console.error(err);
  } finally {
    aiReviewLoading.value = false;
  }
};

const handleSubmitEvaluation = async () => {
  if (!evalEmpId.value) return;

  try {
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        employeeId: evalEmpId.value,
        date: evalDate.value,
        taskQuality: evalQuality.value,
        speed: evalSpeed.value,
        commitment: evalCommitment.value,
        attendance: evalAttendance.value,
        communication: evalCommunication.value,
        problemSolving: 8, // hardcoded or computed parameter
        notes: evalNotes.value,
      }),
    });

    if (response.ok) {
      evalSuccessMsg.value = "✓ تم اعتماد تقييم اليوم وبث نتائجه بنجاح!";
      evalNotes.value = "";
      setTimeout(() => (evalSuccessMsg.value = ""), 5000);
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

// AI Executive Reports
const handleCompileAIReport = async () => {
  aiReportLoading.value = true;
  aiReportResult.value = "";

  try {
    const response = await fetch("/api/reports/compile", {
      method: "POST",
      headers: { Authorization: `Bearer ${props.token}` },
    });

    if (response.ok) {
      const data = await response.json();
      aiReportResult.value = data.reportText;
    } else {
      aiReportResult.value = "فشل في تجميع تقرير الذكاء الاصطناعي من المزود.";
    }
  } catch (err) {
    console.error(err);
    aiReportResult.value = "حدث خطأ غير متوقع أثناء الاتصال بخادم الاستخبارات الاصطناعية.";
  } finally {
    aiReportLoading.value = false;
  }
};

// Announcements
const handleCreateAnnouncement = async () => {
  try {
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        title: annTitle.value,
        content: annContent.value,
        priority: annPriority.value,
      }),
    });
    if (response.ok) {
      annTitle.value = "";
      annContent.value = "";
      fetchData();
      alert("✓ تم بث الإعلان والتعميم لجميع الزملاء بالنظام.");
    }
  } catch (err) {
    console.error(err);
  }
};
</script>
