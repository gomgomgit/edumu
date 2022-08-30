const CurrentUser = "current_user" as string;

/**
 * @description get token form localStorage
 */
export const getUser = () => {
  var user = {
    user_id: window.localStorage.getItem('user_id'),
    user_level: window.localStorage.getItem('user_level'),
    user_nama: window.localStorage.getItem('user_nama'),
    user_username: window.localStorage.getItem('user_username'),
    user_foto: window.localStorage.getItem('user_foto'),

    sekolah_id: window.localStorage.getItem('sekolah_id'),
    sekolah_kode: window.localStorage.getItem('sekolah_kode'),
    sekolah_nama: window.localStorage.getItem('sekolah_nama'),
    sekolah_foto: window.localStorage.getItem('sekolah_foto'),
  };
  return user;
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveUser = (user): void => {
  window.localStorage.setItem('user_id', user.user_id);
  window.localStorage.setItem('user_level', user.user_level);
  window.localStorage.setItem('user_nama', user.user_nama);
  window.localStorage.setItem('user_username', user.user_username);
  window.localStorage.setItem('user_foto', user.user_foto);

  window.localStorage.setItem('sekolah_id', user.sekolah_id);
  window.localStorage.setItem('sekolah_kode', user.sekolah_kode);
  window.localStorage.setItem('sekolah_nama', user.sekolah_nama);
  window.localStorage.setItem('sekolah_foto', user.sekolah_foto);
};

/**
 * @description remove token form localStorage
 */
export const destroyUser = (): void => {
  window.localStorage.removeItem('user_id');
  window.localStorage.removeItem('user_level');
  window.localStorage.removeItem('user_nama');
  window.localStorage.removeItem('user_username');
  window.localStorage.removeItem('user_foto');

  window.localStorage.removeItem('sekolah_id');
  window.localStorage.removeItem('sekolah_kode');
  window.localStorage.removeItem('sekolah_nama');
  window.localStorage.removeItem('sekolah_foto');
};

export default { getUser, saveUser, destroyUser };
