import React from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup';
import { io } from 'socket.io-client';

function InviteToGameModal({ open, closeModal, inviteData }) {
    const navigate = useNavigate();
    const socket = io(import.meta.env.VITE_API_URL)

    const accept = () => {
        closeModal();
        navigate('/online/' + inviteData.newGame._id)
        socket.emit('acceptInvite', inviteData);
    }

    const decline = () => {
        closeModal();
        socket.emit('declineInvite', inviteData);
    }
    return (
        <Popup open={open} closeOnDocumentClick onClose={closeModal} modal>
            <div className="modal rounded-lg bg-black p-10 w-[90vw] md:w-[50vw] text-center">
                <div className="header text-2xl md:text-3xl">Game Invitation</div>
                <div className="content text-lg md:text-xl">
                    You've been invited to a game by <span className='text-[#646cff]'>{inviteData?.username}</span>.
                </div>
                <div className="actions grid grid-cols-12 gap-3 mt-5">
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-span-5 md:col-span-4" onClick={accept}>
                        Accept
                    </button>
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-start-8 sm:col-span-5 md:col-start-9 md:col-span-4" onClick={decline}>
                        Decline
                    </button>
                </div>
            </div>
        </Popup>
    )
}

export default InviteToGameModal