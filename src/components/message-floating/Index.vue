<script setup>
import { ref } from "@vue/reactivity";
  const messagePage = ref(false)

  function sendMessage() {
    messagePage.value = false
    window.open('https://api.whatsapp.com/send?phone=15551234567')
  }
</script>

<template>
<div>
  <div class="message-button" @click="messagePage = true">
    <div class="message-button-icon d-flex align-items-center justify-content-center rounded-circle shadow-lg">
      <i class="bi bi-chat-text-fill fs-2x text-white"></i>
    </div>
  </div>
  <Transition name="slide-fade">
    <div class="message-layout rounded-3" v-if="messagePage">
      <div class="message-page">
        <div class="opening-message">
          Hello, how we can help you?
        </div>
        <div class="close-message" @click="messagePage = false">
          <i class="bi bi-x-circle-fill text-danger fs-1"></i>
        </div>
      </div>
      <div class="message-input d-flex align-items-center gap-4">
        <input type="email" class="form-control rounded-pill border-none p-4">
        <div>
          <div class="send-button" @click="sendMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#ffffff" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</div>
</template>

<style>
.message-button {
  position: fixed;
  bottom: 30px; right: 30px;
  z-index: 11;
  display: inline;
}
.message-layout {
  position: fixed;
  bottom: 30px; right: 30px;
  z-index: 11;
  display: inline;
  overflow: hidden;
}
.message-page {
  padding: 20px;
  background: #e6ddd4;
  height: 300px;
  position: relative;
  z-index: 2;
}
.message-page::before {
  display: block;
  position: absolute;
  content: "";
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 0;
  opacity: 0.1;
  background: url('../../../public/media/patterns/whatsapp.png');
}
.close-message {
  position: absolute;
  top: 10px; right: 10px;
  cursor: pointer;
}
.opening-message {
  position: relative;
  background: #fff;
  width: 80%;
  border-radius: 0 8px 8px;
  padding: 10px;
  margin-left: 10px
}
.opening-message::before {
  position: absolute;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURUxpccPDw9ra2m9vbwAAAAAAADExMf///wAAABoaGk9PT7q6uqurqwsLCycnJz4+PtDQ0JycnIyMjPf3915eXvz8/E9PT/39/RMTE4CAgAAAAJqamv////////r6+u/v7yUlJeXl5f///5ycnOXl5XNzc/Hx8f///xUVFf///+zs7P///+bm5gAAAM7Ozv///2fVensAAAAvdFJOUwCow1cBCCnqAhNAnY0WIDW2f2/hSeo99g1lBYT87vDXG8/6d8oL4sgM5szrkgl660OiZwAAAHRJREFUKM/ty7cSggAABNFVUQFzwizmjPz/39k4YuFWtm55bw7eHR6ny63+alnswT3/rIDzUSC7CrAziPYCJCsB+gbVkgDtVIDh+DsE9OTBpCtAbSBAZSEQNgWIygJ0RgJMDWYNAdYbAeKtAHODlkHIv997AkLqIVOXVU84AAAAAElFTkSuQmCC);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  content: "";
  top: 0;
  left: -12px;
  width: 12px;
  height: 19px;
}
.message-input {
  padding: 10px 20px;
  background: #F0F0F0;
}
.message-input input {
  width: 260px;
}
.send-button {
  background: #25D366;
  border-radius: 50px;
  height: 47px;
  width: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.message-button-icon {
  width: 50px;
  height: 50px;
  background: #38D654;
  cursor: pointer;
}


.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

</style>