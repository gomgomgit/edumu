import Swal from 'sweetalert2'

export function deleteConfirmation (confirm, cancel, title = 'Anda yakin ingin menghapus data ini?') {
  Swal.fire({
    title: title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
  }).then((result) => {
    if (result.isConfirmed) {
      confirm()
    }else if (result.isDenied) {
      cancel()
    }
  })
};