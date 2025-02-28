<template>
  <div>
    <p v-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!integration">Loading...</p>
    <p v-else-if="!authOption">No auth options found for this integration</p>

    <div v-else>
      <!-- Connection Parameters Form -->
      <div v-if="fields.length > 0">
        <strong>Connection Parameters:</strong>
        <div v-for="field in fields" :key="field">
          <label>{{ field }}</label>
          <input type="text" v-model="connectionParameters[field]" />
        </div>
      </div>

      <!-- Connect Button -->
      <span v-if="connecting">Connecting...</span>
      <button v-else @click="showModal = true" class="connect-button">
        Connect {{ integrationKey }}
      </button>

      <!-- Modal -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ integration.name }}</h2>
          </div>

          <div class="modal-body">
            <img :style="{ width: '100px', height: '100px', borderRadius: '10px' }" :src="integration.logoUri"
              :alt="integration.name" />

            <div style="margin-top: 10px">
              <h3>Linking your {{ integration.name }} account</h3>
              <p>
                Please click Connect to log into Google Drive and authorize
                access. Your login information will not be shared with us.
              </p>
            </div>

            <button @click="connect" class="connect-button">Connect</button>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div v-if="connection">
        <strong>Connected!</strong>
        <br />
        Connection Id: {{ connection.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { getClient, sampleAccessToken } from '../utils/client';

export default {
  name: 'CustomConnection',
  props: {
    integrationKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      connectionParameters: {},
      connecting: false,
      connection: null,
      integration: null,
      error: null,
      showModal: false,
      authOption: null,
      fields: []
    }
  },
  async created() {
    await this.getIntegration();
  },
  methods: {
    async getIntegration() {
      try {
        const client = await getClient(sampleAccessToken);
        const integration = await client.integration(this.integrationKey).get();

        if (integration.connection) {
          this.connection = integration.connection;
        }

        this.integration = integration;
        this.authOption = integration.authOptions?.[0];

        // Get connection parameters schema
        const schema = this.authOption?.ui?.schema;
        this.fields = schema ? Object.keys(schema.properties ?? {}) : [];
      } catch (err) {
        this.error = err;
      }
    },
    async connect() {
      this.connecting = true;
      try {
        const client = await getClient(sampleAccessToken);
        const connection = await client.integration(this.integrationKey).connect({
          parameters: this.connectionParameters,
          authOptionKey: this.authOption.key,
        });

        this.showModal = false;
        this.connection = connection;
      } catch (err) {
        this.error = err;
      } finally {
        this.connecting = false;
        this.showModal = false;
      }
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
}

.connect-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.connect-button:hover {
  background-color: #45a049;
}
</style>