<template>
  <div class="container">
    <div class="logo-container">
      <img src="https://vite.dev/logo.svg" alt="Logo" class="logo">
    </div>
    <div class="integrations-list">
      <div v-for="integration in integrations" :key="integration.id" class="integration-card">
        <CustomConnection :integration-key="integration.key" />
      </div>
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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.integrations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.integration-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  max-width: 67px;
  height: auto;
}
</style>

<style>
body {
  font-family: 'Instrument Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}
</style>
