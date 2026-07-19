<template>
  <div class="space-y-8 font-sans p-1">
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center space-y-2">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p class="text-sm font-semibold text-slate-500">جاري تحميل مساحتك المهنية...</p>
      </div>
    </div>

    <template v-else>
      <!-- Arabic Employee Welcome Header -->
      <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full" />
        <div class="absolute left-1/4 top-5 w-20 h-20 bg-white/5 rounded-full" />
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 space-x-reverse bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
              <UserCheck class="w-4 h-4 text-blue-300" />
              <span>المساحة الوظيفية الذاتية</span>
            </div>
            <h1 class="text-3xl font-black">أهلاً بك، {{ currentUser.name }}</h1>
            <p class="text-sm text-blue-100 max-w-xl font-medium">
              المنصب: <span class="font-bold underline">{{ currentUser.position }}</span> • تتبع مهامك اليومية، سجل حضورك الذاتي، واطلع على تقارير أدائك الفني.
            </p>
          </div>

          <!-- Interactive Attendance Card Widget -->
          <div class="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-full md:w-80 space-y-4">
            <div class="flex items-center justify-between text-xs font-bold text-blue-100 border-b border-white/10 pb-2">
              <span class="flex items-center space-x-1.5 space-x-reverse">
                <Clock class="w-4 h-4" />
                <span>الدوام المالي واليومي</span>
              </span>
              <span class="font-mono bg-blue-800/40 px-2.5 py-0.5 rounded-full">
                {{ new Date().toLocaleDateString("ar-SA") }}
              </span>
            </div>

            <div v-if="todayAttendance" class="space-y-2 text-center">
              <div class="text-xs font-bold">
                <span v-if="todayAttendance.clockOut" class="text-emerald-300">✓ تم تسجيل الحضور والانصراف بنجاح</span>
                <span v-else class="text-amber-300 animate-pulse">● قيد الخدمة الحالية</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <div class="bg-white/5 p-1.5 rounded">
                  <span class="block text-[10px] text-blue-200">الدخول</span>
                  <span class="font-bold">{{ todayAttendance.clockIn }}</span>
                </div>
                <div class="bg-white/5 p-1.5 rounded">
                  <span class="block text-[10px] text-blue-200">الخروج</span>
                  <span class="font-bold">{{ todayAttendance.clockOut || "--:--" }}</span>
                </div>
              </div>
              <button
                v-if="!todayAttendance.clockOut"
                @click="handleClockOut"
                class="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition"
              >
                تسجيل انصراف (Clock Out)
              </button>
            </div>

            <div v-else class="space-y-2">
              <p class="text-xs text-center text-blue-200 font-bold">لم تقم بتسجيل الدخول بعد اليوم.</p>
              <button
                @click="handleClockIn"
                class="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition shadow-lg shadow-emerald-700/20"
              >
                تسجيل حضور (Clock In)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements Scroller -->
      <div v-if="announcements.length > 0" class="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3 space-x-reverse">
        <span class="p-2 bg-amber-100 text-amber-700 rounded-xl">📢</span>
        <div class="space-y-1 flex-1">
          <span class="text-[10px] font-bold text-amber-600">إعلان إداري عاجل من: {{ announcements[0].createdBy }}</span>
          <h4 class="text-sm font-extrabold text-slate-800">{{ announcements[0].title }}</h4>
          <p class="text-xs text-slate-600 leading-relaxed font-semibold">{{ announcements[0].content }}</p>
        </div>
      </div>

      <!-- Dashboard Sub-navigation Tabs -->
      <div class="flex border-b border-slate-200 space-x-4 space-x-reverse overflow-x-auto pb-1 text-xs md:text-sm font-bold">
        <button
          @click="activeTab = 'tasks'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'tasks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          المهام والمشاريع الموكلة ({{ tasks.length }})
        </button>
        <button
          @click="activeTab = 'evals'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'evals' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          سجل تقييم الأداء اليومي ({{ evaluations.length }})
        </button>
        <button
          @click="activeTab = 'attendance'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'attendance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          سجل الحضور والإجازات ({{ attendance.length }})
        </button>
        <button
          @click="activeTab = 'files'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'files' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          خزانة المستندات والملفات
        </button>
        <button
          @click="activeTab = 'chat'"
          :class="['pb-3 px-2 shrink-0', activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800']"
        >
          الحائط العام والتواصل المباشر
        </button>
      </div>

      <!-- TAB 1: Tasks Hub -->
      <div v-if="activeTab === 'tasks'" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <p class="text-xs font-bold text-slate-500">بانتظار العمل</p>
            <h4 class="text-xl font-bold text-slate-800">{{ pendingCount }}</h4>
          </div>
          <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-50 text-center">
            <p class="text-xs font-bold text-blue-600">قيد الإنجاز</p>
            <h4 class="text-xl font-bold text-blue-800">{{ inProgressCount }}</h4>
          </div>
          <div class="bg-purple-50/50 p-4 rounded-xl border border-purple-50 text-center">
            <p class="text-xs font-bold text-purple-600">قيد المراجعة</p>
            <h4 class="text-xl font-bold text-purple-800">{{ underReviewCount }}</h4>
          </div>
          <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-50 text-center">
            <p class="text-xs font-bold text-emerald-600">مكتملة ومقبولة</p>
            <h4 class="text-xl font-bold text-emerald-800">{{ completedCount }}</h4>
          </div>
        </div>

        <div class="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">قائمة المهام الشخصية</h3>
          </div>

          <div v-if="tasks.length === 0" class="p-12 text-center text-slate-400 font-bold">
            ⚠️ لا توجد مهام مسندة إليك حالياً.
          </div>

          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="task in tasks"
              :key="task.id"
              @click="handleOpenTask(task)"
              class="p-5 hover:bg-slate-50/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div class="space-y-1.5 flex-1">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <span :class="['text-[10px] font-black px-2 py-0.5 rounded-full border', STATUS_TRANSLATIONS[task.status]?.color, STATUS_TRANSLATIONS[task.status]?.bg]">
                    {{ STATUS_TRANSLATIONS[task.status]?.label || task.status }}
                  </span>
                  <span :class="['text-[10px] font-black px-2 py-0.5 rounded-full border', PRIORITY_TRANSLATIONS[task.priority]?.color, PRIORITY_TRANSLATIONS[task.priority]?.bg]">
                    {{ PRIORITY_TRANSLATIONS[task.priority]?.label || task.priority }}
                  </span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    {{ task.category }}
                  </span>
                </div>
                <h4 class="text-sm font-black text-slate-800 hover:text-blue-600 transition">
                  {{ task.title }}
                </h4>
                <p class="text-xs text-slate-500 line-clamp-1 font-semibold">{{ task.description }}</p>
              </div>

              <div class="flex items-center space-x-6 space-x-reverse text-xs font-bold text-slate-500">
                <div>
                  <span class="block text-[9px] text-slate-400">تاريخ الاستحقاق</span>
                  <span class="font-mono text-slate-700">{{ task.dueDate }}</span>
                </div>
                <div class="w-24 bg-slate-100 h-2 rounded-full overflow-hidden relative">
                  <div
                    class="bg-blue-600 h-full rounded-full transition-all"
                    :style="{ width: `${task.completionPercentage}%` }"
                  />
                </div>
                <span class="font-mono text-slate-700 w-8 text-left">{{ task.completionPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: Evaluations -->
      <div v-if="activeTab === 'evals'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">تفاصيل سجل التقييم اليومي</h3>

            <div v-if="evaluations.length === 0" class="p-8 text-center text-slate-400 font-bold">
              لم يتم إصدار أي تقييم يومي رسمي لك بعد اليوم.
            </div>

            <div v-else class="space-y-6">
              <div v-for="evalObj in evaluations" :key="evalObj.id" class="border border-slate-100 p-5 rounded-2xl space-y-3 bg-slate-50/50">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-bold">
                  <span class="flex items-center space-x-1.5 space-x-reverse text-blue-600">
                    <Calendar class="w-4 h-4" />
                    <span>تقييم تاريخ: {{ evalObj.date }}</span>
                  </span>
                  <span class="bg-blue-600 text-white px-3 py-1 rounded-full font-mono">
                    معدل الأداء: {{ evalObj.finalScore }}%
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">جودة العمل</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.taskQuality }}/10</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">سرعة التنفيذ</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.speed }}/10</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">الالتزام بالوقت</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.commitment }}/10</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">الحضور والانضباط</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.attendance }}/10</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">مهارات التواصل</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.communication }}/10</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span class="block text-slate-400 font-bold">حل المشكلات</span>
                    <span class="font-black text-slate-800 font-mono text-sm">{{ evalObj.problemSolving }}/10</span>
                  </div>
                </div>

                <div v-if="evalObj.notes" class="p-3 bg-blue-50/50 text-blue-900 rounded-xl text-xs font-semibold leading-relaxed border border-blue-50/50">
                  <strong class="block text-blue-700 mb-1">✍ مذكرات وتقييم الإدارة:</strong>
                  "{{ evalObj.notes }}"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              🏆
            </div>
            <h3 class="text-md font-bold text-slate-800">معدل الأداء الإجمالي التراكمي</h3>
            <div class="text-4xl font-black text-blue-600 font-mono">
              {{ currentUser.performanceScore || 90 }}%
            </div>
            <p class="text-xs text-slate-400 font-semibold leading-relaxed">
              يتم حساب هذا المعدل تلقائياً من واقع متوسط تقييمات الأداء اليومية والأسبوعية المسجلة من مدراء الأقسام.
            </p>
          </div>

          <ArabicBarChart
            title="مقارنة مهارات التقييم"
            :data="[
              { label: 'جودة العمل فنياً', value: 90, color: 'bg-blue-600' },
              { label: 'سرعة تسليم المهام', value: 80, color: 'bg-indigo-600' },
              { label: 'الالتزام والعمل الجماعي', value: 95, color: 'bg-emerald-600' },
              { label: 'الانضباط والتواجد', value: 100, color: 'bg-sky-500' },
            ]"
          />
        </div>
      </div>

      <!-- TAB 3: Attendance Logs -->
      <div v-if="activeTab === 'attendance'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">سجل الحضور والانصراف</h3>

          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs md:text-sm">
              <thead class="bg-slate-50 text-slate-500 font-black border-b border-slate-100">
                <tr>
                  <th class="p-3">التاريخ</th>
                  <th class="p-3">الحضور (In)</th>
                  <th class="p-3">الانصراف (Out)</th>
                  <th class="p-3">ساعات العمل</th>
                  <th class="p-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr v-for="att in attendance" :key="att.id" class="hover:bg-slate-50/50">
                  <td class="p-3 font-mono">{{ att.date }}</td>
                  <td class="p-3 font-mono text-slate-600">{{ att.clockIn || "--:--" }}</td>
                  <td class="p-3 font-mono text-slate-600">{{ att.clockOut || "--:--" }}</td>
                  <td class="p-3 font-mono text-slate-800">
                    {{ att.workingHours ? `${att.workingHours} ساعة` : "--" }}
                  </td>
                  <td class="p-3 text-center">
                    <span
                      :class="['text-[10px] font-black px-2.5 py-0.5 rounded-full', att.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : att.status === 'late' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100']"
                    >
                      {{ att.status === "present" ? "حاضر بالوقت" : att.status === "late" ? "وصول متأخر" : "إجازة / غياب" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Leave Submission -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">تقديم طلب إجازة / استئذان</h3>
          <p class="text-xs text-slate-400 font-semibold leading-relaxed">
            يمكنك طلب إجازة رسمية أو استئذان ليوم الغد وسيتلقى المدير المباشر إشعاراً لاعتماده وتثبيته.
          </p>
          <div class="space-y-3 text-xs font-bold pt-2">
            <button
              @click="handleLeaveRequest('vacation', 'إجازة سنوية اعتيادية')"
              class="w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition"
            >
              🌴 تقديم طلب إجازة اعتيادية (غداً)
            </button>
            <button
              @click="handleLeaveRequest('leave', 'استئذان لظرف صحي')"
              class="w-full py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition"
            >
              🏥 تقديم طلب استئذان طارئ (غداً)
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 4: Files Locker -->
      <div v-if="activeTab === 'files'" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800">خزانة مستندات الموظف</h3>
            <p class="text-xs text-slate-400 font-bold">رفع ومراجعة وتنزيل ملفات تسليم المهام والوثائق المعتمدة.</p>
          </div>

          <!-- General file uploader -->
          <form @submit.prevent="handleFileUpload" class="flex items-center space-x-2 space-x-reverse">
            <input
              type="file"
              class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              @change="onFileSelected"
            />
            <button
              type="submit"
              :disabled="isUploading || !uploadTaskFile"
              class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-40 flex items-center space-x-1.5 space-x-reverse"
            >
              <Upload class="w-3.5 h-3.5" />
              <span>{{ isUploading ? "جاري الرفع..." : "رفع ملف عام" }}</span>
            </button>
          </form>
        </div>

        <div v-if="files.length === 0" class="p-12 text-center text-slate-400 font-semibold">
          لا توجد ملفات في خزانتك الشخصية حالياً.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="file in files" :key="file.id" class="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex items-center space-x-3 space-x-reverse">
            <span class="text-2xl bg-white p-2.5 rounded-xl shadow-xs shrink-0">
              {{ getFileIcon(file.type) }}
            </span>
            <div class="space-y-1 overflow-hidden flex-1">
              <h4 class="text-xs font-bold text-slate-800 truncate" :title="file.name">
                {{ file.name }}
              </h4>
              <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>{{ file.size }}</span>
                <span v-if="file.approvedByManager" class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">معتمد من الإدارة</span>
                <span v-else class="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">قيد المراجعة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: General Chat -->
      <div v-if="activeTab === 'chat'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800">حائط المناقشة العام والزملاء</h3>
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <!-- Chat Messages -->
          <div class="flex-1 p-4 overflow-y-auto space-y-4">
            <div v-for="msg in chatMessages" :key="msg.id" :class="['flex', msg.senderId === currentUser.id ? 'justify-start' : 'justify-end']">
              <div :class="['max-w-[80%] rounded-2xl p-3 text-xs shadow-xs', msg.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800']">
                <span :class="['block text-[9px] font-bold mb-1', msg.senderId === currentUser.id ? 'text-blue-100' : 'text-slate-500']">
                  {{ msg.senderName }}
                </span>
                <p class="font-semibold leading-relaxed">{{ msg.message }}</p>
                <span class="block text-[8px] text-right mt-1 opacity-70">
                  {{ formatTimeAgo(msg.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <form @submit.prevent="handleSendChat" class="p-3 border-t border-slate-100 flex space-x-2 space-x-reverse">
            <input
              type="text"
              placeholder="اكتب رسالتك وشارك الزملاء بالقسم..."
              class="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
              v-model="chatInput"
            />
            <button
              type="submit"
              class="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Send class="w-4 h-4" />
            </button>
          </form>
        </div>

        <!-- Colleagues Listing -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">فريق العمل النشط</h3>
          <div class="space-y-3 overflow-y-auto max-h-[380px]">
            <div v-for="user in companyUsers" :key="user.id" class="flex items-center space-x-3 space-x-reverse text-xs font-bold">
              <div class="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold font-mono">
                {{ user.name.charAt(0) }}
              </div>
              <div>
                <span class="block text-slate-800">{{ user.name }}</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ user.position }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Details Interactive Drawer -->
      <div v-if="selectedTask" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative text-right">
          <button
            @click="selectedTask = null"
            class="absolute top-4 left-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
          >
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1.5 pt-2">
            <span class="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full font-black">
              معرف المهمة: {{ selectedTask.id }}
            </span>
            <h3 class="text-lg font-black text-slate-800">{{ selectedTask.title }}</h3>
            <p class="text-xs text-slate-500 font-semibold leading-relaxed">{{ selectedTask.description }}</p>
          </div>

          <!-- Checklist interactive widget -->
          <div v-if="selectedTask.checklist && selectedTask.checklist.length > 0" class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h4 class="text-xs font-black text-slate-700 flex items-center space-x-1.5 space-x-reverse">
              <CheckSquare class="w-4 h-4 text-blue-600" />
              <span>قائمة مهام العمل الفرعية (Checklist)</span>
            </h4>
            <div class="space-y-2 text-xs font-bold">
              <label
                v-for="item in selectedTask.checklist"
                :key="item.id"
                class="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-white transition"
              >
                <input
                  type="checkbox"
                  :checked="item.isCompleted"
                  @change="handleToggleChecklist(item.id, item.isCompleted)"
                  class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span :class="item.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'">
                  {{ item.text }}
                </span>
              </label>
            </div>
          </div>

          <!-- Progress Adjuster -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>تحديث نسبة تقدم المهمة الحالي</span>
              <span class="font-mono text-blue-600">{{ progressVal }}%</span>
            </div>
            <div class="flex items-center space-x-4 space-x-reverse">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                v-model.number="progressVal"
              />
              <button
                @click="handleUpdateProgress"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shrink-0"
              >
                حفظ نسبة التقدم
              </button>
            </div>
          </div>

          <!-- Task specific attachments and file uploader -->
          <div class="border-t border-slate-100 pt-4 space-y-3">
            <h4 class="text-xs font-black text-slate-700 flex items-center space-x-1.5 space-x-reverse">
              <Paperclip class="w-4 h-4 text-slate-500" />
              <span>مرفقات تسليم المهمة والملفات المرجعية</span>
            </h4>

            <div v-if="selectedTask.attachments && selectedTask.attachments.length > 0" class="grid grid-cols-2 gap-2 text-xs font-bold">
              <div v-for="(file, idx) in selectedTask.attachments" :key="idx" class="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span class="truncate max-w-[120px]" :title="file.name">{{ file.name }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ file.size }}</span>
              </div>
            </div>

            <div v-if="selectedTask.requiredFiles" class="p-3 bg-rose-50 text-rose-800 text-[11px] font-bold rounded-xl flex items-center space-x-2 space-x-reverse border border-rose-100">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>تنبيه: تتطلب هذه المهمة رفع ملف تسليم لاعتمادها وإقفالها من قبل المدير.</span>
            </div>

            <!-- Upload panel inside task -->
            <form @submit.prevent="handleFileUploadInsideTask" class="flex items-center space-x-2 space-x-reverse bg-slate-50 p-3 rounded-xl border border-slate-100">
              <input
                type="file"
                required
                class="text-xs text-slate-500 file:py-1 file:px-3 file:rounded-full file:bg-blue-50 file:text-blue-700 file:border-0"
                @change="onFileSelected"
              />
              <button
                type="submit"
                :disabled="isUploading"
                class="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-40"
              >
                {{ isUploading ? "جاري الرفع..." : "رفع مستند تسليم" }}
              </button>
            </form>
          </div>

          <!-- Submit Task for Review -->
          <button
            v-if="selectedTask.status !== TaskStatus.UNDER_REVIEW && selectedTask.status !== TaskStatus.COMPLETED"
            @click="handleSubmitTaskForReview"
            class="w-full py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition flex items-center justify-center space-x-2 space-x-reverse"
          >
            <FileCheck class="w-4.5 h-4.5" />
            <span>تقديم المهمة للمراجعة والاعتماد النهائي</span>
          </button>

          <!-- Comments and discussion section inside task -->
          <div class="border-t border-slate-100 pt-4 space-y-4">
            <h4 class="text-xs font-black text-slate-700 flex items-center space-x-1.5 space-x-reverse">
              <MessageSquare class="w-4 h-4 text-blue-600" />
              <span>نقاشات واستفسارات المهمة ({{ selectedTask.comments?.length || 0 }})</span>
            </h4>

            <div v-if="selectedTask.comments && selectedTask.comments.length > 0" class="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              <div v-for="comment in selectedTask.comments" :key="comment.id" class="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                <div class="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span class="text-slate-700 font-black">{{ comment.userName }} ({{ comment.userRole === "manager" ? "المدير" : "موظف" }})</span>
                  <span>{{ formatTimeAgo(comment.createdAt) }}</span>
                </div>
                <p class="text-slate-600 font-semibold leading-relaxed">{{ comment.text }}</p>
              </div>
            </div>

            <form @submit.prevent="handlePostComment" class="flex space-x-2 space-x-reverse">
              <input
                type="text"
                required
                placeholder="اكتب استفساراً أو رداً مهنياً للادارة..."
                class="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                v-model="newComment"
              />
              <button
                type="submit"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                إرسال الرد
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Task, DailyEvaluation, Attendance, FileItem, Announcement, ChatMessage, Notification, User, TaskStatus } from "../types";
import { STATUS_TRANSLATIONS, PRIORITY_TRANSLATIONS, formatTimeAgo, getFileIcon } from "../utils";
import {
  Clock,
  MessageSquare,
  Upload,
  UserCheck,
  Calendar,
  Send,
  Paperclip,
  CheckSquare,
  AlertCircle,
  X,
  FileCheck
} from "lucide-vue-next";
import ArabicBarChart from "../components/ArabicBarChart.vue";

const props = defineProps<{
  token: string;
  currentUser: User;
}>();

const tasks = ref<Task[]>([]);
const evaluations = ref<DailyEvaluation[]>([]);
const attendance = ref<Attendance[]>([]);
const files = ref<FileItem[]>([]);
const announcements = ref<Announcement[]>([]);
const chatMessages = ref<ChatMessage[]>([]);
const notifications = ref<Notification[]>([]);
const companyUsers = ref<User[]>([]);

const loading = ref(true);
const activeTab = ref<"tasks" | "evals" | "attendance" | "files" | "chat">("tasks");
const selectedTask = ref<Task | null>(null);

const newComment = ref("");
const progressVal = ref(0);
const chatInput = ref("");
const todayAttendance = ref<Attendance | null>(null);

const uploadTaskFile = ref<File | null>(null);
const isUploading = ref(false);

const pendingCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.PENDING).length);
const inProgressCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS).length);
const underReviewCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.UNDER_REVIEW).length);
const completedCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.COMPLETED).length);

const onFileSelected = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadTaskFile.value = target.files[0];
  }
};

const fetchData = async () => {
  try {
    const headers = { Authorization: `Bearer ${props.token}` };
    const [
      taskRes,
      evalRes,
      attRes,
      fileRes,
      annRes,
      chatRes,
      notRes,
      userRes
    ] = await Promise.all([
      fetch("/api/tasks", { headers }),
      fetch("/api/evaluations", { headers }),
      fetch("/api/attendance", { headers }),
      fetch("/api/files", { headers }),
      fetch("/api/announcements", { headers }),
      fetch("/api/messages", { headers }),
      fetch("/api/notifications", { headers }),
      fetch("/api/users", { headers }),
    ]);

    if (taskRes.ok) tasks.value = await taskRes.json();
    if (evalRes.ok) evaluations.value = await evalRes.json();
    if (attRes.ok) {
      const attData: Attendance[] = await attRes.json();
      attendance.value = attData;
      const todayStr = new Date().toISOString().split("T")[0];
      todayAttendance.value = attData.find((a) => a.date === todayStr) || null;
    }
    if (fileRes.ok) files.value = await fileRes.json();
    if (annRes.ok) announcements.value = await annRes.json();
    if (chatRes.ok) chatMessages.value = await chatRes.json();
    if (notRes.ok) notifications.value = await notRes.json();
    if (userRes.ok) companyUsers.value = await userRes.json();
  } catch (err) {
    console.error("Error loading employee data", err);
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

const handleClockIn = async () => {
  try {
    const response = await fetch("/api/attendance/clock-in", {
      method: "POST",
      headers: { Authorization: `Bearer ${props.token}` },
    });
    if (response.ok) {
      const data = await response.json();
      todayAttendance.value = data;
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleClockOut = async () => {
  try {
    const response = await fetch("/api/attendance/clock-out", {
      method: "POST",
      headers: { Authorization: `Bearer ${props.token}` },
    });
    if (response.ok) {
      const data = await response.json();
      todayAttendance.value = data;
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleLeaveRequest = async (statusType: "vacation" | "leave", reason: string) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const response = await fetch("/api/attendance/leave-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        date: tomorrowStr,
        status: statusType,
        leaveReason: reason,
      }),
    });
    if (response.ok) {
      fetchData();
      alert(`تم تقديم طلب الإجازة بنجاح ليوم ${tomorrowStr}`);
    }
  } catch (err) {
    console.error(err);
  }
};

const handleOpenTask = (t: Task) => {
  selectedTask.value = t;
  progressVal.value = t.completionPercentage;
};

const handleUpdateProgress = async () => {
  if (!selectedTask.value) return;
  const isCompletedVal = progressVal.value === 100;
  const finalStatus = isCompletedVal ? TaskStatus.UNDER_REVIEW : TaskStatus.IN_PROGRESS;

  try {
    const response = await fetch(`/api/tasks/${selectedTask.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        completionPercentage: progressVal.value,
        status: finalStatus,
      }),
    });
    if (response.ok) {
      const updated = await response.json();
      selectedTask.value = updated;
      tasks.value = tasks.value.map((t) => (t.id === updated.id ? updated : t));
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleToggleChecklist = async (itemId: string, currentVal: boolean) => {
  if (!selectedTask.value) return;
  const updatedChecklist = selectedTask.value.checklist.map((item) =>
    item.id === itemId ? { ...item, isCompleted: !currentVal } : item
  );

  const completedCount = updatedChecklist.filter((c) => c.isCompleted).length;
  const calculatedPercentage = Math.round((completedCount / updatedChecklist.length) * 100);

  try {
    const response = await fetch(`/api/tasks/${selectedTask.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        checklist: updatedChecklist,
        completionPercentage: calculatedPercentage,
      }),
    });
    if (response.ok) {
      const updated = await response.json();
      selectedTask.value = updated;
      progressVal.value = updated.completionPercentage;
      tasks.value = tasks.value.map((t) => (t.id === updated.id ? updated : t));
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handlePostComment = async () => {
  if (!selectedTask.value || !newComment.value) return;

  try {
    const response = await fetch(`/api/tasks/${selectedTask.value.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ text: newComment.value }),
    });
    if (response.ok) {
      newComment.value = "";
      const comment = await response.json();
      const updatedTask = {
        ...selectedTask.value,
        comments: [...(selectedTask.value.comments || []), comment],
      };
      selectedTask.value = updatedTask;
      tasks.value = tasks.value.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleFileUpload = async () => {
  if (!uploadTaskFile.value) return;
  isUploading.value = true;

  const reader = new FileReader();
  reader.readAsDataURL(uploadTaskFile.value);
  reader.onload = async () => {
    const base64Str = reader.result as string;
    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          name: uploadTaskFile.value!.name,
          size: `${(uploadTaskFile.value!.size / (1024 * 1024)).toFixed(2)} MB`,
          type: uploadTaskFile.value!.name.split(".").pop() || "bin",
          contentBase64: base64Str,
          taskId: "",
        }),
      });

      if (response.ok) {
        uploadTaskFile.value = null;
        fetchData();
        alert("✓ تم رفع المستند بنجاح وحفظه بالخادم!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      isUploading.value = false;
    }
  };
};

const handleFileUploadInsideTask = async () => {
  if (!uploadTaskFile.value || !selectedTask.value) return;
  isUploading.value = true;

  const taskId = selectedTask.value.id;
  const reader = new FileReader();
  reader.readAsDataURL(uploadTaskFile.value);
  reader.onload = async () => {
    const base64Str = reader.result as string;
    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          name: uploadTaskFile.value!.name,
          size: `${(uploadTaskFile.value!.size / (1024 * 1024)).toFixed(2)} MB`,
          type: uploadTaskFile.value!.name.split(".").pop() || "bin",
          contentBase64: base64Str,
          taskId: taskId,
        }),
      });

      if (response.ok) {
        uploadTaskFile.value = null;
        fetchData();

        const taskRes = await fetch("/api/tasks", { headers: { Authorization: `Bearer ${props.token}` } });
        const allTasks: Task[] = await taskRes.json();
        const matching = allTasks.find((t) => t.id === taskId);
        if (matching) selectedTask.value = matching;

        alert("✓ تم رفع المستند بنجاح وحفظه بالخادم!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      isUploading.value = false;
    }
  };
};

const handleSubmitTaskForReview = async () => {
  if (!selectedTask.value) return;
  try {
    const response = await fetch(`/api/tasks/${selectedTask.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ status: TaskStatus.UNDER_REVIEW }),
    });
    if (response.ok) {
      const updated = await response.json();
      selectedTask.value = updated;
      tasks.value = tasks.value.map((t) => (t.id === updated.id ? updated : t));
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};

const handleSendChat = async () => {
  if (!chatInput.value) return;

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ message: chatInput.value, receiverId: "all" }),
    });
    if (response.ok) {
      chatInput.value = "";
      fetchData();
    }
  } catch (err) {
    console.error(err);
  }
};
</script>
