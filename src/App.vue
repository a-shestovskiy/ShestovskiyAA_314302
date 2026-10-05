<script setup>
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { ADMIN, INSPECTOR, state } from './stores/state'

const { mdAndUp } = useDisplay()
const drawer = ref(false)
const route = useRoute()
const router = useRouter()

const shell = computed(() => !route.meta.public)
const isAdmin = computed(() => state.user?.role === ADMIN)

const inspectorMenu = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', title: 'Главная' },
  { to: '/new', icon: 'mdi-file-plus-outline', title: 'Новая заявка' },
  { to: '/archive', icon: 'mdi-archive-outline', title: 'Архив заявок' }
]
const adminMenu = [
  { to: '/admin/users', icon: 'mdi-account-cog-outline', title: 'Пользователи' },
  { to: '/admin/metrics', icon: 'mdi-tune-variant', title: 'Риск-метрики' },
  { to: '/admin/audit', icon: 'mdi-clipboard-text-clock-outline', title: 'Журнал аудита' }
]

function logout() {
  state.user = null
  router.push('/login')
}
</script>

<template>
  <v-app>
    <template v-if="shell">
      <v-navigation-drawer :model-value="mdAndUp || drawer" :permanent="mdAndUp" @update:model-value="drawer = $event" width="248" class="sidebar">
        <div class="d-flex align-center px-5" style="height: 64px">
          <v-icon icon="mdi-shield-check-outline" size="28" color="white" class="mr-3" />
          <div>
            <div style="color: #fff; font-weight: 600; line-height: 18px">РискСкоринг</div>
            <div style="color: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 16px">Кредитный отдел</div>
          </div>
        </div>
        <v-divider style="border-color: rgba(255, 255, 255, 0.12)" class="mb-3" />
        <v-list nav bg-color="transparent" density="comfortable">
          <template v-if="!isAdmin">
            <v-list-subheader>Работа с заявками</v-list-subheader>
            <v-list-item
              v-for="m in inspectorMenu"
              :key="m.to"
              :to="m.to"
              :prepend-icon="m.icon"
              :title="m.title"
            />
          </template>
          <template v-else>
            <v-list-subheader>Администрирование</v-list-subheader>
            <v-list-item v-for="m in adminMenu" :key="m.to" :to="m.to" :prepend-icon="m.icon" :title="m.title" />
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar flat border="b" height="64" color="surface">
        <v-app-bar-nav-icon v-if="!mdAndUp" @click="drawer = !drawer" />
        <v-app-bar-title class="t-h3" style="font-size: 16px">{{ isAdmin ? 'Рабочее место администратора' : 'Рабочее место кредитного инспектора' }}</v-app-bar-title>
        <v-spacer />
        <div class="text-right mr-3 d-none d-sm-block" style="line-height: 18px">
          <div style="font-weight: 500">{{ state.user?.fio }}</div>
          <div class="t-caption">{{ state.user?.role }}</div>
        </div>
        <v-avatar color="primary" size="36" class="mr-2"><v-icon icon="mdi-account" /></v-avatar>
        <v-btn icon="mdi-logout" variant="text" title="Выйти" @click="logout" />
      </v-app-bar>
    </template>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
