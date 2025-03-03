<template>
  <div>
    <p v-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!integration">Loading...</p>
    <p v-else-if="!authOption">No auth options found for this integration</p>

    <div v-else class="connection-container">
      <div class="d-fl-grow1">
        <div class="d-d-flex d-fd-row d-ai-flex-start d-g16">
          <img v-if="integration?.logoUri" :src="integration.logoUri" :alt="integration.name" class="button-logo" />
          <div>
            <h3 class="integration-name">{{ integration.name }}</h3>

            <!-- Added subtitle -->
            <p v-if="!connection" class="integration-subtitle">
              Connect your account to get started
            </p>

            <!-- Connection Parameters Form  -->
            <div v-if="fields.length > 0">
              <strong>Connection Parameters:</strong>
              <div v-for="field in fields" :key="field">
                <label>{{ field }}</label>
                <input type="text" v-model="connectionParameters[field]" />
              </div>
            </div>

            <!-- Connection Status -->
            <div v-if="connection" class="connection-status">
              Connection ID: <span style="font-family: monospace;" class="d-ff-mono">{{ connection.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <div c="right-section" class="d-d-flex d-jc-flex-end">
        <DtButton @click="connection ? disconnect() : showModal = true">
          <div v-if="connecting" class="spinner"></div>
          <span v-else>{{ connection ? 'Disconnect' : 'Connect' }}</span>
        </DtButton>
      </div>

      <!-- Modal -->
      <div v-if="showModal" style="top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5);"
        class="d-d-flex d-jc-center d-ai-center d-ps-fixed  d-w100p d-h100p d-zi-navigation"
        @click.self="showModal = false">
        <div style="background-color: #f5f5f5; min-height: 60vh;" class="d-bar8 d-wmx512">
          <div style="border-bottom: 1px solid #e0e0e0;" class="modal-header d-p8 d-d-flex d-g4">
            <img class="d-w24 d-bar2" :src="integration.logoUri" :alt="integration.name" />
            <span>{{ integration.name }}</span>
          </div>

          <div class="d-p24">
            <img class="d-w48 d-bar2" :src="integration.logoUri" :alt="integration.name" />
            <div class="d-mt12">
              <h3>Linking your {{ integration.name }} account</h3>
              <p>
                Please click Connect to log into Google Drive and authorize
                access. Your login information will not be shared with us.
              </p>
            </div>

            <div class="d-d-flex d-g4 d-jc-space-between d-mt24">
              <DtButton @click="connect">Connect</DtButton>
              <DtButton class="d-fc-purple-400" importance="outlined" @click="showModal = false" kind="inverted">Cancel
              </DtButton>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getClient, sampleAccessToken } from '../utils/client';
import { DtButton } from "@dialpad/dialtone-vue";

export default {
  name: 'CustomConnection',
  components: {
    DtButton
  },
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


.button-logo {
  width: 40px;
  height: 40px;
}

.connection-status {
  font-size: 0.9em;
  color: #666;
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

.integration-subtitle {
  color: #666;
  font-size: 0.9em;
  margin: 0 0 0.5rem 0;
}
</style>