<template>
  <div
    v-if="show"
    :class="{ minimized: minimized, maximized: !minimized, videocall: true }"
    class="videocall"
  >
    <b-button pill variant="success" class="button" @click="toggleMinimize">{{
      minimized ? 'Maximizar' : 'Minimizar'
    }}</b-button>
    <vue-jitsi-meet
      ref="jitsiRef"
      :domain="jitsiServerUrl"
      :options="jitsiOptions"
    ></vue-jitsi-meet>
  </div>
</template>

<script>
import { JitsiMeet } from '@mycure/vue-jitsi-meet'
export default {
  components: {
    VueJitsiMeet: JitsiMeet,
  },
  props: {
    isContinuation: {
      type: Boolean,
    },
  },
  data() {
    return {
      minimized: false,
      jitsiServerUrl: process.env.jitsiServerUrl,
    }
  },

  computed: {
    show() {
      return this.$store.state.showVideoCall
    },
    jitsiOptions() {
      return {
        roomName: this.$store.state.activeRoom.replace(/\W/g, ''),
        noSSL: false,
        userInfo: {
          email: '',
          displayName: this.$auth.user.name,
        },
        configOverwrite: {
          enableNoisyMicDetection: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
        onload: this.onIFrameLoad,
      }
    },
  },
  watch: {
    show(current, old) {
      if (current === true && old === false) {
        this.minimized = false
      }
    },
  },
  created() {},
  methods: {
    onIFrameLoad() {
      this.$refs.jitsiRef.addEventListener(
        'videoConferenceLeft',
        this.onVideoCallEnd
      )
    },
    onVideoCallEnd() {
      this.$store.commit('stopVideoCall')
    },
    toggleMinimize() {
      this.minimized = !this.minimized
    },
  },
}
</script>
<style>
.videocall {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  border: 1px solid gray;
  background-color: rgba(40, 40, 40, 0.7);
}
.maximized {
  top: 0;
  left: 40%;
}
.minimized {
  right: 0;
  height: 300px;
  width: 300px;
}
.button {
  position: absolute;
  margin-bottom: -100px;
  z-index: 100000000;
}
</style>
