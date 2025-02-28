<template>
  <div>
    <p v-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!integration">Loading...</p>
    <p v-else-if="!authOption">No auth options found for this integration</p>

    <div v-else class="connection-container">
      <div class="left-section">
        <div class="connection-info">
          <img v-if="integration?.logoUri" :src="integration.logoUri" :alt="integration.name" class="button-logo" />
          <div>
            <h3 class="integration-name">{{ integration.name }}</h3>

            <!-- Added subtitle -->
            <p v-if="!connection" class="integration-subtitle">
              Connect your account to get started
            </p>

            <!-- Connection Parameters Form -->
            <div v-if="fields.length > 0">
              <strong>Connection Parameters:</strong>
              <div v-for="field in fields" :key="field">
                <label>{{ field }}</label>
                <input type="text" v-model="connectionParameters[field]" />
              </div>
            </div>

            <!-- Connection Status -->
            <div v-if="connection" class="connection-status">
              Connection ID: <span class="connection-id">{{ connection.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="right-section">
        <button @click="connection ? disconnect() : showModal = true"
          :class="['connect-button', connection ? 'disconnect' : '']">
          <div v-if="connecting" class="spinner"></div>
          <span v-else>{{ connection ? 'Disconnect' : 'Connect' }}</span>
        </button>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal" @click.self="showModal = false">
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

            <div class="modal-footer">
              <button @click="connect" class="connect-button">Connect</button>
            </div>
          </div>
        </div>
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
    },
    async disconnect() {
      this.connecting = true;
      try {
        const client = await getClient(sampleAccessToken);
        await client.integration(this.integrationKey).disconnect();
        this.connection = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.connecting = false;
      }
    }
  }
}
</script>

<style scoped>
.connection-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

.connection-container::before {
  content: '';
  position: absolute;
  bottom: -20px;
  left: -20px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #ff8f00 0%, #ff6d00 100%);
  filter: blur(60px);
  opacity: 0.2;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
}

.left-section {
  flex: 1;
}

.right-section {
  display: flex;
  justify-content: flex-end;
  min-width: 200px;
}

.connection-info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.integration-name {
  margin: 0 0 0.5rem 0;
}

.button-logo {
  width: 40px;
  height: 40px;
}

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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;

}

.connect-button {
  background-color: #2196F3;
  border: none;
  color: white;
  padding: 8px 16px;
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
  background-color: #1976D2;
}

.connect-button.disconnect {
  background-color: #dc3545;
}

.connect-button.disconnect:hover {
  background-color: #c82333;
}

.connection-status {
  font-size: 0.9em;
  color: #666;
}

.connection-id {
  color: #999;
  font-family: monospace;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.connect-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.integration-subtitle {
  color: #666;
  font-size: 0.9em;
  margin: 0 0 0.5rem 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>