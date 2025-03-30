import React from 'react'
import Swal from "sweetalert2";

export default function Preregister() {

    const handleLogout = (event) => {
        event.preventDefault();
        console.log("Logging out...");

        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
            window.location.replace("/signup");
        }, 500);
    };

    const handleLogoutClick = (event) => {
        event.stopPropagation();

        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No, Stay",
            width: '500px',
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(event);
            }
        });

    }

        return (
            <div>
                HELLO WORLD
                <a href="#" onClick={handleLogoutClick}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </a>
            </div>
            
        )
    }
