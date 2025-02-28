<template>
  <div>
    <!-- Integration List -->
    <div v-for="integration in integrations" :key="integration.id" class="integration-card">
      <CustomConnection :integration-key="integration.key" />
    </div>
  </div>
</template>

<script>
import { getClient, sampleAccessToken } from './utils/client';
import CustomConnection from './components/CustomConnection.vue';

export default {
  name: 'HelloWorld',
  components: {
    CustomConnection
  },
  data() {
    return {
      integrations: []
    }
  },
  async created() {
    const client = await getClient(sampleAccessToken);
    const integrations = await client.integrations.find();
    this.integrations = integrations.items;
  }
}
</script>

<style scoped>
.integration-card {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px;
  display: flex;
  flex-direction: column;
}
</style>
