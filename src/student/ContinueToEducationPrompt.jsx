import Swal from 'sweetalert2';

const ContinueToEducationPrompt = async () => {
    const result = await Swal.fire({
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Continue to Education Section',
        cancelButtonText: 'Stay Here',
    });

    return result.isConfirmed;
};

export default ContinueToEducationPrompt;
