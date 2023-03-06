import loginVue from './Index.vue';
const loginModal = {};
loginModal.install = (Vue) => {
  let login;
  const LoginInstance = Vue.extend(loginVue),
  initInstance = () => {
    login = new LoginInstance();
    const msgBoxEl = login.$mount().$el;
    document.body.appendChild(msgBoxEl);
  };
  Vue.prototype.$loginModal = {
    show() {
      if (!login) {
        initInstance();
      }
      login.showModal();
    }
  };
};
export default loginModal;
