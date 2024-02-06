import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

/**
 * icon : success, error, warning, info, question
 */

const MySwal = withReactContent(Swal)

// 기본 alert
export const alert = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: "#522b07",
        confirmButtonText: "OK",
        confirmButtonTextColor: "white",
    })
    .then( callback )
  }

// confirm
export const confirm = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: "lightgray",
        cancelButtonText: "No",
        confirmButtonColor: "#522b07",
        confirmButtonText: "Yes",
    })
        .then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
}

export const confirms = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: "gray",
        cancelButtonText: "No",
        confirmButtonColor: "#522b07",
        confirmButtonText: "Yes",
    })
        .then( callback )
}
