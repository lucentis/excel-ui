<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CustomTab from './CustomTab.vue'
import EditionTab from './EditionTab.vue'

const activeTab = ref('custom')
</script>

<template>
  <div class="w-80 border-l bg-white flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-lg">Configuration</h3>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs v-model="activeTab" class="flex-1 flex flex-col">
      <TabsList class="mx-4 mt-4 grid w-auto grid-cols-2">
        <TabsTrigger value="custom">Custom</TabsTrigger>
        <TabsTrigger value="edition">Edition</TabsTrigger>
      </TabsList>

      <TabsContent value="custom" class="flex-1 overflow-hidden mt-0">
        <CustomTab />
      </TabsContent>

      <TabsContent value="edition" class="flex-1 overflow-hidden mt-0">
        <EditionTab />
      </TabsContent>
    </Tabs>
  </div>
</template>